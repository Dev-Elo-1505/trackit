import { eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

export const getDaysInMonth = (year: number, month: number) => {
  return eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  });
};