import Topic from "../model/topic.model.js";

export const getTopics = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.moduleId) filter.moduleId = req.query.moduleId;
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
    await topic.populate({ path: "moduleId", select: "title courseId", populate: { path: "courseId", select: "title" } });
    return res.status(201).json({ success: true, data: topic, message: "Topic created successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
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