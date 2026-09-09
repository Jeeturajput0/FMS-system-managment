import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: ["PERFORMANCE", "FINANCE", "ENROLLMENT"], default: "PERFORMANCE" },
    coachingId: { type: mongoose.Schema.Types.ObjectId, ref: "Coaching", default: null },
    dateFrom: { type: Date, default: null },
    dateTo: { type: Date, default: null },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);