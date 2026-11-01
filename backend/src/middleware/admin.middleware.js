
import ApiError from "../utils/apiError.js";

export const verifyAdmin = (req, res, next) => {
    if (!["admin", "owner"].includes(req.user.role)) {
        throw new ApiError(403, "Access denied");
    }

    next();
};

export const verifyOwner = (req, res, next) => {
    if (req.user.role !== "owner") {
        throw new ApiError(403, "Owner access required");
    }

    next();
};

export const requirePermission = (resource, action) => (req, res, next) => {
    if (req.user.role === "owner") {
        return next();
    }

    if (req.user.role !== "admin" || req.user.permissions?.[resource]?.[action] !== true) {
        throw new ApiError(403, `You do not have permission to ${action} ${resource}.`);
    }

    next();
};