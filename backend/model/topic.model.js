import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["Lesson", "Video", "PDF", "Assignment", "Test"],
      default: "Lesson",
    },
    duration: {
      value: { type: Number, default: 0, min: 0 },
      unit: {
        type: String,
        enum: ["minutes", "hours", "days"],
        default: "minutes",
      },
    },
    order: { type: Number, default: 1, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

topicSchema.index({ moduleId: 1, order: 1 });

export default mongoose.model("Topic", topicSchema);
