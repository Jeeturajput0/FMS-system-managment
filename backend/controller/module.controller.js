import mongoose from "mongoose";

import Module from "../model/module.model.js";
import Course from "../model/course.model.js";


// =====================================================
// CREATE MODULE
// POST /api/modules
// =====================================================

export const createModule = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      order,
      thumbnail,
      duration,
      isPublished,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    // -----------------------------------------------
    // CHECK COURSE
    // -----------------------------------------------

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -----------------------------------------------
    // DUPLICATE MODULE CHECK
    // -----------------------------------------------

    const existingModule = await Module.findOne({
      courseId,
      title: {
        $regex: `^${title.trim()}$`,
        $options: "i",
      },
    });

    if (existingModule) {
      return res.status(409).json({
        success: false,
        message: "Module with this title already exists in this course",
      });
    }

    // -----------------------------------------------
    // AUTO ORDER
    // -----------------------------------------------

    let moduleOrder;

    if (order !== undefined && order !== null) {
      moduleOrder = Number(order);
    } else {
      const lastModule = await Module.findOne({
        courseId,
      }).sort({
        order: -1,
      });

      moduleOrder = lastModule
        ? lastModule.order + 1
        : 1;
    }

    // -----------------------------------------------
    // CREATE MODULE
    // -----------------------------------------------

    const newModule = await Module.create({
      courseId,

      title: title.trim(),

      description:
        description?.trim() || "",

      order: moduleOrder,

      thumbnail:
        thumbnail || "",

      duration: {
        value: Number(duration?.value || 0),
        unit: duration?.unit || "hours",
      },

      isPublished:
        isPublished ?? false,

      createdBy: req.user._id,
    });

    // -----------------------------------------------
    // ADD MODULE ID TO COURSE
    // -----------------------------------------------

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          modules: newModule._id,
        },
      }
    );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      module: newModule,
    });

  } catch (error) {
    console.error(
      "Create Module Error:",
      error
    );

    // Duplicate index error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Module with this title already exists in this course",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create module",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL MODULES
// GET /api/modules
// =====================================================

export const getModules = async (req, res) => {
  try {
    const {
      courseId,
      search = "",
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // -----------------------------------------------
    // COURSE FILTER
    // -----------------------------------------------

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      query.courseId = courseId;
    }

    // -----------------------------------------------
    // SEARCH
    // -----------------------------------------------

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------------------------
    // STATUS FILTER
    // -----------------------------------------------

    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    if (status === "published") {
      query.isPublished = true;
    }

    if (status === "draft") {
      query.isPublished = false;
    }

    // -----------------------------------------------
    // PAGINATION
    // -----------------------------------------------

    const pageNumber = Math.max(
      Number(page),
      1
    );

    const limitNumber = Math.max(
      Number(limit),
      1
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // -----------------------------------------------
    // FETCH
    // -----------------------------------------------

    const [modules, total] =
      await Promise.all([
        Module.find(query)
          .populate(
            "courseId",
            "title slug"
          )
          .populate(
            "createdBy",
            "name email"
          )
          .populate(
            "topics",
            "title order"
          )
          .sort({
            order: 1,
            createdAt: 1,
          })
          .skip(skip)
          .limit(limitNumber),

        Module.countDocuments(query),
      ]);

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Modules fetched successfully",

      data: modules,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(
          total / limitNumber
        ),
      },
    });

  } catch (error) {
    console.error(
      "Get Modules Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch modules",
      error: error.message,
    });
  }
};


// =====================================================
// GET MODULES BY COURSE
// GET /api/modules/course/:courseId
// =====================================================

