import mongoose from "mongoose";
import Coaching from "../model/coaching.model.js";

/*
=========================================
CREATE FRANCHISE
POST /api/coaching
=========================================
*/

const createCoaching = async (req, res) => {
  try {
    const {
      name,
      code,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      logo,
      status,
    } = req.body;

    if (!name || !ownerName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, owner name, email and phone are required",
      });
    }

    // Check duplicate email
    const existingEmail = await Coaching.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Franchise with this email already exists",
      });
    }

    // Check duplicate code
    if (code) {
      const existingCode = await Coaching.findOne({
        code: code.toUpperCase(),
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "Franchise code already exists",
        });
      }
    }

    const coaching = await Coaching.create({
      name,
      code,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      logo,
      status: status || "pending",
      ...(mongoose.isValidObjectId(req.user?._id)
        ? { createdBy: req.user._id }
        : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Franchise created successfully",
      coaching,
    });
  } catch (error) {
    console.error("Create coaching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create franchise",
      error: error.message,
    });
  }
};

/*
=========================================
GET ALL FRANCHISES
GET /api/coaching
=========================================
*/

const getCoachings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          ownerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          city: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [coachings, total] = await Promise.all([
      Coaching.find(filter)
        .populate("createdBy", "name email role")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit)),

      Coaching.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      coachings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get coachings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch franchises",
      error: error.message,
    });
  }
};

/*
=========================================
GET SINGLE FRANCHISE
GET /api/coaching/:id
=========================================
*/

const getCoachingById = async (req, res) => {
  try {
    const coaching = await Coaching.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    return res.status(200).json({
      success: true,
      coaching,
    });
  } catch (error) {
    console.error("Get coaching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch franchise",
      error: error.message,
    });
  }
};

/*
=========================================
UPDATE FRANCHISE
PUT /api/coaching/:id
=========================================
*/

const updateCoaching = async (req, res) => {
  try {
    const {
      name,
      code,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      logo,
      status,
    } = req.body;

    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    if (email && email !== coaching.email) {
      const emailExists = await Coaching.findOne({
        email,
        _id: {
          $ne: coaching._id,
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already used by another franchise",
        });
      }
    }

    if (code) {
      const codeExists = await Coaching.findOne({
        code: code.toUpperCase(),
        _id: {
          $ne: coaching._id,
        },
      });

      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: "Franchise code already exists",
        });
      }
    }

    coaching.name = name ?? coaching.name;

    coaching.code = code?.toUpperCase() ?? coaching.code;

    coaching.ownerName = ownerName ?? coaching.ownerName;

    coaching.email = email?.toLowerCase() ?? coaching.email;

    coaching.phone = phone ?? coaching.phone;

    coaching.address = address ?? coaching.address;

    coaching.city = city ?? coaching.city;

    coaching.state = state ?? coaching.state;

    coaching.pincode = pincode ?? coaching.pincode;

    coaching.logo = logo ?? coaching.logo;

    coaching.status = status ?? coaching.status;

    if (mongoose.isValidObjectId(req.user?._id)) {
      coaching.updatedBy = req.user._id;
    }

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Franchise updated successfully",
      coaching,
    });
  } catch (error) {
    console.error("Update coaching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update franchise",
      error: error.message,
    });
  }
};

/*
=========================================
DELETE FRANCHISE
DELETE /api/coaching/:id
=========================================
*/

const deleteCoaching = async (req, res) => {
  try {
    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    // Soft delete
    coaching.status = "inactive";
    if (mongoose.isValidObjectId(req.user?._id)) {
      coaching.updatedBy = req.user._id;
    }

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Franchise deactivated successfully",
    });
  } catch (error) {
    console.error("Delete coaching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete franchise",
      error: error.message,
    });
  }
};

/*
=========================================
UPDATE STATUS
PATCH /api/coaching/:id/status
=========================================
*/

const updateCoachingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "active", "suspended", "inactive"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    coaching.status = status;
    if (mongoose.isValidObjectId(req.user?._id)) {
      coaching.updatedBy = req.user._id;
    }

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Franchise status updated",
      coaching,
    });
  } catch (error) {
    console.error("Status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

export {
  createCoaching,
  getCoachings,
  getCoachingById,
  updateCoaching,
  deleteCoaching,
  updateCoachingStatus,
};
