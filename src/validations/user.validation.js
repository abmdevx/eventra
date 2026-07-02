import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name cannot exceed 10 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z
    .enum(["user", "admin"])
});

// user.validation.js

export const updateUserSchema = createUserSchema.partial();

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8)
});