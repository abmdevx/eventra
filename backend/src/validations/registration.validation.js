import { z } from "zod";
import mongoose from "mongoose";

export const createRegistrationSchema = z.object({
  userId: z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "Invalid User ID" }
  ),

  eventId: z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "Invalid Event ID" }
  )
});

export const updateRegistrationSchema = z.object({
  status: z.enum(["confirmed", "cancelled"])
});