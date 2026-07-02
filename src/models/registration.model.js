import mongoose, {model, Schema} from "mongoose";

const registrationSchema = new Schema(
  {
    // TODO: Add fields
    // user:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // event:  { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    // status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    event:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },

    status:{
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default model("Registration", registrationSchema);
