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
import { getHabitSuggestions, testGeminiConnection } from "../lib/ai";
import toast from "react-hot-toast";

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
  console.log("Gemini API Key:", import.meta.env.VITE_GEMINI_API_KEY);

  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Add this useEffect hook
useEffect(() => {
  const testConnection = async () => {
    try {
      const data = await testGeminiConnection();
      console.log("Gemini Connection Successful:", data);
    } catch (error) {
      console.error("Gemini Connection Failed:", error);
      console.error("Gemini API connection failed. Check console for details.");
    }
  };
  
  if (user?.uid) {
    testConnection();
  }
}, [user?.uid]);
  const handleSuggestions = async () => {
    if (!user?.uid) return;

    setIsLoadingSuggestions(true);
    try {
      const existingHabits = habits.map((habit) => habit.name);
      const suggestions = await getHabitSuggestions(existingHabits);

      if (Array.isArray(suggestions)) {
        setAiSuggestions(suggestions);
      } else {
        alert("Couldn't get suggestions. Please try again.");
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  console.log("Gemini suggestions:", aiSuggestions);

  const applySuggestion = (suggestion: string) => {
    setFormData({
      habit: suggestion,
      goal: "30", // Default goal
    });
    setAiSuggestions(null); // Close suggestions modal
    setShowModal(true); // Open create habit modal
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
      <button
        className="btn bg-primary hover:bg-[#ffd23e] text-text flex items-center gap-1"
        onClick={handleSuggestions}
      >
        need habit ideas?
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

      {aiSuggestions && (
        <Modal isOpen={true} onClose={() => setAiSuggestions(null)}>
          <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">AI Habit Suggestions</h2>

            {aiSuggestions.length > 0 ? (
              <>
                <p className="mb-4 text-gray-600">
                  Based on your current habits, we recommend:
                </p>

                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => {
                        setFormData({
                          habit: suggestion,
                          goal: "30",
                        });
                        setAiSuggestions(null);
                        setShowModal(true);
                      }}
                    >
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  No suggestions could be generated
                </p>
                <button
                  className="btn bg-blue-500 text-white"
                  onClick={handleSuggestions}
                >
                  Try Again
                </button>
              </div>
            )}

            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setAiSuggestions(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateHabitDetailsMutation.mutate({
                habitId: editModalHabit.id,
                updates: {
                  name: editFormData.habit,
                  goal: Number(editFormData.goal),
                },
              });
              setEditModalHabit(null);
            }}
            className="mt-5"
          >
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
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    habit: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, goal: e.target.value }))
                }
              />
            </div>
            <button
              className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4 disabled:opacity-50"
              type="submit"
              disabled={updateHabitDetailsMutation.isPending}
            >
              {updateHabitDetailsMutation.isPending
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
            setEditFormData({
              habit: habit.name,
              goal: habit.goal.toString(),
            });
          }}
          onDeleteHabit={(habit) => setDeleteModalHabit(habit)}
        />
      )}
    </section>
  );
};

export default DashboardPage;
