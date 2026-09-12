import mongoose from "mongoose";
import Course from "../model/course.model.js";
import Coaching from "../model/coaching.model.js";
import Fee from "../model/fee.model.js";
import Student from "../model/student.model.js";
import User from "../model/user.model.js";
import Batch from "../model/batches.model.js";
import Attendance from "../model/attendance.model.js";
import Assignment from "../model/assignment.model.js";
import bcrypt from "bcryptjs";
import { generateUniqueAutoGenId, getCenterIdPrefix } from "../utils/index.js";
import { isValidPhoneNumber, phoneValidationMessage } from "../utils/phone.js";
import { isValidName, nameValidationMessage } from "../utils/name.js";
const coachingFilter = (user) => user.coachingId ? { coachingId: user.coachingId } : {};

const getTeacherBatchIds = async (user) => {
  if (user.role !== "TEACHER" || !mongoose.isValidObjectId(user._id)) return [];
  return Batch.find({
    ...(user.coachingId ? { coachingId: user.coachingId } : {}),
    teacher: user._id,
  }).distinct("_id");
};

const getTeacherCourseIds = async (user) => {
  if (user.role !== "TEACHER" || !mongoose.isValidObjectId(user._id)) return [];
  const teacher = await User.findById(user._id).select("assignedCourses").lean();
  if (teacher?.assignedCourses?.length) return teacher.assignedCourses;
  return Batch.find({ teacher: user._id }).distinct("course");
};

