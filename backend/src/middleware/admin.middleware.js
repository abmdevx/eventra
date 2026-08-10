
import ApiError from "../utils/apiError.js";
export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied");
    }

    next();
};