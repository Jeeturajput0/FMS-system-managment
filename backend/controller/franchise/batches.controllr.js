import mongoose from "mongoose";
import Batch from "../../model/batches.model.js";
import User from "../../model/user.model.js";
import Student from "../../model/student.model.js";

// ============================================================
// HELPER
// ============================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ============================================================
// CREATE BATCH
// POST /api/batches
// ============================================================

const createBatch = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      franchise,
      course,
      teacher,
      students,
      startDate,
      endDate,
      startTime,
      endTime,
      days,
      room,
      maxStudents,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Batch name is required",
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Batch code is required",
      });
    }

    if (!franchise) {
      return res.status(400).json({
        success: false,
        message: "Franchise is required",
      });
    }

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course is required",
      });
    }

    if (!isValidObjectId(franchise)) {
      return res.status(400).json({
        success: false,
        message: "Invalid franchise ID",
      });
    }

    if (!isValidObjectId(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (teacher && !isValidObjectId(teacher)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const existingBatch = await Batch.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "Batch code already exists",
      });
    }

    const studentList = Array.isArray(students)
      ? [...new Set(students.map(String))]
      : [];

    const capacity = maxStudents ? Number(maxStudents) : 30;

    if (studentList.length > capacity) {
      return res.status(400).json({
        success: false,
        message: "Number of students exceeds maximum batch capacity",
      });
    }

    const batch = await Batch.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description || "",

      franchise,
      course,
      teacher: teacher || null,

      students: studentList,

      startDate: startDate || null,
      endDate: endDate || null,

      startTime: startTime || "",
      endTime: endTime || "",

      days: Array.isArray(days) ? days : [],

      room: room || "",

      maxStudents: capacity,

      status: status || "ACTIVE",

      createdBy: req.user?._id || null,
    });

    if (studentList.length) {
      await Student.updateMany(
        { _id: { $in: studentList }, coachingId: franchise },
        { $set: { batchId: batch._id } },
      );
    }

    const populatedBatch = await Batch.findById(batch._id)
      .populate("franchise", "name email phone")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch: populatedBatch,
    });
  } catch (error) {
    console.error("Create batch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create batch",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL BATCHES
// GET /api/batches
// ============================================================

const getAllBatches = async (req, res) => {
  try {
    const {
      search,
      status,
      franchise,
      course,
      teacher,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
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
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (franchise) {
      if (!isValidObjectId(franchise)) {
        return res.status(400).json({
          success: false,
          message: "Invalid franchise ID",
        });
      }

      filter.franchise = franchise;
    }

    if (course) {
      if (!isValidObjectId(course)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      filter.course = course;
    }

    if (teacher) {
      if (!isValidObjectId(teacher)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacher ID",
        });
      }

      filter.teacher = teacher;
    }

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * perPage;

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("franchise", "name email phone")
        .populate("course", "name title")
        .populate("teacher", "name email")
        .populate("students", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),

      Batch.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      batches,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Get all batches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
      error: error.message,
    });
  }
};

// ============================================================
// GET FRANCHISE BATCHES
// GET /api/batches/franchise/batches
// ============================================================

