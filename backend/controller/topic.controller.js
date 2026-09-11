import Topic from "../model/topic.model.js";
import Module from "../model/module.model.js";
import Student from "../model/student.model.js";
import Course from "../model/course.model.js";

const studentCanAccessModule = async (user, moduleId) => {
  if (user.role !== "STUDENT") return true;
  const module = await Module.findById(moduleId).select("courseId").lean();
  if (!module) return false;
  const courseId = module.courseId || (await Course.findOne({ modules: moduleId }).select("_id").lean())?._id;
  const student = await Student.findOne({
    ...(user.coachingId ? { coachingId: user.coachingId } : {}),
    $or: [
      ...(user._id ? [{ userId: user._id }] : []),
      ...(user.email ? [{ email: user.email.toLowerCase() }] : []),
    ],
  }).select("courseId").lean();
  return String(student?.courseId || "") === String(courseId || "");
};

export const getTopics = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.moduleId) {
      if (!(await studentCanAccessModule(req.user, req.query.moduleId))) {
        return res.status(403).json({ success: false, message: "This module is not assigned to you" });
      }
      filter.moduleId = req.query.moduleId;
    }
    const topics = await Topic.find(filter).populate({
      path: "moduleId",
      select: "title courseId",
      populate: { path: "courseId", select: "title" },
    }).sort({ moduleId: 1, order: 1 });
    return res.json({ success: true, data: topics, count: topics.length });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { moduleId, title, description, type, duration, order } = req.body;
    if (!moduleId || !title?.trim()) {
      return res.status(400).json({ success: false, message: "Module and topic title are required" });
    }
    const topic = await Topic.create({
      moduleId,
      title: title.trim(),
      description: description?.trim() || "",
      type: type || "Lesson",
      duration: { value: Number(duration?.value || 0), unit: duration?.unit || "minutes" },
      order: Number(order) || 1,
    });
    await Module.findByIdAndUpdate(moduleId, { $addToSet: { topics: topic._id } });
    await topic.populate({ path: "moduleId", select: "title courseId", populate: { path: "courseId", select: "title" } });
    return res.status(201).json({ success: true, data: topic, message: "Topic created successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const moduleAccess = await studentCanAccessModule(req.user, (await Topic.findById(req.params.id).select("moduleId").lean())?.moduleId);
    if (!moduleAccess) {
      return res.status(403).json({ success: false, message: "This topic is not assigned to you" });
    }
    const topic = await Topic.findOne({ _id: req.params.id, isActive: true })
      .populate({
        path: "moduleId",
        select: "title courseId",
        populate: { path: "courseId", select: "title" },
      });

    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    return res.json({ success: true, data: topic });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const { moduleId, title, description, type, duration, order } = req.body;
    if (!moduleId || !title?.trim()) {
      return res.status(400).json({ success: false, message: "Module and topic title are required" });
    }
    const module = await Module.findOne({ _id: moduleId, isActive: true });
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    const existingTopic = await Topic.findOne({ _id: req.params.id, isActive: true }).select("moduleId").lean();
    if (!existingTopic) return res.status(404).json({ success: false, message: "Topic not found" });

    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      {
        moduleId,
        title: title.trim(),
        description: description?.trim() || "",
        type: type || "Lesson",
        duration: { value: Number(duration?.value || 0), unit: duration?.unit || "minutes" },
        order: Number(order) || 1,
      },
      { new: true, runValidators: true },
    ).populate({ path: "moduleId", select: "title courseId", populate: { path: "courseId", select: "title" } });
    if (String(existingTopic.moduleId) !== String(moduleId)) {
      await Module.findByIdAndUpdate(existingTopic.moduleId, { $pull: { topics: topic._id } });
      await Module.findByIdAndUpdate(moduleId, { $addToSet: { topics: topic._id } });
    }
    return res.json({ success: true, data: topic, message: "Topic updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true },
    );
    if (!topic) return res.status(404).json({ success: false, message: "Topic not found" });
    await Module.findByIdAndUpdate(topic.moduleId, { $pull: { topics: topic._id } });
    return res.json({ success: true, message: "Topic deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};