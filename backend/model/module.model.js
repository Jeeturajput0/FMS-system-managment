import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    // Course reference
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },

    // Module title
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      minlength: [2, "Module title must be at least 2 characters"],
      maxlength: [150, "Module title cannot exceed 150 characters"],
    },

    // Module description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Module order inside course
    order: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    // Optional module thumbnail
    thumbnail: {
      type: String,
      default: "",
    },

    // Module duration
    duration: {
      value: {
        type: Number,
        default: 0,
        min: 0,
      },

      unit: {
        type: String,
        enum: ["minutes", "hours", "days", "weeks"],
        default: "hours",
      },
    },

    // Topics will be added later
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    // Active / inactive
    isActive: {
      type: Boolean,
      default: true,
    },

    // Published / draft
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Created by AI Scholar admin
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

/*
|--------------------------------------------------------------------------
| INDEX
|--------------------------------------------------------------------------
|
| Same course ke modules ko order ke according quickly fetch karne ke liye
|
*/

moduleSchema.index({
  courseId: 1,
  order: 1,
});

/*
|--------------------------------------------------------------------------
| PREVENT DUPLICATE MODULE TITLE INSIDE SAME COURSE
|--------------------------------------------------------------------------
*/

moduleSchema.index(
  {
    courseId: 1,
    title: 1,
  },
  {
    unique: true,
  }
);

const Module = mongoose.model("Module", moduleSchema);

export default Module;