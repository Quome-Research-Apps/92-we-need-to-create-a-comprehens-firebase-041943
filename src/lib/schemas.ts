import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required."),
  credits: z.coerce.number().min(0, "Credits must be a positive number.").max(10, "Credits seem too high."),
});

export const gradeSchema = z.object({
  name: z.string().min(1, "Assignment name is required."),
  score: z.coerce.number().min(0, "Score must be positive.").max(120, "Score can't exceed 120."),
  weight: z.coerce.number().min(0, "Weight must be positive.").max(100, "Weight can't exceed 100."),
});
