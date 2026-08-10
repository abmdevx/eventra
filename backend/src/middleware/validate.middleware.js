import ApiError from "../utils/apiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ApiError(
          400,
          result.error.issues[0].message, // message (string)
          result.error.issues             // errors (array)
        )
      );
    }

    req.body = result.data;
    next();
  };
};