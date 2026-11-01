import AuditLog from "../models/auditLog.model.js";

export async function recordAudit(req, { action, resource, resourceId, details }) {
  if (!["admin", "owner"].includes(req.user.role)) return;

  await AuditLog.create({
    actor: req.user._id,
    actorRole: req.user.role,
    action,
    resource,
    resourceId,
    details,
  });
}
