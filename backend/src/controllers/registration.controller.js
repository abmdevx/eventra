import Registration from "../models/registration.model.js";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import AsyncHandler from "../utils/asyncHandler.js";
import { recordAudit } from "../utils/audit.js";

// @desc  GET /api/registrations
export const getAllRegistrations = AsyncHandler(async (req, res) => {
  // TODO: const list = await Registration.find().populate("user event");

  const registrations = await Registration.find().populate("user event");

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      registrations,
      "Registrations found successfully!"
  ))
});

// @desc  GET /api/myregistrations
export const getMyRegistrations = AsyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id,
  }).populate("user event");

  return res.status(200).json(
    new ApiResponse(
      200, 
      registrations, 
      "Registrations fetched successfully!"
    ));
});

// @desc  GET /api/registrations/:id
export const getRegistrationById = AsyncHandler(async (req, res) => {
  // TODO: const reg = await Registration.findById(req.params.id);

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Registration ID is required.");
  }

  const registration = await Registration.findById(id)
  .populate("user")
  .populate("event");

  if(!registration) {
    throw new ApiError(404, "Registration not found.");
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      registration,
      "Registration found successfully!"
  ))
});

// @desc  POST /api/registrations
export const createRegistration = AsyncHandler(async (req, res) => {
  // TODO: validate, check capacity, then Registration.create(req.body)

  //get user id and event id

  const { userId, eventId } = req.body;

  const user = await User.findById(userId);

  if(!user) {
    throw new ApiError(404, "User not found.");
  }

  const event = await Event.findById(eventId);

  if(!event) {
    throw new ApiError(404, "Event not found.");
  }

  const checkregistration = await Registration.findOne({
    user: userId,
    event: eventId,
    status: { $ne: "cancelled" }
  })

  // checking already registered (a cancelled registration doesn't count)
  if(checkregistration) {
    throw new ApiError(400, "User already registered for this event.");
  }

  //checking capacity — cancelled registrations free up their spot

  const totalCapacity = event.capacity;
  const usedCapacity = await Registration.countDocuments({
    event: eventId,
    status: { $ne: "cancelled" }
  })

  if(usedCapacity >= totalCapacity) {
    throw new ApiError(400, "Event capacity is full.");
  }

  const registration = await Registration.create({
    user: userId,
    event: eventId,
    status: "confirmed"
  });

  const updatedUsedCapacity = await Registration.countDocuments({
    event: eventId,
    status: { $ne: "cancelled" }
  });

  if(!registration) {
    throw new ApiError(500, "Registration not created.");
  }

  await recordAudit(req, {
    action: "created",
    resource: "registration",
    resourceId: registration._id.toString(),
    details: `User ${user.email} registered for "${event.title}".`,
  });

  return res
  .status(201)
  .json(new ApiResponse(
      201,
      {registration, usedCapacity: updatedUsedCapacity, totalCapacity},
      "Registration created successfully!"
  ))
});

// @desc  PUT /api/registrations/:id
export const updateRegistration = AsyncHandler(async (req, res) => {
  // TODO: Registration.findByIdAndUpdate(req.params.id, req.body, { new: true })

  const { status } = req.body;

  const registration = await Registration.findById(req.params.id); // in this register document we have user and event id

  if(!registration) {
    throw new ApiError(404, "Registration not found.");
  }

  // if (registration.user.toString() !== req.user._id.toString()) {
  //   throw new ApiError(403, "Access denied.");
  // }

  const isAdmin = ["admin", "owner"].includes(req.user.role);
  const isOwner = registration.user.equals(req.user._id);


  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "Access denied.");
  }
  if (isAdmin && req.user.role !== "owner" && req.user.permissions?.registrations?.update !== true) {
    throw new ApiError(403, "You do not have permission to update registrations.");
  }

  const updatedRegistration = await Registration.findByIdAndUpdate(
    req.params.id,
    {
      status,
    },
    {
      new: true,
    }
  );

  if (status === "cancelled") {
    await recordAudit(req, {
      action: "cancelled",
      resource: "registration",
      resourceId: registration._id.toString(),
      details: `Registration ${registration._id} was cancelled.`,
    });
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      updatedRegistration,
      "Registration updated successfully!"
  ))
});

// @desc  DELETE /api/registrations/:id
export const deleteRegistration = AsyncHandler(async (req, res) => {
  // TODO: await Registration.findByIdAndDelete(req.params.id);

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      throw new ApiError(404, "Registration not found.");
    }

    const isAdmin = ["admin", "owner"].includes(req.user.role);
    const isOwner = registration.user.equals(req.user._id);

    if (!isAdmin && !isOwner) {
      throw new ApiError(403, "Access denied.");
    }
    if (isAdmin && req.user.role !== "owner" && req.user.permissions?.registrations?.delete !== true) {
      throw new ApiError(403, "You do not have permission to delete registrations.");
    }

    await Registration.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Registration deleted successfully!"
        )
      );
});