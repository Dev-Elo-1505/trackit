import { useState } from "react";
import { getDaysInMonth } from "../utils/getDaysInMonth";
import { format, getMonth, getYear } from "date-fns";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import type { Habit } from "../pages/DashboardPage";

interface CalendarGridProps {
  habits: Habit[]
}

const CalendarGrid = ({habits}: CalendarGridProps) => {
  const today = new Date();
  const [month, setMonth] = useState(getMonth(today));
  const [year, setYear] = useState(getYear(today));

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

  return (
     <div className="mt-7">
      {/* Month Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className="text-xl cursor-pointer"><FaArrowLeft /></button>
        <h2 className="text-lg font-semibold">
          {format(new Date(year, month), "MMMM yyyy")}
        </h2>
        <button onClick={goToNextMonth} className="text-xl cursor-pointer"><FaArrowRight /></button>
      </div>

      {/* Scrollable Calendar Row */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead>
          <tr>
            <th rowSpan={2} colSpan={3}className="text-center py-2 sticky left-0 bg-white z-10 px-12 border border-gray-300">Habits</th>
            {daysInMonth.map((date) => (
              <td key={date.toISOString()} className="p-2 border border-gray-300 ">
                <div className="text-center w-5">
                  {format(date, "EEE").charAt(0)}
                </div>
                
              </td>
            ))}
            <th rowSpan={2} className="text-center py-2 px-6 border border-gray-300">Goal</th>
            <th rowSpan={2}className="text-center py-2 px-6 border border-gray-300">Achieved</th>
          </tr>
          <tr>
            
            {daysInMonth.map((date) => (
              <td key={date.toISOString()} className="p-2 border border-gray-300">
                <div className="text-center">
                  {format(date, "d")}
                </div>
              </td>
            ))}
          </tr>
          </thead>
          <tbody>
            
            {habits.map((habit) => (
              
              <tr key={habit.id}>
                <td colSpan={3}className="text-center border border-gray-300 sticky left-0 bg-white z-10">{habit.name}</td>
                {daysInMonth.map((date)=> (
                  <td key={date.toISOString()} className="p-2 border border-gray-300">
                    
                    <div className="h-5 w-5 mx-auto rounded cursor-pointer"></div>
                  </td>
                ))}
                <td className="text-center border border-gray-300">{habit.goal}</td>
                <td className="text-center border border-gray-300">0</td>
              </tr>
               ))}
          </tbody>
          
        </table>
      </div>
    </div>
    
  );
};

export default CalendarGrid;
