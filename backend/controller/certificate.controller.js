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
    .populate("courseId", "title certificateEligibility certificateTemplate certificateDescription duration")
    .populate("coachingId", "name code")
    .populate("batchId", "teacher name code")
    .lean();
};

/* =====================================================
   DYNAMIC CERTIFICATE SYSTEM (additive helpers)
   Template ids match frontend/src/components/student-id/templates.jsx
===================================================== */

const KNOWN_TEMPLATE_IDS = ["template-1", "template-2", "template-3", "template-4", "template-5", "legacy"];

const TEMPLATE_NAMES = {
  "template-1": "Classic Blue",
  "template-3": "Corporate Cyan",
  "template-4": "Minimal Beige",
  "template-5": "School Cream",
  legacy: "Legacy",
};

const templateGroupOf = (course) => {
  const title = String(course?.title || course?.name || "").toLowerCase();
  const has = (...words) => words.some((w) => title.includes(w));
  if (has("backend", "node", "express", "mongo", "mern", "full stack", "fullstack", "java", "spring", "php", "laravel", "django", "api")) return "backend";
  if (has("python", "data science", "data analys", "machine learning", "artificial intelligence", "cyber", "cloud", "devops")) return "data";
  if (has("graphic", "ui", "ux", "photoshop", "figma", "video edit")) return "design";
  if (has("market", "digital", "seo", "social media", "business", "tally", "account")) return "marketing";
  if (has("frontend", "front-end", "react", "angular", "vue", "web design", "web develop", "javascript")) return "frontend";
  return "general";
};

const resolveCertificateTemplate = (course) => {
  const configured = String(course?.certificateTemplate || "").trim();
  if (KNOWN_TEMPLATE_IDS.includes(configured)) {
    return { id: configured, name: TEMPLATE_NAMES[configured], source: "course" };
  }
  const group = templateGroupOf(course);
  const byGroup = { frontend: "template-1", backend: "template-2", data: "template-3", design: "template-4", marketing: "template-5", general: "template-1" };
  const id = byGroup[group] || "template-1";
  return { id, name: TEMPLATE_NAMES[id], source: "auto" };
};

const DESCRIPTION_TEMPLATES = {
  frontend: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with dedication and consistent performance throughout the program.",
  backend: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong technical skills and consistent performance throughout the program.",
  data: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong analytical skills and consistent performance throughout the program.",
  design: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with creativity and consistent performance throughout the program.",
  marketing: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong practical skills and consistent performance throughout the program.",
  general: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with dedication and consistent performance throughout the program.",
};

const formatLongDate = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(d);
  } catch {
    return "—";
  }
};

const addDuration = (date, duration) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const value = Number(duration?.value || 0);
  if (!value) return null;
  const unit = String(duration?.unit || "months").toLowerCase();
  if (unit.startsWith("day")) d.setDate(d.getDate() + value);
  else if (unit.startsWith("week")) d.setDate(d.getDate() + value * 7);
  else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() + value);
  else d.setMonth(d.getMonth() + value);
  return d;
};

const fillDescription = (template, map) =>
  String(template || "").replace(/\[STUDENT_NAME\]|\[COURSE_NAME\]|\[START_DATE\]|\[COMPLETION_DATE\]|\[CERTIFICATE_ID\]/g, (key) => map[key] ?? key);

const buildCertificatePayload = (student, eligibility, certificate, req) => {
  const course = student.courseId || {};
  const template = resolveCertificateTemplate(course);
  const startDate = certificate?.startDate || student.joiningDate || student.enrollmentDate || student.createdAt || null;
  const completionDate =
    certificate?.completionDate || addDuration(startDate, course.duration) || null;
  const description =
    certificate?.description ||
    course.certificateDescription ||
    DESCRIPTION_TEMPLATES[templateGroupOf(course)] ||
    DESCRIPTION_TEMPLATES.general;
  const values = {
    "[STUDENT_NAME]": certificate?.studentName || student.name || "",
    "[COURSE_NAME]": certificate?.courseTitle || course.title || "",
    "[START_DATE]": formatLongDate(startDate),
    "[COMPLETION_DATE]": formatLongDate(completionDate),
    "[CERTIFICATE_ID]": certificate?.certificateNumber || "",
  };
  return {
    template,
    description: fillDescription(description, values),
    dates: { startDate, completionDate },
    verifyPath: certificate ? `/verify-certificate/${certificate.certificateNumber}` : null,
    canPrint: req?.user?.role === "SUPER_ADMIN",
  };
};

const userObjectIdOrNull = (req) =>
  mongoose.isValidObjectId(req?.user?._id) ? req.user._id : null;

