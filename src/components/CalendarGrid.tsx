import { useState } from "react";
import HabitActions from "./HabitActions";
import { getDaysInMonth } from "../utils/getDaysInMonth";
import { format, getMonth, getYear } from "date-fns";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import type { Habit } from "../pages/DashboardPage";
import toast from "react-hot-toast";

interface CalendarGridProps {
  habits: Habit[];
  onTick?: (habitId: string, dateISO: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habit: Habit) => void;
}

const CalendarGrid = ({
  habits,
  onTick,
  onEditHabit,
  onDeleteHabit,
}: CalendarGridProps) => {
  const today = new Date();
  const [month, setMonth] = useState(getMonth(today));
  const [year, setYear] = useState(getYear(today));
  const [hoveredHabitId, setHoveredHabitId] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);

  const goToNextMonth = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const goToPrevMonth = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const isDateCompleted = (habit: Habit, date: Date) => {
    return habit.completedDates?.includes(date.toISOString().split("T")[0]);
  };

  const handleTick = (habit: Habit, dateKey: string) => {
    console.log(`Toggling habit ${habit.name} for date ${dateKey}`);
    if (onTick) {
      onTick(habit.id, dateKey);
    }
  };

  return (
    <div className="mt-7">
      {/* Month Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="text-xl cursor-pointer">
          <FaArrowLeft />
        </button>
        <h2 className="text-lg font-semibold">
          {format(new Date(year, month), "MMMM yyyy")}
        </h2>
        <button onClick={goToNextMonth} className="text-xl cursor-pointer">
          <FaArrowRight />
        </button>
      </div>

      {/* Scrollable Calendar Row */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr>
              <th
                rowSpan={2}
                colSpan={3}
                className="text-center py-2 sticky left-0 bg-white z-10 px-12 border border-gray-300"
              >
                Habits
              </th>
              {daysInMonth.map((date) => (
                <td
                  key={date.toISOString()}
                  className="p-2 border border-gray-300 "
                >
                  <div className="text-center w-5">
                    {format(date, "EEE").charAt(0)}
                  </div>
                </td>
              ))}
              <th
                rowSpan={2}
                className="text-center py-2 px-6 border border-gray-300"
              >
                Goal
              </th>
              <th
                rowSpan={2}
                className="text-center py-2 px-6 border border-gray-300"
              >
                Achieved
              </th>
            </tr>
            <tr>
              {daysInMonth.map((date) => (
                <td
                  key={date.toISOString()}
                  className="p-2 border border-gray-300"
                >
                  <div className="text-center">{format(date, "d")}</div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const achieved = Math.min(
                habit.completedDates?.length || 0,
                habit.goal
              );
              if (achieved + 1 === habit.goal) {
                toast.success(
                  `Congrats! You've completed your "${habit.name}" habit goal 🎯`
                );
              }
              return (
                <tr key={habit.id}>
                  <td
                    colSpan={3}
                    className="text-center border border-gray-300 left-0 bg-white relative group"
                    onMouseEnter={() => setHoveredHabitId(habit.id)}
                    onMouseLeave={() => setHoveredHabitId(null)}
                  >
                    {habit.name}
                    {hoveredHabitId === habit.id && (
                      <HabitActions
                        
                        onEdit={() => onEditHabit(habit)}
                        onDelete={() => onDeleteHabit(habit)}
                      />
                    )}
                  </td>
                  {daysInMonth.map((date) => {
                    const dateKey = date.toISOString().split("T")[0];
                    const isCompleted = isDateCompleted(habit, date);
                    return (
                      <td
                        key={dateKey}
                        className="w-5 h-5 border border-gray-300"
                      >
                        <div
                          className={`h-full w-full mx-auto cursor-pointer flex justify-center items-center 
        ${isCompleted ? "bg-green-600 text-white text-lg" : "bg-white"}`}
                          onClick={() => handleTick(habit, dateKey)}
                        >
                          {isCompleted && "✓"}
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-center border border-gray-300">
                    {habit.goal}
                  </td>
                  <td className="text-center border border-gray-300">
                    {achieved}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarGrid;
