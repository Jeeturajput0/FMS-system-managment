import mongoose from "mongoose";
import Fee from "../model/fee.model.js";
import Student from "../model/student.model.js";

const toNumber = (value) => Number(value || 0);

export const getFees = async (req, res) => {
  try {
    const query = {};
    if (req.query.studentId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.studentId)) {
        return res.status(400).json({ success: false, message: "Invalid student ID" });
      }
      query.studentId = req.query.studentId;
    }

    const fees = await Fee.find(query)
      .populate("studentId", "studentId name mobile email")
      .populate("courseId", "title")
      .sort({ updatedAt: -1 });

    const payments = fees.flatMap((fee) =>
      fee.payments.map((payment) => ({
        ...payment.toObject(),
        studentId: fee.studentId?._id,
        studentName: fee.studentId?.name || "",
        courseId: fee.courseId?._id,
        course: fee.courseId?.title || "",
        amount: payment.amount,
        date: payment.paidAt,
      })),
    );

    return res.json({ success: true, data: fees, payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch fees", error: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount, feeType = "Course Fee", paymentMode = "Cash", note = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }
    const paymentAmount = toNumber(amount);
    if (paymentAmount <= 0) {
      return res.status(400).json({ success: false, message: "Payment amount must be greater than zero" });
    }

    const fee = await Fee.findOne({ studentId });
    const student = await Student.findById(studentId);
    if (!fee || !student) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }
    if (paymentAmount > fee.totalPending) {
      return res.status(400).json({ success: false, message: "Payment cannot exceed pending fee" });
    }

    const payment = {
      receiptNo: `REC-${Date.now()}`,
      amount: paymentAmount,
      feeType,
      paymentMode,
      note,
      receivedBy: req.user?._id,
    };
    fee.payments.push(payment);
    fee.totalPaid += paymentAmount;
    fee.totalPending = Math.max(fee.totalAmount - fee.totalPaid, 0);
    fee.status = fee.totalPending === 0 ? "Paid" : fee.totalPaid > 0 ? "Partial" : "Pending";
    await fee.save();

    student.totalPaid = fee.totalPaid;
    student.totalPending = fee.totalPending;
    await student.save();

    return res.status(201).json({ success: true, message: "Payment recorded successfully", fee, payment: fee.payments.at(-1) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to record payment", error: error.message });
  }
};
