import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  updateHabitDetails,
} from "../lib/firestore/habits";
import CalendarGrid from "../components/CalendarGrid";

export interface Habit {
  id: string;
  name: string;
  goal: number;
  completedDates?: string[];
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editModalHabit, setEditModalHabit] = useState<Habit | null>(null);
  const [editFormData, setEditFormData] = useState({ habit: "", goal: "" });
  const [deleteModalHabit, setDeleteModalHabit] = useState<Habit | null>(null);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ habit: "", goal: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Get habits
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["habits", user?.uid],
    queryFn: () => getHabits(user!.uid),
    enabled: !!user?.uid,
  });

  // Create habit
  const habitMutation = useMutation({
    mutationFn: (newHabit: { name: string; goal: number }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return createHabit(user.uid, newHabit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.uid] });
      setShowModal(false);
      setFormData({ habit: "", goal: "" });
    },
  });

  // Update habit
  const updateHabitMutation = useMutation({
    mutationFn: ({
      habitId,
      dateISO,
    }: {
      habitId: string;
      dateISO: string;
    }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return updateHabit(user.uid, habitId, dateISO);
    },
    onMutate: async ({ habitId, dateISO }) => {
      await queryClient.cancelQueries({ queryKey: ["habits", user?.uid] });

      const previousHabits = queryClient.getQueryData<Habit[]>([
        "habits",
        user?.uid,
      ]);

      queryClient.setQueryData<Habit[]>(
        ["habits", user?.uid],
        (oldHabits = []) =>
          oldHabits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  completedDates: habit.completedDates?.includes(dateISO)
                    ? habit.completedDates.filter((d) => d !== dateISO)
                    : [...(habit.completedDates || []), dateISO],
                }
              : habit
          )
      );

      return { previousHabits };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits", user?.uid], context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.uid] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (habitId: string) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return deleteHabit(user.uid, habitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.uid] });
    },
  });

  const updateHabitDetailsMutation = useMutation({
    mutationFn: ({
      habitId,
      updates,
    }: {
      habitId: string;
      updates: { name: string; goal: number };
    }) => {
      return updateHabitDetails(habitId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.uid] });
    },
  });

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    habitMutation.mutate({
      name: formData.habit,
      goal: Number(formData.goal),
    });
  };

  return (
    <section className="mt-10">
      <h1 className="font-medium text-2xl mb-5">
        welcome, {user?.displayName} !
      </h1>
      <button
        className="btn bg-primary hover:bg-[#ffd23e] text-text flex items-center gap-1"
        onClick={openModal}
      >
        <FaPlus />
        add habit
      </button>
      <Modal isOpen={showModal} onClose={closeModal}>
        <h2>start tracking a new habit</h2>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mt-7">
            <label htmlFor="habit" className="font-semibold">
              habit
            </label>
            <input
              type="text"
              name="habit"
              id="habit"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="e.g work out"
              value={formData.habit}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-7">
            <label htmlFor="goal" className="font-semibold">
              goal (in days)
            </label>
            <input
              type="number"
              name="goal"
              id="goal"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="e.g 10"
              value={formData.goal}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4"
            type="submit"
          >
            Save
          </button>
        </form>
      </Modal>
      {deleteModalHabit && (
  <Modal isOpen={!!deleteModalHabit}  onClose={() => setDeleteModalHabit(null)}>
    <div className="p-4">
      <p className="text-lg">
        Delete <strong>{deleteModalHabit.name}</strong>?
      </p>
      <p className="text-sm text-gray-600 mt-2">
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4 mt-6">
        <button 
          onClick={() => setDeleteModalHabit(null)}
          className="px-4 py-2 border border-gray-300 rounded cursor-pointer"
        >
          Cancel
        </button>
        <button
  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 cursor-pointer"
  onClick={() => {
    deleteHabitMutation.mutate(deleteModalHabit.id);
    setDeleteModalHabit(null);
  }}
  disabled={deleteHabitMutation.isPending}
>
  {deleteHabitMutation.isPending ? "Deleting..." : "Delete"}
</button>
      </div>
    </div>
  </Modal>
)}
      {editModalHabit && (
  <Modal isOpen={!!editModalHabit} onClose={() => setEditModalHabit(null)}>
    <h2>Edit Habit</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      updateHabitDetailsMutation.mutate({
        habitId: editModalHabit.id,
        updates: {
          name: editFormData.habit,
          goal: Number(editFormData.goal)
        }
      });
      setEditModalHabit(null);
    }} className="mt-5">
      <div className="mt-7">
        <label htmlFor="edit-habit" className="font-semibold">
          Habit
        </label>
        <input
          type="text"
          name="habit"
          id="edit-habit"
          className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
          value={editFormData.habit}
          onChange={(e) => setEditFormData(prev => ({...prev, habit: e.target.value}))}
        />
      </div>
      <div className="mt-7">
        <label htmlFor="edit-goal" className="font-semibold">
          Goal (in days)
        </label>
        <input
          type="number"
          name="goal"
          id="edit-goal"
          className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
          value={editFormData.goal}
          onChange={(e) => setEditFormData(prev => ({...prev, goal: e.target.value}))}
        />
      </div>
      <button
  className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4 disabled:opacity-50"
  type="submit"
  disabled={updateHabitDetailsMutation.isPending}
>
  {updateHabitDetailsMutation.isPending ? "Updating..." : "Update Habit"}
</button>
    </form>
  </Modal>
)}
      {!isLoading && (
        <CalendarGrid
          habits={habits}
          onTick={(habitId, dateISO) => {
            updateHabitMutation.mutate({ habitId, dateISO });
          }}
          onEditHabit={(habit) => {
    setEditModalHabit(habit);
    setEditFormData({
      habit: habit.name,
      goal: habit.goal.toString()
    });
  }}
  onDeleteHabit={(habit) => setDeleteModalHabit(habit)}
        />
      )}
    </section>
  );
};

export default DashboardPage;
