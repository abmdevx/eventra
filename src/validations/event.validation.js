import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),

  date: z.coerce
  .date()
  .refine(
    (date) => date > new Date(),
    {
      message: "Date must be in the future",
    }
  ),

  location: z
    .string()
    .min(3, "Location is required"),

  capacity: z
    .number()
    .min(1, "Capacity must be greater than 0")
});

export const updateEventSchema = createEventSchema.partial();