export const getAdminPortalOverview = async (req, res) => {
  try {
    const [users, students, courses, fees, franchises, recentStudents] = await Promise.all([
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Student.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Fee.find().select("totalPending totalPaid totalAmount").lean(),
      Coaching.countDocuments({ status: "active" }),
      Student.find().populate("courseId", "title").populate("coachingId", "name code").sort({ createdAt: -1 }).limit(8).lean(),
    ]);
    const roleCounts = Object.fromEntries(users.map((item) => [item._id, item.count]));
    return res.json({
      success: true,
      data: {
        roleCounts,
        students,
        courses,
        franchises,
        totalPaid: fees.reduce((sum, fee) => sum + Number(fee.totalPaid || 0), 0),
        pendingFees: fees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0),
        recentStudents,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load admin portal overview", error: error.message });
  }
};

export const getPortalDashboard = async (req, res) => {
  try {
    const { role } = req.user;
    const teacherBatchIds = await getTeacherBatchIds(req.user);
    const teacherCourseIds = await getTeacherCourseIds(req.user);
    const isTeacher = req.user.role === "TEACHER";
    const filter = isTeacher ? { ...coachingFilter(req.user), batchId: { $in: teacherBatchIds } } : coachingFilter(req.user);
    const batchFilter = isTeacher ? { _id: { $in: teacherBatchIds } } : (req.user.coachingId ? { coachingId: req.user.coachingId } : {});
    const courseFilter = isTeacher
      ? { _id: { $in: teacherCourseIds }, isActive: true }
      : req.user.role === "FRANCHISE"
        ? { isActive: true, isPublished: true, availableForFranchises: req.user.coachingId }
        : { isActive: true };
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const [students, activeStudents, courses, fees, teachers, franchises, activeBatches, recentBatches, recentStudents, todayAttendance] = await Promise.all([
      Student.countDocuments(filter),
      Student.countDocuments({ ...filter, status: "active" }),
      Course.countDocuments(courseFilter),
      Fee.find(filter).select("totalPending totalPaid totalAmount").lean(),
      User.countDocuments({ role: "TEACHER", ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}) }),
      Coaching.countDocuments({ status: "active" }),
      Batch.countDocuments({ ...batchFilter, status: "ACTIVE" }),
      Batch.find(batchFilter).populate("course", "title name").populate("teacher", "name").populate("students", "_id").sort({ createdAt: -1 }).limit(5).lean(),
      Student.find(filter).populate("courseId", "title name").populate("batchId", "name code").sort({ createdAt: -1 }).limit(5).lean(),
      req.user.coachingId
        ? Attendance.find({ coachingId: req.user.coachingId, date: { $gte: todayStart, $lt: todayEnd } }).lean()
        : [],
    ]);
    const attendanceByBatch = new Map(todayAttendance.map((attendance) => [String(attendance.batchId), attendance]));
    const batchesWithAttendance = recentBatches.map((batch) => {
      const attendance = attendanceByBatch.get(String(batch._id));
      const records = attendance?.records || [];
      const present = records.filter((record) => record.status === "PRESENT").length;
      const absent = records.filter((record) => record.status === "ABSENT").length;
      const late = records.filter((record) => record.status === "LATE").length;
      return {
        ...batch,
        attendance: {
          present,
          absent,
          late,
          marked: records.length,
          total: batch.students?.length || 0,
          percentage: records.length ? Math.round((present / records.length) * 100) : 0,
        },
      };
    });
    const attendanceTotals = batchesWithAttendance.reduce((totals, batch) => ({
      total: totals.total + batch.attendance.total,
      present: totals.present + batch.attendance.present,
      absent: totals.absent + batch.attendance.absent,
      late: totals.late + batch.attendance.late,
    }), { total: 0, present: 0, absent: 0, late: 0 });
    const currentStudent = role === "STUDENT"
      ? await Student.findOne({
          ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
          $or: [
            ...(mongoose.isValidObjectId(req.user._id) ? [{ userId: req.user._id }] : []),
            ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
          ],
        })
          .populate("courseId", "title name description shortDescription")
          .populate("batchId", "name code course startDate endDate startTime endTime days status")
          .lean()
      : null;
      const data = role === "STUDENT"
        ? { students: currentStudent ? 1 : 0, courses: currentStudent?.courseId ? 1 : 0, attendance: currentStudent?.attendancePercentage || 0, pendingFees: currentStudent?.totalPending || 0, recent: currentStudent ? [currentStudent] : [] }
      : role === "TEACHER"
        ? { students, activeStudents, courses, teachers: 1, batches: teacherBatchIds.length, activeBatches, attendance: attendanceTotals.total ? Math.round((attendanceTotals.present / attendanceTotals.total) * 100) : 0, pendingReviews: 0, recent: recentStudents, recentBatches: batchesWithAttendance, attendanceByBatch: batchesWithAttendance }
        : { students, activeStudents, teachers, batches: activeBatches, activeBatches, courses, franchises, pendingFees: fees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0), recent: recentStudents, recentBatches: batchesWithAttendance, recentStudents, attendanceToday: attendanceTotals.total ? Math.round((attendanceTotals.present / attendanceTotals.total) * 100) : 0, attendanceByBatch: batchesWithAttendance };
    return res.json({ success: true, role, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load portal dashboard", error: error.message });
  }
};

export const getPortalStudents = async (req, res) => {
  try {
    const teacherBatchIds = await getTeacherBatchIds(req.user);
    const teacherCourseIds = await getTeacherCourseIds(req.user);
    const filter = req.user.role === "TEACHER" ? { ...coachingFilter(req.user), batchId: { $in: teacherBatchIds } } : coachingFilter(req.user);
    const data = await Student.find(filter).populate("courseId", "title").populate("batchId", "name code").populate("coachingId", "name code").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load students", error: error.message });
  }
};

export const getPortalCourses = async (req, res) => {
  try {
    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({
        ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
        $or: [
          ...(mongoose.isValidObjectId(req.user._id) ? [{ userId: req.user._id }] : []),
          ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ],
      }).select("courseId").lean();

      const data = student?.courseId
        ? await Course.find({ _id: student.courseId, isActive: true }).lean()
        : [];
      return res.json({ success: true, data });
    }

    const teacherCourseIds = req.user.role === "TEACHER"
      ? await getTeacherCourseIds(req.user)
      : null;
    const data = await Course.find({
      isActive: true,
      ...(teacherCourseIds ? { _id: { $in: teacherCourseIds } } : {}),
      ...(req.user.coachingId
        ? { availableForFranchises: req.user.coachingId }
        : {
            $or: [
              { isPublished: true },
              { isPublished: { $exists: false } },
            ],
          }),
    }).sort({ category: 1, title: 1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load courses", error: error.message });
  }
};

export const updateMyStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({ success: false, message: "Only students can update this profile" });
    }

    const student = await Student.findOne({
      ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
      $or: [
        ...(mongoose.isValidObjectId(req.user._id) ? [{ userId: req.user._id }] : []),
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
      ],
    });
    if (!student) return res.status(404).json({ success: false, message: "Student profile not found" });

    // Deliberately exclude identity, course, batch and email fields. Those are
    // controlled by the franchise/admin workflow and cannot be changed here.
    const allowed = ["name", "mobile", "dob", "gender", "address", "city", "state", "pincode", "fatherName", "motherName"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (updates.name !== undefined && (!updates.name.trim() || !isValidName(updates.name))) {
      return res.status(400).json({ success: false, message: nameValidationMessage });
    }
    if (updates.mobile !== undefined && !isValidPhoneNumber(updates.mobile)) {
      return res.status(400).json({ success: false, message: phoneValidationMessage });
    }
    if (updates.pincode !== undefined && updates.pincode && !/^\d{6}$/.test(String(updates.pincode).trim())) {
      return res.status(400).json({ success: false, message: "Pincode must be exactly 6 digits" });
    }

    Object.assign(student, updates);
    student.updatedBy = req.user._id;
    await student.save();
    return res.json({ success: true, message: "Profile updated successfully", data: student.toObject() });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update student profile", error: error.message });
  }
};

