import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [2, "Course title must be at least 2 characters"],
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },

      unit: {
        type: String,
        enum: ["days", "weeks", "months", "years"],
        default: "months",
      },
    },

    courseFee: {
      type: Number,
      required: [true, "Course fee is required"],
      min: [0, "Course fee cannot be negative"],
    },

    registrationFee: {
      type: Number,
      default: 1000,
      min: 0,
    },

    certificateFee: {
      type: Number,
      default: 3000,
      min: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    certificateEligibility: {
      minimumAttendance: {
        type: Number,
        default: 75,
        min: 0,
        max: 100,
      },

      minimumPassingPercentage: {
        type: Number,
        default: 40,
        min: 0,
        max: 100,
      },

      assignmentRequired: {
        type: Boolean,
        default: true,
      },

      projectRequired: {
        type: Boolean,
        default: false,
      },
    },

    availableForFranchises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coaching",
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug automatically
courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;