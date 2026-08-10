import Event from "../models/event.model.js";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import AsyncHandler from "../utils/asyncHandler.js";
import ai from "../utils/gemini.js";

// @desc  GET /api/events
export const getAllEvents = AsyncHandler(async (req, res) =>{
  // TODO: const events = await Event.find(); res.status(200).json(events);

  const events = await Event.find();

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      events,
      "Events found successfully!"
  ))
})

// @desc  GET /api/events/:id
export const getEventById = AsyncHandler(async (req, res) => {
  // TODO: const event = await Event.findById(req.params.id);

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Event ID is required.");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      event,
      "Event found successfully!"
  ))
})

// @desc  POST /api/events
export const createEvent = AsyncHandler(async (req, res) =>{
  // TODO: const event = await Event.create(req.body); res.status(201).json(event);

  const { title, description, date, location, capacity } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    capacity
  });
  
  if(!event) {
    throw new ApiError(500, "Event could not be created.");
  }

  return res
  .status(201)
  .json(new ApiResponse(
      201,
      event,
      "Event created successfully!"
  ))
})

// @desc  PUT /api/events/:id
export const updateEvent = AsyncHandler(async (req, res) =>{
  // TODO: const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

  const { title, description, date, location, capacity } = req.body;

  const event = await Event.findByIdAndUpdate(req.params.id, {
    title,
    description,
    date,
    location,
    capacity
  }, { new: true });

  if(!event) {
    throw new ApiError(400, "Event could not be updated.");
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      event,
      "Event updated successfully!"
  ))
})

// @desc  DELETE /api/events/:id
export const deleteEvent = AsyncHandler(async (req, res) =>{
  // TODO: await Event.findByIdAndDelete(req.params.id);

  const event = await Event.findByIdAndDelete(req.params.id);

  if(!event) {
    throw new ApiError(400, "Event could not be deleted.");
  }

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      event,
      "Event deleted successfully!"
  ))
})

export const writeEventMessage = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  
  if (!event) {

    throw new ApiError(404, "Event not found.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Write a professional and engaging event description for an event titled "${event.title}". The description must be between 20 and 30 words. Return only the description without quotation marks, headings, bullet points, or any extra text.`,
  });
  
  event.description = response.text;
  event.save();

  return res
  .status(200)
  .json(new ApiResponse(
      200,
      event,
      "Event description with Ai generated successfully!"
  ))
})