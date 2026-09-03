import Module from "../model/module.model.js";
import Course from "../model/course.model.js";
import Topic from "../model/topic.model.js";

// ======================================================
// CREATE MODULE
// POST /api/modules
// ======================================================

export const createModule = async (req, res) => {
  try {
    const { courseId, courseIds, title, description, order, duration, isPublished, topics } = req.body;
    const selectedCourseIds = [...new Set(
      (Array.isArray(courseIds) ? courseIds : [courseId]).filter(Boolean),
    )];

    // ----------------------------------------------
    // Validation
    // ----------------------------------------------

    if (selectedCourseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Course is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    // ----------------------------------------------
    // Check Course
    // ----------------------------------------------

    const courses = await Course.find({
      _id: { $in: selectedCourseIds },
      isActive: true,
    });

    if (courses.length !== selectedCourseIds.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ----------------------------------------------
    // Automatic Order
    // ----------------------------------------------

    const modules = await Promise.all(selectedCourseIds.map(async (selectedCourseId) => {
      let moduleOrder = Number(order);
      if (!moduleOrder || moduleOrder < 1) {
        const lastModule = await Module.findOne({ courseId: selectedCourseId, isActive: true }).sort({ order: -1 });
        moduleOrder = lastModule ? lastModule.order + 1 : 1;
      }

      return Module.create({
        courseId: selectedCourseId,
        title: title.trim(),
        description: description?.trim() || "",
        order: moduleOrder,
        duration: { value: Number(duration?.value || 0), unit: duration?.unit || "hours" },
        isPublished: Boolean(isPublished),
        isActive: true,
        createdBy: req.user._id,
      });
    }));

    await Promise.all(modules.map((module) => Course.findByIdAndUpdate(module.courseId, {
      $addToSet: { modules: module._id },
    })));

    const topicData = Array.isArray(topics) ? topics.filter((topic) => topic?.title?.trim()) : [];
    if (topicData.length) {
      await Promise.all(modules.map(async (module) => {
        const createdTopics = await Topic.create(topicData.map((topic, index) => ({
          moduleId: module._id,
          title: topic.title.trim(),
          description: topic.description?.trim() || "",
          type: topic.type || "Lesson",
          duration: { value: Number(topic.duration?.value || 0), unit: topic.duration?.unit || "minutes" },
          order: index + 1,
        })));
        module.topics = createdTopics.map((topic) => topic._id);
        await module.save();
      }));
    }

    return res.status(201).json({
      success: true,
      message: `${modules.length} module${modules.length === 1 ? "" : "s"} created successfully`,
      data: modules,
    });
  } catch (error) {
    console.error("CREATE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create module",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL MODULES
// GET /api/modules
// ======================================================

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find({
      isActive: true,
    })
      .populate("courseId", "title courseCode")
      .populate("topics")
      .sort({
        courseId: 1,
        order: 1,
      });

    return res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    console.error("GET MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get modules",
      error: error.message,
    });
  }
};

// ======================================================
// GET MODULES BY COURSE
// GET /api/modules/course/:courseId
// ======================================================

export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const modules = await Module.find({
      courseId,
      isActive: true,
    })
      .populate("topics")
      .sort({
        order: 1,
      });

    return res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    console.error("GET COURSE MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get course modules",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE MODULE
// GET /api/modules/:id
// ======================================================

export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .populate("courseId", "title courseCode")
      .populate("topics");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error) {
    console.error("GET MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get module",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE MODULE
// PUT /api/modules/:id
// ======================================================

export const updateModule = async (req, res) => {
  try {
    const { courseId, title, description, order, duration, isPublished, topics } =
      req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    // ----------------------------------------------
    // Check Course
    // ----------------------------------------------

    const course = await Course.findOne({
      _id: courseId,
      isActive: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ----------------------------------------------
    // Find Module
    // ----------------------------------------------

    const module = await Module.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const oldCourseId = module.courseId.toString();

    // ----------------------------------------------
    // Update
    // ----------------------------------------------

    module.courseId = courseId;

    module.title = title.trim();

    module.description = description?.trim() || "";

    module.order = Number(order) || 1;

    module.duration = {
      value: Number(duration?.value || 0),
      unit: duration?.unit || "hours",
    };

    if (typeof isPublished === "boolean") {
      module.isPublished = isPublished;
    }

    if (Array.isArray(topics)) {
      await Topic.deleteMany({ moduleId: module._id });
      const topicData = topics.filter((topic) => topic?.title?.trim());
      const createdTopics = topicData.length ? await Topic.create(topicData.map((topic, index) => ({
        moduleId: module._id,
        title: topic.title.trim(),
        description: topic.description?.trim() || "",
        type: topic.type || "Lesson",
        duration: { value: Number(topic.duration?.value || 0), unit: topic.duration?.unit || "minutes" },
        order: index + 1,
      }))) : [];
      module.topics = createdTopics.map((topic) => topic._id);
    }

    module.updatedBy = req.user._id;

    await module.save();

    // ----------------------------------------------
    // If Course Changed
    // ----------------------------------------------

    if (oldCourseId !== courseId.toString()) {
      await Course.findByIdAndUpdate(oldCourseId, {
        $pull: {
          modules: module._id,
        },
      });

      await Course.findByIdAndUpdate(courseId, {
        $addToSet: {
          modules: module._id,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: module,
    });
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update module",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE MODULE
// DELETE /api/modules/:id
// ======================================================

export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // Soft delete

    module.isActive = false;
    module.isPublished = false;
    module.updatedBy = req.user._id;

    await module.save();

    // Remove from course

    await Course.findByIdAndUpdate(module.courseId, {
      $pull: {
        modules: module._id,
      },
    });
    await Topic.deleteMany({ moduleId: module._id });

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete module",
      error: error.message,
    });
  }
};

// ======================================================
// PUBLISH / UNPUBLISH
// PATCH /api/modules/:id/publish
// ======================================================

export const toggleModulePublish = async (req, res) => {
  try {
    const module = await Module.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.isPublished = !module.isPublished;

    module.updatedBy = req.user._id;

    await module.save();

    return res.status(200).json({
      success: true,

      message: module.isPublished
        ? "Module published successfully"
        : "Module unpublished successfully",

      data: module,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update publish status",
      error: error.message,
    });
  }
};

// ======================================================
// REORDER
// PATCH /api/modules/:id/order
// ======================================================

export const reorderModule = async (req, res) => {
  try {
    const order = Number(req.body.order);

    if (!order || order < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid order is required",
      });
    }

    const module = await Module.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true,
      },
      {
        order,
        updatedBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module reordered successfully",
      data: module,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reorder module",
      error: error.message,
    });
  }
};
