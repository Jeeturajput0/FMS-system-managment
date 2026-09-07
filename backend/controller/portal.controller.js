import mongoose from "mongoose";
import Course from "../model/course.model.js";
import Coaching from "../model/coaching.model.js";
import Fee from "../model/fee.model.js";
import Student from "../model/student.model.js";
import User from "../model/user.model.js";
import Batch from "../model/batches.model.js";
import Attendance from "../model/attendance.model.js";
import bcrypt from "bcryptjs";

const coachingFilter = (user) => user.coachingId ? { coachingId: user.coachingId } : {};

const getTeacherBatchIds = async (user) => {
  if (user.role !== "TEACHER" || !mongoose.isValidObjectId(user._id)) return [];
  const courseIds = await getTeacherCourseIds(user);
  return Batch.find({
    ...(user.coachingId ? { franchise: user.coachingId } : {}),
    $or: [{ teacher: user._id }, ...(courseIds.length ? [{ course: { $in: courseIds } }] : [])],
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
    const filter = isTeacher ? { ...coachingFilter(req.user), $or: [{ batchId: { $in: teacherBatchIds } }, ...(teacherCourseIds.length ? [{ courseId: { $in: teacherCourseIds } }] : [])] } : coachingFilter(req.user);
    const batchFilter = isTeacher ? { _id: { $in: teacherBatchIds } } : (req.user.coachingId ? { franchise: req.user.coachingId } : {});
    const [students, courses, fees, teachers, franchises, activeBatches, recentBatches, recentStudents] = await Promise.all([
      Student.countDocuments(filter),
      isTeacher ? Course.countDocuments({ _id: { $in: teacherCourseIds }, isActive: true }) : Course.countDocuments({ isActive: true }),
      Fee.find(filter).select("totalPending totalPaid totalAmount").lean(),
      User.countDocuments({ role: "TEACHER", ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}) }),
      Coaching.countDocuments({ status: "active" }),
      Batch.countDocuments({ ...batchFilter, status: "ACTIVE" }),
      Batch.find(batchFilter).populate("course", "title name").populate("teacher", "name").sort({ createdAt: -1 }).limit(5).lean(),
      Student.find(filter).populate("courseId", "title name").populate("batchId", "name code").sort({ createdAt: -1 }).limit(5).lean(),
    ]);
    const currentStudent = role === "STUDENT"
      ? await Student.findOne({ email: req.user.email }).populate("courseId", "title").lean()
      : null;
    const data = role === "STUDENT"
      ? { students: currentStudent ? 1 : 0, courses: currentStudent?.courseId ? 1 : 0, attendance: currentStudent?.attendancePercentage || 0, pendingFees: currentStudent?.totalPending || 0, recent: currentStudent ? [currentStudent] : [] }
      : role === "TEACHER"
        ? { students, courses, teachers: 1, batches: teacherBatchIds.length, activeBatches, attendance: 0, pendingReviews: 0, recent: recentStudents }
        : { students, teachers, batches: activeBatches, activeBatches, courses, franchises, pendingFees: fees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0), recent: recentStudents, recentBatches, recentStudents, attendanceToday: 0 };
    return res.json({ success: true, role, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load portal dashboard", error: error.message });
  }
};

export const getPortalStudents = async (req, res) => {
  try {
    const teacherBatchIds = await getTeacherBatchIds(req.user);
    const teacherCourseIds = await getTeacherCourseIds(req.user);
    const filter = req.user.role === "TEACHER" ? { ...coachingFilter(req.user), $or: [{ batchId: { $in: teacherBatchIds } }, ...(teacherCourseIds.length ? [{ courseId: { $in: teacherCourseIds } }] : [])] } : coachingFilter(req.user);
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
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } },
        ...(req.user.coachingId ? [{ availableForFranchises: req.user.coachingId }] : []),
      ],
    }).sort({ category: 1, title: 1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load courses", error: error.message });
  }
};

