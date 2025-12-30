import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  goal: z.coerce.number().min(1, "Goal must be at least 1 day"),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type HabitFormData = z.infer<typeof habitSchema>;
