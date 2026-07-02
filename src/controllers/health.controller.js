import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

import AsyncHandler from "../utils/asyncHandler.js";

export const healthcheck = AsyncHandler(async (_, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const dbStatus = mongoose.connection.readyState === 1;

    if (!dbStatus) 
    {
        throw new ApiError(500, "Database not connected");
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Server is running successfully!"
    ))
})