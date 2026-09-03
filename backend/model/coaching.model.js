const mongoose = require("mongoose");

const coachingSchema = new mongoose.Schema(
  {
    coachingId: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Coaching name is required"],
      trim: true,
    },

    code: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },

    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    ownerPhone: {
      type: String,
      required: [true, "Owner phone is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },

    documents: [
      {
        name: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },

        type: {
          type: String,
          trim: true,
        },
      },
    ],

    agreementStartDate: {
      type: Date,
    },

    agreementEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "active",
        "suspended",
        "inactive",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedAt: {
      type: Date,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // Courses made available to this franchise
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // Franchise admin account
    adminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   AUTO GENERATE COACHING ID
========================================================= */

coachingSchema.pre("save", async function (next) {
  if (!this.isNew || this.coachingId) {
    return next();
  }

  try {
    const count = await mongoose.models.Coaching.countDocuments();

    this.coachingId = `AIS-FR-${String(count + 1).padStart(4, "0")}`;

    next();
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   INDEXES
========================================================= */

coachingSchema.index({
  name: 1,
});

coachingSchema.index({
  city: 1,
  state: 1,
});

coachingSchema.index({
  status: 1,
  isActive: 1,
});

module.exports = mongoose.model("Coaching", coachingSchema);