export const getPortalFees = async (req, res) => {
  try {
    const student = req.user.role === "STUDENT" ? await Student.findOne({ email: req.user.email }).select("_id") : null;
    const teacherBatchIds = await getTeacherBatchIds(req.user);
    const teacherStudents = req.user.role === "TEACHER" ? await Student.find({ ...coachingFilter(req.user), batchId: { $in: teacherBatchIds } }).distinct("_id") : null;
    const filter = student ? { studentId: student._id } : teacherStudents ? { coachingId: req.user.coachingId, studentId: { $in: teacherStudents } } : coachingFilter(req.user);
    const data = await Fee.find(filter)
      .populate("studentId", "name studentId mobile email courseFee registrationFee certificateFee")
      .populate("courseId", "title name courseFee")
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load fees", error: error.message });
  }
};

export const getPortalTeachers = async (req, res) => {
  try {
    const filter = {
      role: "TEACHER",
      ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
    };
    const data = await User.find(filter).select("name teacherId email mobile qualification specialization experience joiningDate address emergencyContact isActive coachingId assignedCourses createdAt").populate("assignedCourses", "title name").sort({ name: 1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load teachers", error: error.message });
  }
};

export const getPortalTeacherById = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "TEACHER",
      ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
    })
      .select("name teacherId email mobile qualification specialization experience joiningDate address emergencyContact isActive coachingId assignedCourses createdAt updatedAt")
      .populate("assignedCourses", "title name description category")
      .populate("coachingId", "name code email phone address city state")
      .lean();

    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });

    const batches = await Batch.find({
      teacher: teacher._id,
      ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}),
    })
      .select("name code course students startDate endDate startTime endTime days room status maxStudents")
      .populate("course", "title name")
      .populate("students", "name studentId mobile status")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: {
        ...teacher,
        batches,
        totalStudents: batches.reduce((total, batch) => total + (batch.students?.length || 0), 0),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load teacher profile", error: error.message });
  }
};

