import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitFormData } from "../lib/schemas";

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
  const [deleteModalHabit, setDeleteModalHabit] = useState<Habit | null>(null);

  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState("");

  // Form for Creating Habit
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate, isSubmitting: isCreating },
    reset: resetCreate,
  } = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0, 
    },
  });

  // Form for Editing Habit
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit, isSubmitting: isEditing },
    reset: resetEdit,
  } = useForm({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      goal: 0,
    },
  });

  // Reset Edit Form when modal opens
  useEffect(() => {
    if (editModalHabit) {
      resetEdit({
        name: editModalHabit.name,
        goal: editModalHabit.goal,
      });
    }
  }, [editModalHabit, resetEdit]);

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
    onMutate: () => setCreateError(""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.uid] });
      setShowModal(false);
      resetCreate();
    },
    onError: (error) => {
      setCreateError(error.message);
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
    resetCreate(); 
  };
  const closeModal = () => {
    setShowModal(false);
    setCreateError("");
    resetCreate();
  };

  const onCreateSubmit = (data: HabitFormData) => {
    // console.log("Creating habit with:", data, user?.uid);
    habitMutation.mutate({
      name: data.name,
      goal: Number(data.goal),
    });
  };

  const onEditSubmit = (data: HabitFormData) => {
    if (!editModalHabit) return;
    updateHabitDetailsMutation.mutate({
      habitId: editModalHabit.id,
      updates: {
        name: data.name,
        goal: Number(data.goal),
      },
    });
    setEditModalHabit(null);
  };

  return (
    <section className="mt-10">
      <h1 className="font-medium text-2xl mb-5">
        welcome, {user?.displayName?.toLowerCase() || "there"}!
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
        <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="mt-5">
          <div className="mt-7">
            <label htmlFor="habit" className="font-semibold">
              habit
            </label>
            <input
              type="text"
              id="habit"
              className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                errorsCreate.name ? "border-red-500" : "border-light"
              }`}
              placeholder="e.g work out"
              {...registerCreate("name")}
            />
            {errorsCreate.name && (
              <p className="text-red-500 text-xs mt-1">
                {errorsCreate.name.message}
              </p>
            )}
          </div>
          <div className="mt-7">
            <label htmlFor="goal" className="font-semibold">
              goal (in days)
            </label>
            <input
              type="number"
              id="goal"
              className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                errorsCreate.goal ? "border-red-500" : "border-light"
              }`}
              placeholder="e.g 10"
              {...registerCreate("goal")}
            />
            {errorsCreate.goal && (
              <p className="text-red-500 text-xs mt-1">
                {errorsCreate.goal.message}
              </p>
            )}
          </div>
          {createError && (
            <p className="text-red-500 text-sm mt-2">{createError}</p>
          )}
          <button
            className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4 disabled:opacity-50"
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "Saving..." : "Save"}
          </button>
        </form>
      </Modal>

      {deleteModalHabit && (
        <Modal
          isOpen={!!deleteModalHabit}
          onClose={() => setDeleteModalHabit(null)}
        >
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
        <Modal
          isOpen={!!editModalHabit}
          onClose={() => setEditModalHabit(null)}
        >
          <h2>Edit Habit</h2>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="mt-5">
            <div className="mt-7">
              <label htmlFor="edit-habit" className="font-semibold">
                Habit
              </label>
              <input
                type="text"
                id="edit-habit"
                className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                  errorsEdit.name ? "border-red-500" : "border-light"
                }`}
                {...registerEdit("name")}
              />
              {errorsEdit.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errorsEdit.name.message}
                </p>
              )}
            </div>
            <div className="mt-7">
              <label htmlFor="edit-goal" className="font-semibold">
                Goal (in days)
              </label>
              <input
                type="number"
                id="edit-goal"
                className={`border rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700 ${
                  errorsEdit.goal ? "border-red-500" : "border-light"
                }`}
                {...registerEdit("goal")}
              />
              {errorsEdit.goal && (
                <p className="text-red-500 text-xs mt-1">
                  {errorsEdit.goal.message}
                </p>
              )}
            </div>
            <button
              className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4 disabled:opacity-50"
              type="submit"
              disabled={isEditing || updateHabitDetailsMutation.isPending}
            >
              {isEditing || updateHabitDetailsMutation.isPending
                ? "Updating..."
                : "Update Habit"}
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
          }}
          onDeleteHabit={(habit) => setDeleteModalHabit(habit)}
        />
      )}
    </section>
  );
};

export default DashboardPage;
