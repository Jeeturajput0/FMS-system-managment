import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // ============================================
    // LOGIN USER REFERENCE
    // ============================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ============================================
    // COACHING / FRANCHISE
    // ============================================

    coachingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coaching",
      required: [true, "Coaching is required"],
      index: true,
    },

    // ============================================
    // STUDENT ID
    // ============================================

    studentId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },

    // ============================================
    // PERSONAL DETAILS
    // ============================================

    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    fatherName: {
      type: String,
      trim: true,
      default: "",
    },

    motherName: {
      type: String,
      trim: true,
      default: "",
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    // ============================================
    // COURSE
    // ============================================

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },

    // ============================================
    // BATCH
    // ============================================

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
      index: true,
    },

    // ============================================
    // ENROLLMENT
    // ============================================

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
    },

    // ============================================
    // FEES
    // ============================================

    registrationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    courseFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    certificateFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================
    // PAYMENT SUMMARY
    // ============================================

    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPending: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================
    // STUDENT STATUS
    // ============================================

    status: {
      type: String,
      enum: [
        "enquiry",
        "registered",
        "active",
        "completed",
        "inactive",
        "dropped",
      ],
      default: "registered",
    },

    // ============================================
    // COURSE PROGRESS
    // ============================================

    courseProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============================================
    // ATTENDANCE
    // ============================================

    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============================================
    // CERTIFICATE
    // ============================================

    certificateEligible: {
      type: Boolean,
      default: false,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },

    // ============================================
    // CREATED / UPDATED BY
    // ============================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ==================================================
// INDEXES
// ==================================================

studentSchema.index({
  coachingId: 1,
  courseId: 1,
});

studentSchema.index({
  coachingId: 1,
  batchId: 1,
});

studentSchema.index({
  coachingId: 1,
  name: 1,
});

// ==================================================
// AUTO STUDENT ID
// ==================================================

studentSchema.pre("save", async function () {
  if (!this.studentId) {
    const count = await mongoose.model("Student").countDocuments();

    this.studentId = `AIS-STU-${String(count + 1).padStart(5, "0")}`;
  }
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