export const getPortalTeacherBatches = async (req, res) => {
  try {
    const batchIds = await getTeacherBatchIds(req.user);
    const data = await Batch.find(
      req.user.role === "TEACHER"
        ? { _id: { $in: batchIds } }
        : req.user.coachingId
          ? { coachingId: req.user.coachingId }
          : {},
    ).populate("course", "title name").populate("students", "name studentId").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to load teacher batches", error: error.message }); }
};

export const createPortalTeacher = async (req, res) => {
  try {
    const { name, email, mobile, password, courseIds = [], qualification = "", specialization = "", experience = "", joiningDate = null, address = "", emergencyContact = "" } = req.body;
    if (!name?.trim() || !email?.trim() || !mobile?.trim() || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Name, mobile, email and password of 6+ characters are required" });
    }
    if (!isValidName(name)) return res.status(400).json({ success: false, message: nameValidationMessage });
    if (!isValidPhoneNumber(mobile)) return res.status(400).json({ success: false, message: phoneValidationMessage });
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (await User.exists({ email: email.trim().toLowerCase() })) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }
    const validCourseIds = Array.isArray(courseIds) ? courseIds.filter((id) => mongoose.isValidObjectId(id)) : [];
    const coaching = await Coaching.findById(req.user.coachingId).select("code name").lean();
    if (!coaching) return res.status(400).json({ success: false, message: "Franchise not found" });
    const teacherId = await generateUniqueAutoGenId({
      model: User,
      field: "teacherId",
      prefix: getCenterIdPrefix(coaching.code),
      type: "T",
      filter: { role: "TEACHER", coachingId: req.user.coachingId },
      prefixIncludesDate: true,
    });
    const teacher = await User.create({ name: name.trim(), teacherId, email: email.trim().toLowerCase(), mobile: mobile.trim(), qualification: qualification.trim(), specialization: specialization.trim(), experience: experience.trim(), joiningDate: joiningDate || null, address: address.trim(), emergencyContact: emergencyContact.trim(), password: await bcrypt.hash(password, 12), role: "TEACHER", coachingId: req.user.coachingId, assignedCourses: validCourseIds });
    const data = await User.findById(teacher._id).select("name teacherId email mobile qualification specialization experience joiningDate address emergencyContact isActive assignedCourses").populate("assignedCourses", "title name").lean();
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create teacher", error: error.message });
  }
};

export const updatePortalTeacher = async (req, res) => {
  try {
    const { name, email, mobile, password, courseIds = [], isActive, qualification, specialization, experience, joiningDate, address, emergencyContact } = req.body;
    const teacher = await User.findOne({ _id: req.params.id, role: "TEACHER", coachingId: req.user.coachingId });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    if (name?.trim()) teacher.name = name.trim();
    if (email?.trim()) teacher.email = email.trim().toLowerCase();
    if (mobile !== undefined && !isValidPhoneNumber(mobile)) {
      return res.status(400).json({ success: false, message: phoneValidationMessage });
    }
    if (mobile?.trim()) teacher.mobile = mobile.trim();
    if (name !== undefined && (!name.trim() || !isValidName(name))) return res.status(400).json({ success: false, message: nameValidationMessage });
    if (mobile !== undefined && !isValidPhoneNumber(mobile)) return res.status(400).json({ success: false, message: phoneValidationMessage });
    if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email.trim())) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (qualification !== undefined) teacher.qualification = qualification.trim();
    if (specialization !== undefined) teacher.specialization = specialization.trim();
    if (experience !== undefined) teacher.experience = experience.trim();
    if (joiningDate !== undefined) teacher.joiningDate = joiningDate || null;
    if (address !== undefined) teacher.address = address.trim();
    if (emergencyContact !== undefined) teacher.emergencyContact = emergencyContact.trim();
    if (Array.isArray(courseIds)) teacher.assignedCourses = courseIds.filter((id) => mongoose.isValidObjectId(id));
    if (typeof isActive === "boolean") teacher.isActive = isActive;
    if (password) teacher.password = await bcrypt.hash(password, 12);
    await teacher.save();
    const data = await User.findById(teacher._id).select("name email mobile qualification specialization experience joiningDate address emergencyContact isActive assignedCourses createdAt").populate("assignedCourses", "title name").lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update teacher", error: error.message });
  }
};

