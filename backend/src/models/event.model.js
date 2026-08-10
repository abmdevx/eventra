import mongoose, {model, Schema} from "mongoose";

const eventSchema = new Schema(
  {
    // TODO: Add fields e.g. title, description, date, location, capacity
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export default model("Event", eventSchema);