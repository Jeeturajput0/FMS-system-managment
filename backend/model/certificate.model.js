import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: { type: String, required: true, unique: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    coachingId: { type: mongoose.Schema.Types.ObjectId, ref: "Coaching", required: true },
    studentName: { type: String, required: true },
    courseTitle: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    progress: { type: Number, required: true },
    attendance: { type: Number, required: true },
    pendingFees: { type: Number, required: true },
    // ---- dynamic certificate system (additive, existing fields untouched) ----
    // Course-based template that was used when this certificate was issued.
    templateId: { type: String, default: "template-1", index: true },
    templateName: { type: String, default: "Classic Blue" },
    // Snapshot dates so the certificate stays valid even if student/course data changes later.
    startDate: { type: Date, default: null },
    completionDate: { type: Date, default: null },
    // Snapshot of the rendered description (placeholders already replaced).
    description: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "REVOKED"], default: "ACTIVE", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Certificate", certificateSchema);