export const getModulesByCourse = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;

    // -----------------------------------------------
    // VALIDATE COURSE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        courseId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // -----------------------------------------------
    // CHECK COURSE
    // -----------------------------------------------

    const course = await Course.findById(
      courseId
    ).select(
      "title slug"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // -----------------------------------------------
    // FETCH MODULES
    // -----------------------------------------------

    const modules = await Module.find({
      courseId,
      isActive: true,
    })
      .populate(
        "topics",
        "title description order isPublished"
      )
      .sort({
        order: 1,
      });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Course modules fetched successfully",

      course,

      count: modules.length,

      data: modules,
    });

  } catch (error) {
    console.error(
      "Get Modules By Course Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course modules",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE MODULE
// GET /api/modules/:id
// =====================================================

export const getModuleById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // -----------------------------------------------
    // FETCH MODULE
    // -----------------------------------------------

    const module = await Module.findById(id)
      .populate(
        "courseId",
        "title slug description"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "updatedBy",
        "name email role"
      )
      .populate(
        "topics"
      );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Module fetched successfully",
      module,
    });

  } catch (error) {
    console.error(
      "Get Module Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch module",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE MODULE
// PUT /api/modules/:id
// =====================================================

export const updateModule = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // -----------------------------------------------
    // FIND MODULE
    // -----------------------------------------------

    const module = await Module.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -----------------------------------------------
    // BODY
    // -----------------------------------------------

    const {
      title,
      description,
      order,
      thumbnail,
      duration,
      isPublished,
      isActive,
    } = req.body;

    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    if (
      title !== undefined &&
      title.trim() !== module.title
    ) {
      const duplicate =
        await Module.findOne({
          courseId: module.courseId,

          title: {
            $regex: `^${title.trim()}$`,
            $options: "i",
          },

          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Another module with this title already exists in this course",
        });
      }

      module.title = title.trim();
    }

    // -----------------------------------------------
    // DESCRIPTION
    // -----------------------------------------------

    if (
      description !== undefined
    ) {
      module.description =
        description.trim();
    }

    // -----------------------------------------------
    // ORDER
    // -----------------------------------------------

    if (order !== undefined) {
      module.order = Number(order);
    }

    // -----------------------------------------------
    // THUMBNAIL
    // -----------------------------------------------

    if (
      thumbnail !== undefined
    ) {
      module.thumbnail = thumbnail;
    }

    // -----------------------------------------------
    // DURATION
    // -----------------------------------------------

    if (
      duration !== undefined
    ) {
      module.duration = {
        value: Number(
          duration.value || 0
        ),

        unit:
          duration.unit ||
          module.duration.unit,
      };
    }

    // -----------------------------------------------
    // PUBLISHED
    // -----------------------------------------------

    if (
      isPublished !== undefined
    ) {
      module.isPublished =
        isPublished;
    }

    // -----------------------------------------------
    // ACTIVE
    // -----------------------------------------------

    if (
      isActive !== undefined
    ) {
      module.isActive =
        isActive;
    }

    // -----------------------------------------------
    // UPDATED BY
    // -----------------------------------------------

    module.updatedBy =
      req.user._id;

    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    await module.save();

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module,
    });

  } catch (error) {
    console.error(
      "Update Module Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Module with this title already exists in this course",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update module",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE MODULE
// DELETE /api/modules/:id
// =====================================================

export const deleteModule = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // -----------------------------------------------
    // FIND MODULE
    // -----------------------------------------------

    const module = await Module.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // Save courseId before deleting
    const courseId =
      module.courseId;

    // -----------------------------------------------
    // SOFT DELETE MODULE
    // -----------------------------------------------

    module.isActive = false;
    module.isPublished = false;
    module.updatedBy =
      req.user._id;

    await module.save();

    // -----------------------------------------------
    // REMOVE MODULE FROM COURSE
    // -----------------------------------------------

    await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          modules: module._id,
        },
      }
    );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Module Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete module",
      error: error.message,
    });
  }
};


// =====================================================
// PUBLISH / UNPUBLISH MODULE
// PATCH /api/modules/:id/publish
// =====================================================

export const toggleModulePublish = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // -----------------------------------------------
    // FIND MODULE
    // -----------------------------------------------

    const module =
      await Module.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // -----------------------------------------------
    // TOGGLE
    // -----------------------------------------------

    module.isPublished =
      !module.isPublished;

    module.updatedBy =
      req.user._id;

    await module.save();

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      message: module.isPublished
        ? "Module published successfully"
        : "Module unpublished successfully",

      module,
    });

  } catch (error) {
    console.error(
      "Toggle Module Publish Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update module status",
      error: error.message,
    });
  }
};


// =====================================================
// REORDER MODULE
// PATCH /api/modules/:id/order
// =====================================================

export const reorderModule = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { order } = req.body;

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // -----------------------------------------------
    // VALIDATE ORDER
    // -----------------------------------------------

    if (
      order === undefined ||
      order === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Module order is required",
      });
    }

    const newOrder = Number(order);

    if (
      !Number.isInteger(newOrder) ||
      newOrder < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Module order must be a positive integer",
      });
    }

    // -----------------------------------------------
    // FIND MODULE
    // -----------------------------------------------

    const module =
      await Module.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const oldOrder =
      module.order;

    // -----------------------------------------------
    // IF SAME ORDER
    // -----------------------------------------------

    if (oldOrder === newOrder) {
      return res.status(200).json({
        success: true,
        message: "Module order unchanged",
        module,
      });
    }

    // -----------------------------------------------
    // MOVING DOWN
    // -----------------------------------------------

    if (newOrder > oldOrder) {
      await Module.updateMany(
        {
          courseId: module.courseId,

          order: {
            $gt: oldOrder,
            $lte: newOrder,
          },

          _id: {
            $ne: module._id,
          },
        },
        {
          $inc: {
            order: -1,
          },
        }
      );
    }

    // -----------------------------------------------
    // MOVING UP
    // -----------------------------------------------

    if (newOrder < oldOrder) {
      await Module.updateMany(
        {
          courseId: module.courseId,

          order: {
            $gte: newOrder,
            $lt: oldOrder,
          },

          _id: {
            $ne: module._id,
          },
        },
        {
          $inc: {
            order: 1,
          },
        }
      );
    }

    // -----------------------------------------------
    // UPDATE CURRENT MODULE
    // -----------------------------------------------

    module.order = newOrder;

    module.updatedBy =
      req.user._id;

    await module.save();

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Module reordered successfully",
      module,
    });

  } catch (error) {
    console.error(
      "Reorder Module Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reorder module",
      error: error.message,
    });
  }
};