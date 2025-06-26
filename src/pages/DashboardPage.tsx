import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHabit, getHabits } from "../lib/firestore/habits";
import CalendarGrid from "../components/CalendarGrid";


interface Habit {
  id: string;
  name: string;
  goal: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
 const [habitRowCount, setHabitRowCount] = useState(0);

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
  const openModal = () => { setShowModal(true);
  
  }
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    habitMutation.mutate({
      name: formData.habit,
      goal: Number(formData.goal),
    });
    setHabitRowCount((prev) => prev + 1)
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
      {/* Display habits */}
      <div className="mt-10">
        {isLoading ? (
          <p>Loading habits...</p>
        ) : (
          <ul>
            {habits.map((habit: Habit) => (
              <li key={habit.id}>
                {habit.name} - Goal: {habit.goal} days
              </li>
            ))}
          </ul>
        )}
      </div>
      <CalendarGrid rowCount = {habitRowCount} />
    </section>
  );
};

export default DashboardPage;
