import Course from "../model/course.model.js";
import Module from "../model/module.model.js";
import mongoose from "mongoose";
import path from "path";
import { randomUUID } from "crypto";
import { getImageKit } from "../config/imagekit.js";

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

const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const hasValidImageSignature = (file) => {
  const bytes = file.buffer;
  if (!bytes?.length) return false;

  if (file.mimetype === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (file.mimetype === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (file.mimetype === "image/gif") {
    return bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a";
  }
  if (file.mimetype === "image/webp") {
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
};

const uploadCourseImages = async (files) => {
  if (files.some((file) => !hasValidImageSignature(file))) {
    const error = new Error("One or more uploaded files are not valid images");
    error.statusCode = 400;
    throw error;
  }

  try {
    const imagekit = getImageKit();
    const uploads = await Promise.all(
      files.map((file) => {
        const extension = imageExtensions[file.mimetype] || path.extname(file.originalname).toLowerCase();
        return imagekit.upload({
          file: file.buffer.toString("base64"),
          fileName: `course-${Date.now()}-${randomUUID()}${extension}`,
          folder: "/courses",
          useUniqueFileName: false,
        });
      }),
    );

    return uploads.map((upload) => upload.url);
  } catch (error) {
    if (error.statusCode) throw error;
    const uploadError = new Error("Failed to upload image to ImageKit");
    uploadError.statusCode = 502;
    uploadError.cause = error;
    throw uploadError;
  }
};

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

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "At least one course image is required",
      });
    }

    const titleAlreadyUsed = await Course.exists({ title: data.title });
    if (titleAlreadyUsed) {
      return res.status(409).json({
        success: false,
        message: "A course with this title already exists",
      });
    }

    const uploadedImages = await uploadCourseImages(req.files);
    let course;
    try {
      course = await Course.create({
        ...data,
        images: uploadedImages,
        thumbnail: uploadedImages[0],
        isPublished: true,
        createdBy: req.user._id,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image uploaded, but the course could not be saved to MongoDB",
      });
    }
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
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updates = getCourseData(req.body);
    if (req.files?.length) {
      updates.images = await uploadCourseImages(req.files);
      updates.thumbnail = updates.images[0];
    }

    if (mongoose.isValidObjectId(req.user._id)) {
      updates.updatedBy = req.user._id;
    }

    let course;
    try {
      course = await Course.findOneAndUpdate(
        { _id: req.params.id, isActive: true },
        { $set: updates },
        { new: true, runValidators: true },
      );
    } catch (databaseError) {
      return res.status(500).json({
        success: false,
        message: "Course could not be saved to MongoDB",
      });
    }

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
    return res.status(error.statusCode || 400).json({ success: false, message: error.message });
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
    const franchiseId = req.user?.coachingId || req.user?.franchiseId;

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