export const getPortalFees = async (req, res) => {
  try {
    const student = req.user.role === "STUDENT" ? await Student.findOne({ email: req.user.email }).select("_id") : null;
    const teacherBatchIds = await getTeacherBatchIds(req.user);
    const teacherStudents = req.user.role === "TEACHER" ? await Student.find({ ...coachingFilter(req.user), batchId: { $in: teacherBatchIds } }).distinct("_id") : null;
    const filter = student ? { studentId: student._id } : teacherStudents ? { coachingId: req.user.coachingId, studentId: { $in: teacherStudents } } : coachingFilter(req.user);
    const data = await Fee.find(filter).populate("studentId", "name studentId").populate("courseId", "title").sort({ updatedAt: -1 }).lean();
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
    const data = await User.find(filter).select("name email isActive coachingId assignedCourses createdAt").populate("assignedCourses", "title name").sort({ name: 1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load teachers", error: error.message });
  }
};

export const getPortalTeacherBatches = async (req, res) => {
  try {
    const batchIds = await getTeacherBatchIds(req.user);
    const data = await Batch.find({ _id: { $in: batchIds } }).populate("course", "title name").populate("students", "name studentId").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to load teacher batches", error: error.message }); }
};

export const createPortalTeacher = async (req, res) => {
  try {
    const { name, email, password, courseIds = [] } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Name, email and password of 6+ characters are required" });
    }
    if (await User.exists({ email: email.trim().toLowerCase() })) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }
    const validCourseIds = Array.isArray(courseIds) ? courseIds.filter((id) => mongoose.isValidObjectId(id)) : [];
    const teacher = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 12), role: "TEACHER", coachingId: req.user.coachingId, assignedCourses: validCourseIds });
    const data = await User.findById(teacher._id).select("name email isActive assignedCourses").populate("assignedCourses", "title name").lean();
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create teacher", error: error.message });
  }
};

export const updatePortalTeacher = async (req, res) => {
  try {
    const { name, email, password, courseIds = [], isActive } = req.body;
    const teacher = await User.findOne({ _id: req.params.id, role: "TEACHER", coachingId: req.user.coachingId });
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    if (name?.trim()) teacher.name = name.trim();
    if (email?.trim()) teacher.email = email.trim().toLowerCase();
    if (Array.isArray(courseIds)) teacher.assignedCourses = courseIds.filter((id) => mongoose.isValidObjectId(id));
    if (typeof isActive === "boolean") teacher.isActive = isActive;
    if (password) teacher.password = await bcrypt.hash(password, 12);
    await teacher.save();
    const data = await User.findById(teacher._id).select("name email isActive assignedCourses createdAt").populate("assignedCourses", "title name").lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update teacher", error: error.message });
  }
};

export const deletePortalTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndUpdate(
      { _id: req.params.id, role: "TEACHER", coachingId: req.user.coachingId },
      { $set: { isActive: false } },
      { new: true },
    ).select("name isActive").lean();
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    return res.json({ success: true, message: "Teacher deactivated successfully", data: teacher });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to deactivate teacher", error: error.message });
  }
};

export const getPortalAttendance = async (req, res) => {
  try {
    const { batchId, date } = req.query;
    if (!req.user.coachingId || !mongoose.isValidObjectId(batchId) || !date) return res.status(400).json({ success: false, message: "Batch and date are required" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const batch = await Batch.findOne({ _id: batchId, franchise: req.user.coachingId, ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}) }).populate("students", "name studentId").lean();
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    const attendance = await Attendance.findOne({ coachingId: req.user.coachingId, batchId, date: new Date(date) }).lean();
    return res.json({ success: true, data: { batch, attendance } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load attendance", error: error.message });
  }
};

export const savePortalAttendance = async (req, res) => {
  try {
    const { batchId, date, records } = req.body;
    if (!req.user.coachingId || !mongoose.isValidObjectId(batchId) || !date || !Array.isArray(records)) return res.status(400).json({ success: false, message: "Batch, date and attendance records are required" });
    const allowedBatchIds = req.user.role === "TEACHER" ? await getTeacherBatchIds(req.user) : null;
    const batch = await Batch.findOne({ _id: batchId, franchise: req.user.coachingId, ...(allowedBatchIds ? { _id: { $in: allowedBatchIds } } : {}) }).lean();
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
    const coaching = await Coaching.findByIdAndUpdate(req.user.coachingId, updates, { new: true, runValidators: true }).lean();
    if (!coaching) return res.status(404).json({ success: false, message: "Franchise not found" });
    return res.json({ success: true, message: "Settings updated successfully", data: coaching });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update franchise settings", error: error.message });
  }
};