export const deletePortalTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndDelete(
      { _id: req.params.id, role: "TEACHER", coachingId: req.user.coachingId },
    ).select("name").lean();
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    await Batch.updateMany({ teacher: req.params.id }, { $set: { teacher: null } });
    return res.json({ success: true, message: "Teacher deleted successfully", data: teacher });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to deactivate teacher", error: error.message });
  }
};

export const getPortalAttendance = async (req, res) => {
  try {
    const { batchId, date } = req.query;
    if (!req.user.coachingId || !mongoose.isValidObjectId(batchId) || !date) return res.status(400).json({ success: false, message: "Batch and date are required" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const batch = await Batch.findOne({ _id: batchId, coachingId: req.user.coachingId, ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}) }).populate("students", "name studentId").lean();
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    const attendance = await Attendance.findOne({ coachingId: req.user.coachingId, batchId, date: new Date(date) }).lean();
    return res.json({ success: true, data: { batch, attendance } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load attendance", error: error.message });
  }
};

export const getPortalAssignments = async (req, res) => {
  try {
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    const teacherBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const filter = {
      coachingId: req.user.coachingId,
      ...(teacherBatchIds
        ? {
            $or: [
              { batchId: { $in: teacherBatchIds } },
              { createdBy: req.user._id },
            ],
          }
        : {}),
    };
    if (req.query.batchId && mongoose.isValidObjectId(req.query.batchId)) filter.batchId = req.query.batchId;
    if (req.query.status) filter.status = req.query.status;
    const data = await Assignment.find(filter)
      .populate("batchId", "name code course")
      .populate("courseId", "title name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load assignments", error: error.message });
  }
};

export const createPortalAssignment = async (req, res) => {
  try {
    const { title, description = "", courseId = null, batchId = null, dueDate = null, maxMarks = 10, attachments = [], status = "ACTIVE" } = req.body;
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    if (!title?.trim() || title.trim().length < 2) return res.status(400).json({ success: false, message: "Assignment title is required" });
    if (batchId && mongoose.isValidObjectId(batchId)) {
      const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
      const batch = await Batch.findOne({
        _id: batchId,
        coachingId: req.user.coachingId,
        ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}),
      }).lean();
      if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    }
    if (courseId && !mongoose.isValidObjectId(courseId)) return res.status(400).json({ success: false, message: "Invalid course selected" });
    const marks = Number(maxMarks);
    const assignment = await Assignment.create({
      title: title.trim(),
      description: String(description).trim(),
      coachingId: req.user.coachingId,
      courseId: courseId && mongoose.isValidObjectId(courseId) ? courseId : null,
      batchId: batchId && mongoose.isValidObjectId(batchId) ? batchId : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      maxMarks: Number.isFinite(marks) && marks >= 0 ? marks : 10,
      attachments: Array.isArray(attachments) ? attachments.filter(Boolean) : [],
      status,
      createdBy: req.user._id,
    });
    const data = await Assignment.findById(assignment._id)
      .populate("batchId", "name code course")
      .populate("courseId", "title name")
      .populate("createdBy", "name")
      .lean();
    return res.status(201).json({ success: true, message: "Assignment created successfully", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create assignment", error: error.message });
  }
};

export const updatePortalAssignment = async (req, res) => {
  try {
    const { title, description, courseId, batchId, dueDate, maxMarks, attachments, status } = req.body;
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid assignment ID" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      coachingId: req.user.coachingId,
      ...(allowedBatchIds
        ? {
            $or: [
              { batchId: { $in: allowedBatchIds } },
              { createdBy: req.user._id },
            ],
          }
        : {}),
    });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    if (title !== undefined) {
      if (!title.trim() || title.trim().length < 2) return res.status(400).json({ success: false, message: "Assignment title is required" });
      assignment.title = title.trim();
    }
    if (description !== undefined) assignment.description = String(description).trim();
    if (batchId !== undefined) {
      if (!batchId || !mongoose.isValidObjectId(batchId)) {
        assignment.batchId = null;
      } else {
        const batch = await Batch.findOne({
          _id: batchId,
          coachingId: req.user.coachingId,
          ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}),
        }).lean();
        if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
        assignment.batchId = batchId;
      }
    }
    if (courseId !== undefined) {
      assignment.courseId = courseId && mongoose.isValidObjectId(courseId) ? courseId : null;
    }
    if (dueDate !== undefined) assignment.dueDate = dueDate ? new Date(dueDate) : null;
    if (maxMarks !== undefined) {
      const marks = Number(maxMarks);
      assignment.maxMarks = Number.isFinite(marks) && marks >= 0 ? marks : 10;
    }
    if (attachments !== undefined) assignment.attachments = Array.isArray(attachments) ? attachments.filter(Boolean) : [];
    if (status !== undefined) assignment.status = status;
    assignment.updatedBy = req.user._id;
    await assignment.save();
    const data = await Assignment.findById(assignment._id)
      .populate("batchId", "name code course")
      .populate("courseId", "title name")
      .populate("createdBy", "name")
      .lean();
    return res.json({ success: true, message: "Assignment updated successfully", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update assignment", error: error.message });
  }
};

