import mongoose from "mongoose";
import Coaching from "../model/coaching.model.js";
import User from "../model/user.model.js";
import Student from "../model/student.model.js";
import Fee from "../model/fee.model.js";
import Batch from "../model/batches.model.js";
import Attendance from "../model/attendance.model.js";
import Course from "../model/course.model.js";
import bcrypt from "bcryptjs";
import { generateCenterCode, generateUniqueCenterCode, normalizeCenterCode } from "../utils/centerCode.js";
import { generateUniqueAutoGenId, getCenterIdPrefix } from "../utils/index.js";
import { isValidPhoneNumber, phoneValidationMessage } from "../utils/phone.js";

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
      password,
      logo,
      status,
      joinedDate,
      centerCodeManuallyEdited = false,
      courseIds = [],
    } = req.body;

    if (!name || !ownerName || !email || !phone || !city || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Name, owner name, email, phone, city and a password of 6+ characters are required",
      });
    }

    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({ success: false, message: phoneValidationMessage });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingEmail = await Coaching.findOne({ email: normalizedEmail });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Franchise with this email already exists",
      });
    }

    if (await User.exists({ email: normalizedEmail })) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const baseCode = code ? normalizeCenterCode(code) : generateCenterCode(name, joinedDate || new Date());
    if (!baseCode) return res.status(400).json({ success: false, message: "Center code is required" });
    const existingCode = await Coaching.exists({ code: baseCode });
    if (existingCode && centerCodeManuallyEdited) return res.status(409).json({ success: false, message: "Center code already exists. Please choose another code." });
    const centerCode = existingCode ? await generateUniqueCenterCode(Coaching, baseCode) : baseCode;
    const franchiseId = await generateUniqueAutoGenId({
      model: Coaching,
      field: "franchiseId",
      prefix: getCenterIdPrefix(centerCode),
      type: "F",
      prefixIncludesDate: true,
    });

    const coaching = await Coaching.create({
      name,
      code: centerCode,
      franchiseId,
      ownerName,
      email: normalizedEmail,
      phone,
      address,
      city,
      state,
      pincode,
      logo,
      status: status || "pending",
      joinedDate: joinedDate || new Date(),
      ...(mongoose.isValidObjectId(req.user?._id)
        ? { createdBy: req.user._id }
        : {}),
    });

      const validCourseIds = [...new Set(courseIds)].filter((courseId) => mongoose.isValidObjectId(courseId));
      if (validCourseIds.length) {
        await Course.updateMany(
          { _id: { $in: validCourseIds }, isActive: true },
          { $addToSet: { availableForFranchises: coaching._id } },
        );
      }

    try {
      await User.create({
        name: ownerName.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
        role: "FRANCHISE",
        coachingId: coaching._id,
      });
    } catch (userError) {
      await Coaching.deleteOne({ _id: coaching._id });
      throw userError;
    }

    return res.status(201).json({
      success: true,
      message: "Franchise created successfully",
      coaching,
      data: coaching,
        assignedCourseIds: validCourseIds,
    });
  } catch (error) {
    console.error("Create coaching error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Center code already exists. Please choose another code." });
    }

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

    const assignedCourses = await Course.find({
      availableForFranchises: coaching._id,
      isActive: true,
    }).select("_id");

    return res.status(200).json({
      success: true,
      coaching,
      assignedCourseIds: assignedCourses.map((course) => String(course._id)),
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
      password,
      logo,
      status,
      joinedDate,
      courseIds = [],
    } = req.body;

    const coaching = await Coaching.findById(req.params.id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Franchise not found",
      });
    }

    if (!name?.trim() || !ownerName?.trim() || !email?.trim() || !phone?.trim() || !city?.trim()) {
      return res.status(400).json({ success: false, message: "Name, owner name, email, phone and city are required" });
    }

    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({ success: false, message: phoneValidationMessage });
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

    if (code !== undefined) {
      const normalizedCode = normalizeCenterCode(code);
      if (!normalizedCode) return res.status(400).json({ success: false, message: "Center code is required" });
      const codeExists = await Coaching.findOne({
        code: normalizedCode,
        _id: {
          $ne: coaching._id,
        },
      });

      if (codeExists) {
        return res.status(409).json({
          success: false,
          message: "Center code already exists. Please choose another code.",
        });
      }
    }

    coaching.name = name ?? coaching.name;

    coaching.code = code !== undefined ? normalizeCenterCode(code) : coaching.code;

    coaching.ownerName = ownerName ?? coaching.ownerName;

    coaching.email = email?.toLowerCase() ?? coaching.email;

    coaching.phone = phone ?? coaching.phone;

    coaching.address = address ?? coaching.address;

    coaching.city = city ?? coaching.city;

    coaching.state = state ?? coaching.state;

    coaching.pincode = pincode ?? coaching.pincode;

    coaching.logo = logo ?? coaching.logo;

    coaching.status = status ?? coaching.status;
    coaching.joinedDate = joinedDate ?? coaching.joinedDate;

    if (mongoose.isValidObjectId(req.user?._id)) {
      coaching.updatedBy = req.user._id;
    }

    await coaching.save();

    const validCourseIds = [...new Set(courseIds)].filter((courseId) => mongoose.isValidObjectId(courseId));
    await Course.updateMany(
      { availableForFranchises: coaching._id },
      { $pull: { availableForFranchises: coaching._id } },
    );
    if (validCourseIds.length) {
      await Course.updateMany(
        { _id: { $in: validCourseIds }, isActive: true },
        { $addToSet: { availableForFranchises: coaching._id } },
      );
    }

    // Keep the linked franchise login in sync. This also repairs older
    // franchise records that were created before login accounts were added.
    const linkedUser = await User.findOne({ coachingId: coaching._id }).select("+password");
    if (linkedUser) {
      linkedUser.name = coaching.ownerName;
      linkedUser.email = coaching.email;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        linkedUser.password = await bcrypt.hash(password, 12);
      }
      await linkedUser.save();
    } else if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      }
      await User.create({
        name: coaching.ownerName,
        email: coaching.email,
        password: await bcrypt.hash(password, 12),
        role: "FRANCHISE",
        coachingId: coaching._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Franchise updated successfully",
      coaching,
      assignedCourseIds: validCourseIds,
    });
  } catch (error) {
    console.error("Update coaching error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Center code already exists. Please choose another code." });
    }

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

    await Promise.all([
      User.deleteMany({ coachingId: coaching._id }),
      Student.deleteMany({ coachingId: coaching._id }),
      Fee.deleteMany({ coachingId: coaching._id }),
      Batch.deleteMany({ coachingId: coaching._id }),
      Attendance.deleteMany({ coachingId: coaching._id }),
    ]);
    await Coaching.deleteOne({ _id: coaching._id });

    return res.status(200).json({
      success: true,
      message: "Franchise permanently deleted successfully",
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
