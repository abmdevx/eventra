import User from "../models/user.model.js";
import Registration from "../models/registration.model.js";
import jwt from "jsonwebtoken"
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
const generateTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens!");
    }
}

// @desc  GET /api/users
export const getAllUsers = AsyncHandler(async (req, res) => {
  // TODO: const users = await User.find(); res.status(200).json(users);

  const users = await User.find();

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      users,
      "Users found successfully!"
  ))
});

// @desc  GET /api/users/:id
export const getCurrentUser = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.findById(req.params.id);

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      req?.user,
      "User found successfully!"
  ))
});

// @desc  POST /api/users
export const createUser = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.create(req.body); res.status(201).json(user);

  const { name, email, password, role } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existedUser = await User.findOne({ email: normalizedEmail });

  if(existedUser) {
    throw new ApiError(400, "An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role
  });

  if(!user) {
    throw new ApiError(500, "User could not be created.");
  }

  return res.
  status(201)
  .json(new ApiResponse(
      201,
      user,
      "User created successfully!"
  ))  
});

// @desc  POST /api/users
export const loginUser = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.create(req.body); res.status(201).json(user);

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if(!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if(!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const optionsForCookies = {
    httpOnly: true,
    secure: true
  } // these options -> optionsForCookies

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  if(!loggedInUser) {
    throw new ApiError(404, "User not found.");
  }

  return res.
  status(200)
  .cookie("accessToken", accessToken, optionsForCookies)
  .cookie("refreshToken", refreshToken, optionsForCookies)
  .json(new ApiResponse(
      200,
      {loggedInUser, accessToken, refreshToken},
      "User logged in successfully!"
  ))
});

// @desc  GET /api/users/:id
export const logoutUser = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.findById(req.params.id);

  const user = await User.findById(req.user._id);
  
  if(!user) {
    throw new ApiError(404, "User not found.");
  }

  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: 
          {
              refreshToken: 1 // this remove the field from the document
          }
      },

      {
          new: true
      }
  )

  const optionsForCookies = {
    httpOnly: true,
    secure: true
  } // these options -> optionsForCookies

  return res
  .status(200)
  .clearCookie("accessToken", optionsForCookies)
  .clearCookie("refreshToken", optionsForCookies)
  .json(new ApiResponse(
      200,
      null,
      "User logged out successfully!"
  ))
});

// @desc  PUT /api/users/:id
export const updateUser = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

  const { name, email } = req.body;

  // check here if email, name already exists

  const existedUser = await User.findOne({
    $or : [{ name }, { email }]
  })

  if(existedUser) {
    throw new ApiError(400, "User already exists.");
  }
 
  const user = await User.findByIdAndUpdate(req.params.id, {
    name,
    email
  }, { new: true });

  if(!user) {
    throw new ApiError(400, "User could not be updated.");
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      user,
      "User updated successfully!"
  ))
});

export const changePassword = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

  const { oldPassword, newPassword } = req.body;

  // find user first

  const user = await User.findById(req.user._id);

  if(!user) {
    throw new ApiError(404, "User not found.");
  }

  // compare password is the old password is correct

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if(!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password.");
  }

  // update password

  user.password = newPassword;
  await user.save();

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      {},
      "Password changed successfully!"
  ))
});

// @desc  GET /api/users
export const refreshAccessToken = AsyncHandler(async (req, res) => {
  // TODO: const user = await User.findById(req.params.id);
  const user_refresh_Token = req.cookies.refreshToken || req.body.refreshToken;

    if(!user_refresh_Token)
    {
        throw new ApiError(401, "unauthorized request!");
    }

    // at this point we have the token lets verify it

    const decodedToken = jwt.verify(user_refresh_Token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if(!user)
    {
        throw new ApiError(401, "Invalid Refresh Token!");
    }

    if(user_refresh_Token !== user?.refreshToken)
    {
        throw new ApiError(401, "Refresh Token is expired or used!");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    const cookies_options = {
        httpOnly: true,
        secure: true
    }; // with these options these cookies are only modifiable by the server

    return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookies_options)
    .cookie("refreshToken", newRefreshToken, cookies_options)
    .json(
        new ApiResponse(
            200,
            {
                newAccessToken, newRefreshToken
            },
            "Access Token Refreshed Successfully!"
        )
    );
});

// @desc  DELETE /api/users/:id

// NOTE: When we are deleting a user then it should also delete his/her registrations from events
export const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = req.user._id.toString() === user._id.toString();

  if (isAdmin && isOwner) {
    throw new ApiError(403, "Admins cannot delete their own account.");
  }

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "Access denied.");
  }

  await User.findByIdAndDelete(req.params.id);
  await Registration.deleteMany({ user: req.params.id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "User deleted successfully!"
      )
    );
});