import Course from "../model/course.model.js";
import Module from "../model/module.model.js";
import mongoose from "mongoose";

const getDuration = (duration) =>
  typeof duration === "string" ? JSON.parse(duration) : duration;

const getCourseData = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim(),
  shortDescription: body.shortDescription?.trim() || body.description?.trim(),
  duration: getDuration(body.duration),
  courseFee: Number(body.courseFee),
  registrationFee: Number(body.registrationFee || 0),
  certificateFee: Number(body.certificateFee || 0),
  category: body.category || "General",
  level: body.level || "Beginner",
});

const hasRequiredData = (course) =>
  course.title &&
  course.description &&
  course.duration?.value &&
  !Number.isNaN(course.courseFee);

export const listCourses = async (_req, res) => {
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
  return res.json({ success: true, data: courses, count: courses.length });
};

export const getCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate({
      path: "modules",
      match: { isActive: true },
      options: { sort: { order: 1 } },
      populate: { path: "topics" },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.json({ success: true, data: course });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get course" });
  }
};

export const updateCourseModules = async (req, res) => {
  try {
    const { moduleIds = [] } = req.body;
    if (
      !Array.isArray(moduleIds) ||
      moduleIds.some((id) => !mongoose.isValidObjectId(id))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Valid module IDs are required" });
    }
    const modules = await Module.find({
      _id: { $in: moduleIds },
      isActive: true,
    }).select("_id");
    if (modules.length !== new Set(moduleIds).size)
      return res
        .status(404)
        .json({ success: false, message: "One or more modules not found" });
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $set: { modules: [...new Set(moduleIds)], updatedBy: req.user._id } },
      { new: true, runValidators: true },
    ).populate({
      path: "modules",
      match: { isActive: true },
      options: { sort: { order: 1 } },
      populate: { path: "topics" },
    });
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    return res.json({
      success: true,
      message: "Course modules updated successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update course modules",
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const data = getCourseData(req.body);

    if (!hasRequiredData(data)) {
      return res.status(400).json({
        success: false,
        message: "Title, description, duration and course fee are required",
      });
    }

    const titleAlreadyUsed = await Course.exists({ title: data.title });
    if (titleAlreadyUsed) {
      return res.status(409).json({
        success: false,
        message: "A course with this title already exists",
      });
    }

    const uploadedImages = (req.files || []).map(
      (file) => `/upload/${file.filename}`,
    );

    const course = await Course.create({
      ...data,
      images: uploadedImages,
      thumbnail: uploadedImages[0] || "",
      isPublished: true,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({
        success: false,
        message: "A course with this title already exists",
      });
    throw error;
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updates = getCourseData(req.body);
    if (req.files?.length) {
      updates.images = req.files.map((file) => `/upload/${file.filename}`);
      updates.thumbnail = updates.images[0];
    }

    if (mongoose.isValidObjectId(req.user._id)) {
      updates.updatedBy = req.user._id;
    }

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res.json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { isActive: false, updatedBy: req.user._id },
    { new: true },
  );
  if (!course)
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  return res.json({
    success: true,
    id: req.params.id,
    message: "Course deleted successfully",
  });
};
export const listFranchiseCourses = async (req, res) => {
  try {
    const franchiseId = req.user?.franchiseId;

    if (!franchiseId) {
      return res.status(400).json({
        success: false,
        message: "Franchise ID not found",
      });
    }

    if (!mongoose.isValidObjectId(franchiseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid franchise ID",
      });
    }

    const courses = await Course.find({
      isActive: true,
      isPublished: true,
      availableForFranchises: franchiseId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("listFranchiseCourses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch franchise courses",
      error: error.message,
    });
  }
};
