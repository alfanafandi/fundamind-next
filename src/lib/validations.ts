import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh huruf, angka, dan underscore"
    ),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const submitAnswerSchema = z.object({
  questionId: z.number(),
  answer: z.enum(["a", "b", "c", "d"]),
});

export const buyItemSchema = z.object({
  itemId: z.number(),
});

export const useItemSchema = z.object({
  itemId: z.number(),
  context: z.enum(["quest", "challenge", "boss"]).optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z
    .enum(["Ellipse_1", "Ellipse_2", "Ellipse_3", "Ellipse_4", "Ellipse_5"])
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type BuyItemInput = z.infer<typeof buyItemSchema>;
export type UseItemInput = z.infer<typeof useItemSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
