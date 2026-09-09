import mongoose from "mongoose";
import Certificate from "../model/certificate.model.js";
import Counter from "../model/counter.model.js";
import Course from "../model/course.model.js";
import Student from "../model/student.model.js";
import User from "../model/user.model.js";
import Batch from "../model/batches.model.js";

const adminRoles = ["SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN"];
const franchiseRoles = ["FRANCHISE", "FRANCHISE_ADMIN"];

const studentIdentity = (req) => ({
  $or: [
    ...(mongoose.isValidObjectId(req.user?._id) ? [{ userId: req.user._id }] : []),
    ...(req.user?.email ? [{ email: req.user.email.toLowerCase() }] : []),
  ],
});

const canViewStudent = async (student, req) => {
  if (adminRoles.includes(req.user.role)) return true;
  if (req.user.role === "STUDENT") {
    return Boolean((await Student.exists({ _id: student._id, ...studentIdentity(req) })));
  }
  if (franchiseRoles.includes(req.user.role)) {
    return String(student.coachingId?._id || student.coachingId) === String(req.user.coachingId);
  }
  if (req.user.role === "TEACHER") {
    if (req.user.coachingId && String(student.coachingId?._id || student.coachingId) !== String(req.user.coachingId)) return false;
    const teacher = await User.findById(req.user._id).select("assignedCourses").lean();
    const courseIds = teacher?.assignedCourses || await Batch.find({ teacher: req.user._id }).distinct("course");
    const assignedBatch = student.batchId && await Batch.exists({ _id: student.batchId._id || student.batchId, teacher: req.user._id });
    return Boolean(assignedBatch || courseIds.some((courseId) => String(courseId) === String(student.courseId?._id || student.courseId)));
  }
  return false;
};

const getEligibility = (student, course) => {
  const rules = course?.certificateEligibility || {};
  const progress = Number(student.courseProgress || 0);
  const attendance = Number(student.attendancePercentage || 0);
  const pendingFees = Number(student.totalPending || 0);
  const minimumAttendance = Number(rules.minimumAttendance ?? 75);
  const eligible = progress >= 100 && attendance >= minimumAttendance && pendingFees <= 0;
  return {
    eligible,
    progress,
    attendance,
    pendingFees,
    minimumAttendance,
    minimumProgress: 100,
    reasons: [
      progress < 100 ? "Complete 100% course progress" : null,
      attendance < minimumAttendance ? `Maintain at least ${minimumAttendance}% attendance` : null,
      pendingFees > 0 ? "Clear all pending fees" : null,
    ].filter(Boolean),
  };
};

const nextCertificateNumber = async () => {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { key: `certificate-${year}` },
    { $inc: { sequence: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return `AIS-CERT-${year}-${String(counter.sequence).padStart(6, "0")}`;
};

const loadStudent = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Student.findById(id)
    .populate("courseId", "title certificateEligibility")
    .populate("coachingId", "name code")
    .populate("batchId", "teacher name code")
    .lean();
};

export const getCertificate = async (req, res) => {
  try {
    const requestedId = req.params.studentId;
    const student = req.user.role === "STUDENT"
      ? await Student.findOne(studentIdentity(req)).select("_id").lean().then((item) => item && loadStudent(item._id))
      : await loadStudent(requestedId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    if (!(await canViewStudent(student, req))) return res.status(403).json({ success: false, message: "You are not authorized to view this certificate" });

    const eligibility = getEligibility(student, student.courseId);
    let certificate = await Certificate.findOne({ studentId: student._id }).lean();

    if (!certificate && eligibility.eligible) {
      const certificateNumber = await nextCertificateNumber();
      try {
        certificate = await Certificate.create({
          certificateNumber,
          studentId: student._id,
          courseId: student.courseId._id,
          coachingId: student.coachingId._id,
          studentName: student.name,
          courseTitle: student.courseId.title,
          progress: eligibility.progress,
          attendance: eligibility.attendance,
          pendingFees: eligibility.pendingFees,
        });
      } catch (error) {
        if (error.code !== 11000) throw error;
        certificate = await Certificate.findOne({ studentId: student._id }).lean();
      }
      await Student.updateOne({ _id: student._id }, { $set: { certificateEligible: true, certificateIssued: true, certificateId: certificate._id } });
    }

    return res.json({ success: true, data: { student, eligibility, certificate } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load certificate", error: error.message });
  }
};