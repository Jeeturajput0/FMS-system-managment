import mongoose from "mongoose";
import Course from "../../model/course.model.js";
import Coaching from "../../model/coaching.model.js";
import Fee from "../../model/fee.model.js";
import Report from "../../model/report.model.js";
import Student from "../../model/student.model.js";

const buildFilter = ({ coachingId, dateFrom, dateTo }) => {
  const filter = {};
  if (coachingId && mongoose.isValidObjectId(coachingId)) filter.coachingId = coachingId;
  if (dateFrom || dateTo) filter.createdAt = {};
  if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
  if (dateTo) filter.createdAt.$lte = new Date(`${dateTo}T23:59:59.999Z`);
  return filter;
};

const generateData = async (options = {}) => {
  const filter = buildFilter(options);
  const [students, fees, franchises, courses, franchiseRows] = await Promise.all([
    Student.find(filter).select("status courseProgress attendancePercentage totalPending totalPaid coachingId courseId").lean(),
    Fee.find(options.coachingId ? { coachingId: options.coachingId } : {}).select("totalPaid totalPending totalAmount").lean(),
    Coaching.countDocuments(options.coachingId ? { _id: options.coachingId } : {}),
    Course.countDocuments({ isActive: true }),
    Student.aggregate([
      { $match: filter },
      { $group: { _id: "$coachingId", students: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, pendingFees: { $sum: "$totalPending" }, avgProgress: { $avg: "$courseProgress" }, avgAttendance: { $avg: "$attendancePercentage" } } },
      { $lookup: { from: "coachings", localField: "_id", foreignField: "_id", as: "coaching" } },
      { $unwind: { path: "$coaching", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, franchise: { $ifNull: ["$coaching.name", "Unassigned"] }, students: 1, completed: 1, pendingFees: 1, avgProgress: { $round: ["$avgProgress", 1] }, avgAttendance: { $round: ["$avgAttendance", 1] } } },
      { $sort: { students: -1 } },
    ]),
  ]);
  const totalPaid = fees.reduce((sum, fee) => sum + Number(fee.totalPaid || 0), 0);
  const totalPending = fees.reduce((sum, fee) => sum + Number(fee.totalPending || 0), 0);
  return {
    totals: {
      students: students.length,
      completed: students.filter((student) => student.status === "completed").length,
      active: students.filter((student) => ["active", "registered"].includes(student.status)).length,
      averageProgress: students.length ? Number((students.reduce((sum, student) => sum + Number(student.courseProgress || 0), 0) / students.length).toFixed(1)) : 0,
      averageAttendance: students.length ? Number((students.reduce((sum, student) => sum + Number(student.attendancePercentage || 0), 0) / students.length).toFixed(1)) : 0,
      totalPaid,
      totalPending,
      franchises,
      courses,
    },
    franchiseRows,
    generatedAt: new Date(),
  };
};

const publicReport = (report) => ({ ...report, id: report._id });

export const getReports = async (_req, res) => {
  try { return res.json({ success: true, data: (await Report.find().sort({ updatedAt: -1 }).lean()).map(publicReport) }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to load reports", error: error.message }); }
};

export const createReport = async (req, res) => {
  try {
    const { name, type, coachingId, dateFrom, dateTo } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Report name is required" });
    const report = await Report.create({ name: name.trim(), type, coachingId: coachingId || null, dateFrom: dateFrom || null, dateTo: dateTo || null, data: await generateData({ coachingId, dateFrom, dateTo }), createdBy: req.user._id });
    return res.status(201).json({ success: true, data: publicReport(report.toObject()) });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to create report", error: error.message }); }
};

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    const { name, type, coachingId, dateFrom, dateTo } = req.body;
    report.name = name?.trim() || report.name;
    if (type) report.type = type;
    report.coachingId = coachingId || null;
    report.dateFrom = dateFrom || null;
    report.dateTo = dateTo || null;
    report.data = await generateData({ coachingId, dateFrom, dateTo });
    report.updatedBy = req.user._id;
    await report.save();
    return res.json({ success: true, data: publicReport(report.toObject()) });
  } catch (error) { return res.status(500).json({ success: false, message: "Failed to update report", error: error.message }); }
};

export const deleteReport = async (req, res) => {
  try { const result = await Report.findByIdAndDelete(req.params.id); if (!result) return res.status(404).json({ success: false, message: "Report not found" }); return res.json({ success: true, message: "Report deleted successfully" }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to delete report", error: error.message }); }
};