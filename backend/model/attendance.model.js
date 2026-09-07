import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    coachingId: { type: mongoose.Schema.Types.ObjectId, ref: "Coaching", required: true, index: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true, index: true },
    date: { type: Date, required: true, index: true },
    records: [{
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], required: true },
    }],
  },
  { timestamps: true },
);

attendanceSchema.index({ coachingId: 1, batchId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
