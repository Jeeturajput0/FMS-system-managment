import Module from "../model/module.model.js";
import Course from "../model/course.model.js";

// =========================
// CREATE MODULE
// POST /api/modules
// =========================
export const createModule = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      order,
      duration,
      isPublished,
    } = req.body;

    // Check required data
    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and title are required",
      });
    }

    // Check course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create module
    const module = await Module.create({
      courseId,
      title,
      description: description || "",
      order: order || 1,
      duration: duration || {
        value: 0,
        unit: "hours",
      },
      isPublished: isPublished || false,
      createdBy: req.user._id,
    });

    // Add module to course
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        modules: module._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create module",
      error: error.message,
    });
  }
};


// =========================
// GET ALL MODULES
// GET /api/modules
// =========================
export const getModules = async (req, res) => {
  try {
    const modules = await Module.find()
      .populate("courseId", "title")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get modules",
      error: error.message,
    });
  }
};


// =========================
// GET MODULES BY COURSE
// GET /api/modules/course/:courseId
// =========================
export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const modules = await Module.find({
      courseId: courseId,
      isActive: true,
    })
      .populate("topics")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get course modules",
      error: error.message,
    });
  }
};


// =========================
// GET SINGLE MODULE
// GET /api/modules/:id
// =========================
export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate("courseId")
      .populate("topics");

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get module",
      error: error.message,
    });
  }
};


// =========================
// UPDATE MODULE
// PUT /api/modules/:id
// =========================
export const updateModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update module",
      error: error.message,
    });
  }
};


// =========================
// DELETE MODULE
// DELETE /api/modules/:id
// =========================
export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // Soft delete
    module.isActive = false;
    module.isPublished = false;

    await module.save();

    // Remove module from course
    await Course.findByIdAndUpdate(module.courseId, {
      $pull: {
        modules: module._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete module",
      error: error.message,
    });
  }
};