import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHabit, getHabits, updateHabit } from "../lib/firestore/habits";
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
  mutationFn: ({ habitId, dateISO }: { habitId: string; dateISO: string }) => {
    if (!user?.uid) throw new Error("User not authenticated");
    return updateHabit(user.uid, habitId, dateISO);
  },
  onMutate: async ({ habitId, dateISO }) => {
    await queryClient.cancelQueries({ queryKey: ["habits", user?.uid] });

    const previousHabits = queryClient.getQueryData<Habit[]>(["habits", user?.uid]);

    queryClient.setQueryData<Habit[]>(["habits", user?.uid], (oldHabits = []) =>
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


  const openModal = () => { setShowModal(true);
  
  }
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
      >Save</button>
        </form>
      </Modal>
      {!isLoading && <CalendarGrid habits={habits} onTick={(habitId, dateISO) => {
        updateHabitMutation.mutate({ habitId, dateISO });
      }} />}
    </section>
  );
};

export default DashboardPage;
