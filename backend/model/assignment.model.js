import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
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
      default: null,
      index: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    maxMarks: {
      type: Number,
      min: 0,
      max: 1000,
      default: 10,
    },

    attachments: [
      {
        type: String,
        default: [],
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "DRAFT", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({ coachingId: 1, batchId: 1, createdAt: -1 });
assignmentSchema.index({ coachingId: 1, status: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;