const createCertificateRecord = async (student, eligibility, course, req, overrides = {}) => {
  const certificateNumber = await nextCertificateNumber();
  const template = resolveCertificateTemplate(course);
  const startDate = overrides.startDate || student.joiningDate || student.enrollmentDate || new Date();
  const completionDate = overrides.completionDate || addDuration(startDate, course.duration) || null;
  const values = {
    "[STUDENT_NAME]": student.name || "",
    "[COURSE_NAME]": course.title || "",
    "[START_DATE]": formatLongDate(startDate),
    "[COMPLETION_DATE]": formatLongDate(completionDate),
    "[CERTIFICATE_ID]": certificateNumber,
  };
  const description =
    course.certificateDescription ||
    fillDescription(DESCRIPTION_TEMPLATES[templateGroupOf(course)] || DESCRIPTION_TEMPLATES.general, values);
  try {
    const created = await Certificate.create({
      certificateNumber,
      studentId: student._id,
      courseId: course._id,
      coachingId: student.coachingId?._id || student.coachingId,
      studentName: student.name,
      courseTitle: course.title,
      progress: eligibility.progress,
      attendance: eligibility.attendance,
      pendingFees: eligibility.pendingFees,
      templateId: template.id,
      templateName: template.name,
      startDate,
      completionDate,
      description,
      status: "ACTIVE",
      createdBy: userObjectIdOrNull(req),
    });
    return created.toObject();
  } catch (error) {
    if (error.code !== 11000) throw error;
    return Certificate.findOne({ studentId: student._id }).lean();
  }
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
      certificate = await createCertificateRecord(student, eligibility, student.courseId, req);
      await Student.updateOne({ _id: student._id }, { $set: { certificateEligible: true, certificateIssued: true, certificateId: certificate._id } });
    }

    const dynamic = buildCertificatePayload(student, eligibility, certificate, req);
    return res.json({ success: true, data: { student, eligibility, certificate, ...dynamic } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load certificate", error: error.message });
  }
};

/* =====================================================
   GET /api/certificates (SUPER_ADMIN, ADMIN)
   Certificate Management list
===================================================== */

export const listCertificates = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const filter = {};
    if (["ACTIVE", "REVOKED"].includes(String(req.query.status || "").toUpperCase())) {
      filter.status = String(req.query.status).toUpperCase();
    }
    const search = String(req.query.search || "").trim();
    if (search) {
      filter.$or = [
        { certificateNumber: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
        { courseTitle: { $regex: search, $options: "i" } },
      ];
    }
    const [items, total] = await Promise.all([
      Certificate.find(filter)
        .populate("studentId", "name studentId mobile")
        .populate("courseId", "title")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
    ]);
    return res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load certificates", error: error.message });
  }
};

/* =====================================================
   PATCH /api/certificates/student/:studentId/completion (SUPER_ADMIN only)
   Set completion date; optionally force-issue even if not eligible.
===================================================== */

export const setCompletionDate = async (req, res) => {
  try {
    const student = await loadStudent(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    if (!(await canViewStudent(student, req))) return res.status(403).json({ success: false, message: "You are not authorized for this student" });

    const { completionDate, forceIssue = false } = req.body || {};
    const parsed = completionDate ? new Date(completionDate) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ success: false, message: "A valid completion date is required" });
    }

    const eligibility = getEligibility(student, student.courseId);
    let certificate = await Certificate.findOne({ studentId: student._id }).lean();

    if (!certificate) {
      if (!eligibility.eligible && !forceIssue) {
        return res.status(400).json({ success: false, message: "Student is not eligible for a certificate yet", reasons: eligibility.reasons });
      }
      certificate = await createCertificateRecord(student, eligibility, student.courseId, req, { completionDate: parsed });
      await Student.updateOne({ _id: student._id }, { $set: { certificateEligible: true, certificateIssued: true, certificateId: certificate._id } });
    } else {
      certificate = await Certificate.findByIdAndUpdate(
        certificate._id,
        { $set: { completionDate: parsed, ...(certificate.startDate ? {} : { startDate: student.joiningDate || student.enrollmentDate || new Date() }) } },
        { new: true },
      ).lean();
    }

    const dynamic = buildCertificatePayload(student, eligibility, certificate, req);
    return res.json({ success: true, message: "Completion date saved", data: { student, eligibility, certificate, ...dynamic } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to save completion date", error: error.message });
  }
};

/* =====================================================
   POST /api/certificates/:certificateNumber/revoke (SUPER_ADMIN only)
   Body { status: "REVOKED" } default; { status: "ACTIVE" } restores.
===================================================== */

export const revokeCertificate = async (req, res) => {
  try {
    const status = String(req.body?.status || "REVOKED").toUpperCase();
    if (!["ACTIVE", "REVOKED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid certificate status" });
    }
    const certificate = await Certificate.findOne({ certificateNumber: req.params.certificateNumber });
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate Not Found" });
    certificate.status = status;
    certificate.revokedBy = status === "REVOKED" ? userObjectIdOrNull(req) : null;
    certificate.revokedAt = status === "REVOKED" ? new Date() : null;
    await certificate.save();
    return res.json({ success: true, message: status === "REVOKED" ? "Certificate revoked" : "Certificate restored", data: certificate.toObject() });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update certificate status", error: error.message });
  }
};

/* =====================================================
   GET /api/certificates/verify/:certificateNumber (PUBLIC)
   Only verification-safe fields are exposed.
===================================================== */

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateNumber: req.params.certificateNumber })
      .select("certificateNumber studentName courseTitle issueDate startDate completionDate status")
      .lean();
    if (!certificate) return res.status(404).json({ success: false, message: "Certificate Not Found" });
    return res.json({
      success: true,
      data: {
        certificateId: certificate.certificateNumber,
        studentName: certificate.studentName,
        courseName: certificate.courseTitle,
        issueDate: certificate.issueDate,
        completionDate: certificate.completionDate,
        status: certificate.status || "ACTIVE",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Certificate verification failed", error: error.message });
  }
};