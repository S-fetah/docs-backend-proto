import { z } from "zod";

export const assignSchema = z.object({
  user_id: z.int().positive(),
  grade_name: z.string().min(3),
  newGrade_name: z.string().min(3).optional(),
});