const getFranchiseBatches = async (req, res) => {
  try {
    let franchiseId = null;

    if (req.user) {
      franchiseId =
        req.user.franchise ||
        req.user.franchiseId ||
        req.user.coachingId ||
        null;
    }

    // Support tokens created before coachingId was included in the JWT.
    if (!franchiseId && req.user?._id && isValidObjectId(req.user._id)) {
      const user = await User.findById(req.user._id).select("coachingId");
      franchiseId = user?.coachingId || null;
    }

    if (!franchiseId && req.query.franchise) {
      franchiseId = req.query.franchise;
    }

    if (!franchiseId) {
      return res.status(400).json({
        success: false,
        message: "Franchise ID not found",
      });
    }

    if (!isValidObjectId(franchiseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid franchise ID",
      });
    }

    const { search, status, course, teacher, page = 1, limit = 20 } = req.query;

    const filter = {
      franchise: franchiseId,
    };

    if (search) {
      filter.$or = [
        {
          name: {
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
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (course) {
      if (!isValidObjectId(course)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      filter.course = course;
    }

    if (teacher) {
      if (!isValidObjectId(teacher)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacher ID",
        });
      }

      filter.teacher = teacher;
    }

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * perPage;

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("franchise", "name email phone")
        .populate("course", "name title")
        .populate("teacher", "name email")
        .populate("students", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),

      Batch.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      batches,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Get franchise batches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch franchise batches",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE BATCH
// GET /api/batches/:id
// ============================================================

const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id)
      .populate("franchise", "name email phone")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      batch,
    });
  } catch (error) {
    console.error("Get batch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE BATCH
// PUT /api/batches/:id
// ============================================================

const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const {
      name,
      code,
      description,
      franchise,
      course,
      teacher,
      students,
      startDate,
      endDate,
      startTime,
      endTime,
      days,
      room,
      maxStudents,
      status,
    } = req.body;

    if (franchise && !isValidObjectId(franchise)) {
      return res.status(400).json({
        success: false,
        message: "Invalid franchise ID",
      });
    }

    if (course && !isValidObjectId(course)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (teacher && !isValidObjectId(teacher)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    if (code) {
      const existingBatch = await Batch.findOne({
        code: code.trim().toUpperCase(),
        _id: { $ne: id },
      });

      if (existingBatch) {
        return res.status(409).json({
          success: false,
          message: "Batch code already exists",
        });
      }

      batch.code = code.trim().toUpperCase();
    }

    if (name !== undefined) {
      batch.name = name.trim();
    }

    if (description !== undefined) {
      batch.description = description;
    }

    if (franchise !== undefined) {
      batch.franchise = franchise;
    }

    if (course !== undefined) {
      batch.course = course;
    }

    if (teacher !== undefined) {
      batch.teacher = teacher || null;
    }

    if (students !== undefined) {
      if (!Array.isArray(students)) {
        return res.status(400).json({
          success: false,
          message: "Students must be an array",
        });
      }

      const uniqueStudents = [...new Set(students.map(String))];

      const capacity =
        maxStudents !== undefined ? Number(maxStudents) : batch.maxStudents;

      if (uniqueStudents.length > capacity) {
        return res.status(400).json({
          success: false,
          message: "Number of students exceeds batch capacity",
        });
      }

      batch.students = uniqueStudents;
    }

    if (startDate !== undefined) {
      batch.startDate = startDate || null;
    }

    if (endDate !== undefined) {
      batch.endDate = endDate || null;
    }

    if (startTime !== undefined) {
      batch.startTime = startTime;
    }

    if (endTime !== undefined) {
      batch.endTime = endTime;
    }

    if (days !== undefined) {
      batch.days = Array.isArray(days) ? days : [];
    }

    if (room !== undefined) {
      batch.room = room;
    }

    if (maxStudents !== undefined) {
      const capacity = Number(maxStudents);

      if (batch.students.length > capacity) {
        return res.status(400).json({
          success: false,
          message: "Maximum students cannot be less than current students",
        });
      }

      batch.maxStudents = capacity;
    }

    if (status !== undefined) {
      batch.status = status;
    }

    await batch.save();

    const updatedBatch = await Batch.findById(batch._id)
      .populate("franchise", "name email phone")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      batch: updatedBatch,
    });
  } catch (error) {
    console.error("Update batch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update batch",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE BATCH
// DELETE /api/batches/:id
// ============================================================

const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await Batch.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error("Delete batch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete batch",
      error: error.message,
    });
  }
};

// ============================================================
// ASSIGN TEACHER
// PATCH /api/batches/:id/teacher
// ============================================================

const assignTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!teacherId || !isValidObjectId(teacherId)) {
      return res.status(400).json({
        success: false,
        message: "Valid teacher ID is required",
      });
    }

    const batch = await Batch.findByIdAndUpdate(
      id,
      {
        teacher: teacherId,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("franchise", "name")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher assigned successfully",
      batch,
    });
  } catch (error) {
    console.error("Assign teacher error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign teacher",
      error: error.message,
    });
  }
};

// ============================================================
// ADD STUDENT
// POST /api/batches/:id/students
// ============================================================

const addStudentToBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!studentId || !isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Valid student ID is required",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const student = await Student.findOne({ _id: studentId, coachingId: batch.franchise });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student does not belong to this franchise" });
    }

    if (batch.students.some((student) => student.toString() === studentId)) {
      return res.status(409).json({
        success: false,
        message: "Student is already assigned to this batch",
      });
    }

    if (batch.students.length >= batch.maxStudents) {
      return res.status(400).json({
        success: false,
        message: "Batch has reached maximum capacity",
      });
    }

    batch.students.push(studentId);

    await batch.save();
    await Student.updateOne({ _id: student._id }, { $set: { batchId: batch._id } });

    const updatedBatch = await Batch.findById(id)
      .populate("franchise", "name")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    return res.status(200).json({
      success: true,
      message: "Student added to batch successfully",
      batch: updatedBatch,
    });
  } catch (error) {
    console.error("Add student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// ============================================================
// REMOVE STUDENT
// DELETE /api/batches/:id/students/:studentId
// ============================================================

const removeStudentFromBatch = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    batch.students = batch.students.filter(
      (student) => student.toString() !== studentId,
    );

    await batch.save();
    await Student.findOneAndUpdate(
      { _id: studentId, batchId: batch._id },
      { $set: { batchId: null } },
    );

    const updatedBatch = await Batch.findById(id)
      .populate("franchise", "name")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    return res.status(200).json({
      success: true,
      message: "Student removed from batch successfully",
      batch: updatedBatch,
    });
  } catch (error) {
    console.error("Remove student error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove student",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE BATCH STATUS
// PATCH /api/batches/:id/status
// ============================================================

const updateBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"];

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch status",
      });
    }

    const batch = await Batch.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("franchise", "name")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Batch status updated successfully",
      batch,
    });
  } catch (error) {
    console.error("Update status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update batch status",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

export {
  createBatch,
  getAllBatches,
  getFranchiseBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  assignTeacher,
  addStudentToBatch,
  removeStudentFromBatch,
  updateBatchStatus,
};
