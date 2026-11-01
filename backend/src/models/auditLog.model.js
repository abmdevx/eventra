import { model, Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actorRole: { type: String, enum: ["admin", "owner"], required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export default model("AuditLog", auditLogSchema);
