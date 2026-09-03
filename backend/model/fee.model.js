import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
      index: true,
    },
    coachingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coaching",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    registrationFee: { type: Number, default: 0, min: 0 },
    courseFee: { type: Number, default: 0, min: 0 },
    certificateFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    totalPaid: { type: Number, default: 0, min: 0 },
    totalPending: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
    payments: [
      {
        receiptNo: { type: String, required: true },
        amount: { type: Number, required: true, min: 1 },
        feeType: { type: String, default: "Course Fee" },
        paymentMode: { type: String, default: "Cash" },
        note: { type: String, default: "" },
        paidAt: { type: Date, default: Date.now },
        receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Fee", feeSchema);