export const deletePortalAssignment = async (req, res) => {
  try {
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid assignment ID" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      coachingId: req.user.coachingId,
      ...(allowedBatchIds
        ? {
            $or: [
              { batchId: { $in: allowedBatchIds } },
              { createdBy: req.user._id },
            ],
          }
        : {}),
    }).select("title").lean();
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    return res.json({ success: true, message: "Assignment deleted successfully", data: assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete assignment", error: error.message });
  }
};

export const savePortalAttendance = async (req, res) => {
  try {
    const { batchId, date, records } = req.body;
    if (!req.user.coachingId || !mongoose.isValidObjectId(batchId) || !date || !Array.isArray(records)) return res.status(400).json({ success: false, message: "Batch, date and attendance records are required" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const batch = await Batch.findOne({ _id: batchId, coachingId: req.user.coachingId, ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}) }).lean();
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    const attendance = await Attendance.findOneAndUpdate(
      { coachingId: req.user.coachingId, batchId, date: new Date(date) },
      { $set: { records } },
      { upsert: true, new: true, runValidators: true },
    ).lean();
    return res.json({ success: true, message: "Attendance saved successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to save attendance", error: error.message });
  }
};

export const getPortalSettings = async (req, res) => {
  try {
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    const coaching = await Coaching.findById(req.user.coachingId).select("name code ownerName email phone address city state pincode logo status").lean();
    if (!coaching) return res.status(404).json({ success: false, message: "Franchise not found" });
    return res.json({ success: true, data: coaching });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load franchise settings", error: error.message });
  }
};

export const updatePortalSettings = async (req, res) => {
  try {
    if (!req.user.coachingId) return res.status(400).json({ success: false, message: "Franchise ID not found" });
    const allowed = ["name", "ownerName", "email", "phone", "address", "city", "state", "pincode", "logo"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (updates.name !== undefined && !isValidName(updates.name)) return res.status(400).json({ success: false, message: `Franchise name: ${nameValidationMessage}` });
    if (updates.ownerName !== undefined && !isValidName(updates.ownerName)) return res.status(400).json({ success: false, message: `Owner name: ${nameValidationMessage}` });
    if (updates.phone !== undefined && !isValidPhoneNumber(updates.phone)) return res.status(400).json({ success: false, message: phoneValidationMessage });
    if (updates.email !== undefined && !/^\S+@\S+\.\S+$/.test(String(updates.email).trim())) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (updates.pincode !== undefined && updates.pincode && !/^\d{6}$/.test(String(updates.pincode).trim())) return res.status(400).json({ success: false, message: "Pincode must be exactly 6 digits" });
    const coaching = await Coaching.findByIdAndUpdate(req.user.coachingId, updates, { new: true, runValidators: true }).lean();
    if (!coaching) return res.status(404).json({ success: false, message: "Franchise not found" });
    return res.json({ success: true, message: "Settings updated successfully", data: coaching });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update franchise settings", error: error.message });
  }
};
