import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coaching",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    days: [
      {
        type: String,
        enum: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ],
      },
    ],

    room: {
      type: String,
      trim: true,
      default: "",
    },

    maxStudents: {
      type: Number,
      default: 30,
      min: 1,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual student count
batchSchema.virtual("studentCount").get(function () {
  return this.students ? this.students.length : 0;
});

// Include virtual fields in JSON
batchSchema.set("toJSON", {
  virtuals: true,
});

batchSchema.set("toObject", {
  virtuals: true,
});

// Export Batch model
const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
