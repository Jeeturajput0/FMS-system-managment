import Course from "../model/course.model.js";

const parseDuration = (duration) =>
  typeof duration === "string" ? JSON.parse(duration) : duration;
const courseData = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim(),
  shortDescription: body.shortDescription?.trim() || body.description?.trim(),
  duration: parseDuration(body.duration),
  courseFee: Number(body.courseFee),
  registrationFee: Number(body.registrationFee || 0),
  certificateFee: Number(body.certificateFee || 0),
  category: body.category || "General",
  level: body.level || "Beginner",
});

export const listCourses = async (_req, res) => {
  const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
  return res.json({ success: true, data: courses, count: courses.length });
};

export const getCourse = async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, isActive: true });
  if (!course)
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  return res.json({ success: true, data: course });
};

export const createCourse = async (req, res) => {
  try {
    const data = courseData(req.body);
    if (!data.title || !data.description || !data.duration?.value || Number.isNaN(data.courseFee)) {
      return res.status(400).json({ success: false, message: "Title, description, duration and course fee are required" });
    }

    const existingCourse = await Course.findOne({ title: data.title });
    if (existingCourse) return res.status(409).json({ success: false, message: "A course with this title already exists" });

    const course = await Course.create({
      ...data,
      images: (req.files || []).map((file) => `/upload/${file.filename}`),
      thumbnail: req.files?.[0] ? `/upload/${req.files[0].filename}` : "",
      isPublished: true,
      createdBy: req.user._id,
    });
    return res.status(201).json({ success: true, data: course, message: "Course created successfully" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A course with this title already exists" });
    throw error;
  }
};

export const updateCourse = async (req, res) => {
  const updates = courseData(req.body);
  if (req.files?.length) {
    updates.images = req.files.map((file) => `/upload/${file.filename}`);
    updates.thumbnail = updates.images[0];
  }
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { ...updates, updatedBy: req.user._id },
    { new: true, runValidators: true },
  );
  if (!course)
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  return res.json({
    success: true,
    data: course,
    message: "Course updated successfully",
  });
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
