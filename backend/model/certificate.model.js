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
  },
  { timestamps: true },
);

export default mongoose.model("Certificate", certificateSchema);