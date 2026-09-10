import mongoose from "mongoose";
import Batch from "../../model/batches.model.js";
import User from "../../model/user.model.js";
import Student from "../../model/student.model.js";
import Coaching from "../../model/coaching.model.js";
import Course from "../../model/course.model.js";
import { generateUniqueAutoGenId, getCenterIdPrefix } from "../../utils/index.js";
import { isValidName, nameValidationMessage } from "../../utils/name.js";

// ============================================================
// HELPER
// ============================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateBatchDates = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (startDate && !start) return "Start date is invalid";
  if (endDate && !end) return "End date is invalid";
  if (start && end && end < start) return "End date cannot be before start date";
  return "";
};

const getRequestFranchiseId = async (req) => {
  const userFranchiseId = req.user?.coachingId || req.user?.franchise || req.user?.franchiseId;
  if (userFranchiseId) return userFranchiseId;
  if (req.user?._id && isValidObjectId(req.user._id)) {
    const user = await User.findById(req.user._id).select("coachingId").lean();
    return user?.coachingId || null;
  }
  return null;
};

// ============================================================
// CREATE BATCH
// POST /api/batches
// ============================================================

const createBatch = async (req, res) => {
  try {
    const {
      name,
      description,
      franchise: requestedFranchise,
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

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Batch name is required",
      });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ success: false, message: nameValidationMessage });
    }

    const accountFranchise = await getRequestFranchiseId(req);
    const franchise = accountFranchise || requestedFranchise;

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

    const dateError = validateBatchDates(startDate, endDate);
    if (dateError) return res.status(400).json({ success: false, message: dateError });

    const capacity = Number(maxStudents ?? 30);
    if (!Number.isInteger(capacity) || capacity < 1) {
      return res.status(400).json({ success: false, message: "Maximum students must be a positive whole number" });
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

    if (accountFranchise && requestedFranchise && String(accountFranchise) !== String(requestedFranchise)) {
      return res.status(403).json({ success: false, message: "You can only create batches for your franchise" });
    }

    const [franchiseRecord, courseRecord] = await Promise.all([
      Coaching.findById(franchise).select("name code"),
      Course.findById(course).select("title name"),
    ]);
    if (!franchiseRecord) return res.status(404).json({ success: false, message: "Franchise not found" });
    if (!courseRecord) return res.status(404).json({ success: false, message: "Course not found" });
    const batchId = await generateUniqueAutoGenId({
      model: Batch,
      field: "batchId",
      prefix: getCenterIdPrefix(franchiseRecord.code),
      type: "B",
      filter: { coachingId: franchise },
      prefixIncludesDate: true,
    });
    const studentList = Array.isArray(students)
      ? [...new Set(students.map(String))]
      : [];

    if (studentList.length > capacity) {
      return res.status(400).json({
        success: false,
        message: "Number of students exceeds maximum batch capacity",
      });
    }

    const batch = await Batch.create({
      name: name.trim(),
      code: batchId,
      description: description || "",
      batchId,

      coachingId: franchise,
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
      .populate("coachingId", "name email phone")
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
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          code: {
            $regex: escapeRegex(search),
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

      filter.coachingId = franchise;
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
    const perPage = Math.min(Math.max(Number(limit), 1), 1000);
    const skip = (currentPage - 1) * perPage;

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("coachingId", "name email phone")
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
      coachingId: franchiseId,
    };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      const [matchingCourses, matchingTeachers] = await Promise.all([
        Course.find({ $or: [{ title: searchRegex }, { name: searchRegex }] }).select("_id").lean(),
        User.find({ role: "TEACHER", $or: [{ name: searchRegex }, { email: searchRegex }] }).select("_id").lean(),
      ]);
      filter.$or = [
        {
          name: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          code: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        { course: { $in: matchingCourses.map((item) => item._id) } },
        { teacher: { $in: matchingTeachers.map((item) => item._id) } },
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
    const perPage = Math.min(Math.max(Number(limit), 1), 1000);
    const skip = (currentPage - 1) * perPage;

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("coachingId", "name email phone")
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
      .populate("coachingId", "name email phone")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email mobile studentId status courseId");

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

    if (name !== undefined) {
      if (!name.trim() || !isValidName(name)) {
        return res.status(400).json({ success: false, message: nameValidationMessage });
      }
      batch.name = name.trim();
    }

    if (description !== undefined) {
      batch.description = description;
    }

    if (franchise !== undefined) {
      batch.coachingId = franchise;
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

      const uniqueStudents = [...new Set(students.map((student) => String(student?._id || student)))];
      if (uniqueStudents.some((studentId) => !isValidObjectId(studentId))) {
        return res.status(400).json({ success: false, message: "Students contain an invalid ID" });
      }

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
      const dateError = validateBatchDates(startDate, endDate !== undefined ? endDate : batch.startDate);
      if (dateError) return res.status(400).json({ success: false, message: dateError });
      batch.startDate = startDate || null;
    }

    if (endDate !== undefined) {
      const dateError = validateBatchDates(startDate !== undefined ? startDate : batch.startDate, endDate);
      if (dateError) return res.status(400).json({ success: false, message: dateError });
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

      if (!Number.isInteger(capacity) || capacity < 1) {
        return res.status(400).json({ success: false, message: "Maximum students must be a positive whole number" });
      }

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

    const [franchiseRecord, courseRecord] = await Promise.all([
      Coaching.findById(batch.coachingId).select("name code"),
      Course.findById(batch.course).select("title name"),
    ]);
    if (!franchiseRecord) return res.status(404).json({ success: false, message: "Franchise not found" });
    if (!courseRecord) return res.status(404).json({ success: false, message: "Course not found" });

    if (!batch.batchId) {
      const franchiseRecordForId = await Coaching.findById(batch.coachingId).select("name code").lean();
      batch.batchId = await generateUniqueAutoGenId({
        model: Batch,
        field: "batchId",
        prefix: getCenterIdPrefix(franchiseRecordForId?.code),
        type: "B",
        filter: { coachingId: batch.coachingId },
        prefixIncludesDate: true,
      });
    }

    batch.code = batch.batchId;

    await batch.save();

    const updatedBatch = await Batch.findById(batch._id)
      .populate("coachingId", "name email phone")
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

    await Promise.all([
      Batch.findByIdAndDelete(id),
      Student.updateMany({ batchId: id }, { $set: { batchId: null } }),
    ]);

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
      .populate("coachingId", "name")
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
    const { studentId, studentIds } = req.body;
    const requestedStudentIds = Array.isArray(studentIds)
      ? [...new Set(studentIds.map(String))]
      : studentId
        ? [String(studentId)]
        : [];

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID",
      });
    }

    if (!requestedStudentIds.length || requestedStudentIds.some((value) => !isValidObjectId(value))) {
      return res.status(400).json({
        success: false,
        message: "At least one valid student ID is required",
      });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const students = await Student.find({
      _id: { $in: requestedStudentIds },
      coachingId: batch.coachingId,
      courseId: batch.course,
    });
    if (students.length !== requestedStudentIds.length) {
      return res.status(400).json({
        success: false,
        message: "Select students from this batch's course only",
      });
    }

    const assignedIds = new Set(batch.students.map((value) => String(value)));
    const studentsToAdd = students.filter(
      (student) => !assignedIds.has(String(student._id)),
    );
    if (!studentsToAdd.length) {
      return res.status(409).json({
        success: false,
        message: "Selected students are already assigned to this batch",
      });
    }

    if (batch.students.length + studentsToAdd.length > batch.maxStudents) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(batch.maxStudents - batch.students.length, 0)} student slot(s) are available`,
      });
    }

    batch.students.push(...studentsToAdd.map((student) => student._id));

    await batch.save();
    await Student.updateMany(
      { _id: { $in: studentsToAdd.map((student) => student._id) } },
      { $set: { batchId: batch._id } },
    );

    const updatedBatch = await Batch.findById(id)
      .populate("coachingId", "name")
      .populate("course", "name title")
      .populate("teacher", "name email")
      .populate("students", "name email mobile studentId status courseId");

    return res.status(200).json({
      success: true,
      message: `${studentsToAdd.length} student(s) added to batch successfully`,
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
      .populate("coachingId", "name")
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
