import Course from "../model/course.model.js";
import Coaching from "../model/coaching.model.js";
import Fee from "../model/fee.model.js";
import Student from "../model/student.model.js";
import User from "../model/user.model.js";

const coachingFilter = (user) => user.coachingId ? { coachingId: user.coachingId } : {};

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
    const filter = coachingFilter(req.user);
    const [students, courses, fees, teachers, franchises] = await Promise.all([
      Student.countDocuments(filter),
      Course.countDocuments({ isActive: true }),
      Fee.find(filter).select("totalPending totalPaid totalAmount").lean(),
      User.countDocuments({ role: "TEACHER", ...(req.user.coachingId ? { coachingId: req.user.coachingId } : {}) }),
      Coaching.countDocuments({ status: "active" }),
    ]);
    const currentStudent = role === "STUDENT"
      ? await Student.findOne({ email: req.user.email }).populate("courseId", "title").lean()
      : null;
    const data = role === "STUDENT"
      ? { students: currentStudent ? 1 : 0, courses: currentStudent?.courseId ? 1 : 0, attendance: currentStudent?.attendancePercentage || 0, pendingFees: currentStudent?.totalPending || 0, recent: currentStudent ? [currentStudent] : [] }
      : role === "TEACHER"
        ? { students, courses, teachers: 1, pendingReviews: 0, recent: await Student.find(filter).populate("courseId", "title").sort({ updatedAt: -1 }).limit(8).lean() }
        : { students, teachers, batches: 0, franchises, pendingFees: fees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0), recent: await Student.find(filter).populate("courseId", "title").sort({ updatedAt: -1 }).limit(8).lean() };
    return res.json({ success: true, role, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load portal dashboard", error: error.message });
  }
};

export const getPortalStudents = async (req, res) => {
  try {
    const data = await Student.find(coachingFilter(req.user)).populate("courseId", "title").populate("coachingId", "name code").sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load students", error: error.message });
  }
};

export const getPortalCourses = async (req, res) => {
  try {
    const data = await Course.find({ isActive: true, ...(req.user.coachingId ? { availableForFranchises: req.user.coachingId } : {}) }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load courses", error: error.message });
  }
};

export const getPortalFees = async (req, res) => {
  try {
    const student = req.user.role === "STUDENT" ? await Student.findOne({ email: req.user.email }).select("_id") : null;
    const filter = student ? { studentId: student._id } : coachingFilter(req.user);
    const data = await Fee.find(filter).populate("studentId", "name studentId").populate("courseId", "title").sort({ updatedAt: -1 }).lean();
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load fees", error: error.message });
  }
};
