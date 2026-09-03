const mongoose = require("mongoose");
const Coaching = require("../models/coaching.model");
const Course = require("../models/course.model");

/* =========================================================
   CREATE COACHING / FRANCHISE
========================================================= */

const createCoaching = async (req, res) => {
  try {
    const {
      name,
      code,
      ownerName,
      ownerEmail,
      ownerPhone,
      email,
      phone,
      alternatePhone,
      address,
      city,
      state,
      pincode,
      country,
      logo,
      website,
      gstNumber,
      panNumber,
      documents,
      agreementStartDate,
      agreementEndDate,
      notes,
    } = req.body;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Coaching name is required",
      });
    }

    if (!ownerName) {
      return res.status(400).json({
        success: false,
        message: "Owner name is required",
      });
    }

    if (!ownerPhone) {
      return res.status(400).json({
        success: false,
        message: "Owner phone is required",
      });
    }

    /* -----------------------------------------------------
       DUPLICATE NAME
    ----------------------------------------------------- */

    const existingName = await Coaching.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "A coaching/franchise with this name already exists",
      });
    }

    /* -----------------------------------------------------
       DUPLICATE CODE
    ----------------------------------------------------- */

    if (code) {
      const existingCode = await Coaching.findOne({
        code: code.toUpperCase().trim(),
      });

      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: "Coaching code already exists",
        });
      }
    }

    /* -----------------------------------------------------
       CREATE
    ----------------------------------------------------- */

    const coaching = await Coaching.create({
      name: name.trim(),
      code: code ? code.toUpperCase().trim() : undefined,

      ownerName: ownerName.trim(),

      ownerEmail: ownerEmail?.trim().toLowerCase(),

      ownerPhone: ownerPhone.trim(),

      email: email?.trim().toLowerCase(),

      phone: phone?.trim(),

      alternatePhone: alternatePhone?.trim(),

      address: address?.trim(),

      city: city?.trim(),

      state: state?.trim(),

      pincode: pincode?.trim(),

      country: country?.trim() || "India",

      logo: logo || "",

      website: website?.trim(),

      gstNumber: gstNumber?.toUpperCase().trim(),

      panNumber: panNumber?.toUpperCase().trim(),

      documents: Array.isArray(documents) ? documents : [],

      agreementStartDate,

      agreementEndDate,

      notes: notes?.trim(),

      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Coaching/franchise created successfully",
      coaching,
    });
  } catch (error) {
    console.error("CREATE COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create coaching/franchise",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   GET ALL COACHINGS
========================================================= */

const getCoachings = async (req, res) => {
  try {
    const { search, status, city, state, page = 1, limit = 20 } = req.query;

    const filter = {};

    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          coachingId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          ownerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          ownerPhone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* -----------------------------------------------------
       FILTERS
    ----------------------------------------------------- */

    if (status && status !== "All") {
      filter.status = status;
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (state) {
      filter.state = {
        $regex: state,
        $options: "i",
      };
    }

    /* -----------------------------------------------------
       PAGINATION
    ----------------------------------------------------- */

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [coachings, total] = await Promise.all([
      Coaching.find(filter)
        .populate("courses", "title slug courseFee duration level")
        .populate("approvedBy", "name email role")
        .populate("createdBy", "name email role")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Coaching.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      coachings,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("GET COACHINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coachings",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   GET ACTIVE COACHINGS
========================================================= */

const getActiveCoachings = async (req, res) => {
  try {
    const coachings = await Coaching.find({
      isActive: true,
      status: "active",
    })
      .select("coachingId name code city state logo status")
      .sort({
        name: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      coachings,
    });
  } catch (error) {
    console.error("GET ACTIVE COACHINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active coachings",
    });
  }
};

/* =========================================================
   GET COACHING BY ID
========================================================= */

const getCoachingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id)
      .populate(
        "courses",
        "title slug description courseFee duration level category isPublished",
      )
      .populate("approvedBy", "name email role")
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .populate("adminUserId", "name email role");

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    return res.status(200).json({
      success: true,
      coaching,
    });
  } catch (error) {
    console.error("GET COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coaching",
    });
  }
};

/* =========================================================
   UPDATE COACHING
========================================================= */

const updateCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    const allowedFields = [
      "name",
      "code",
      "ownerName",
      "ownerEmail",
      "ownerPhone",
      "email",
      "phone",
      "alternatePhone",
      "address",
      "city",
      "state",
      "pincode",
      "country",
      "logo",
      "website",
      "gstNumber",
      "panNumber",
      "documents",
      "agreementStartDate",
      "agreementEndDate",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        coaching[field] = req.body[field];
      }
    });

    if (req.body.code) {
      const duplicate = await Coaching.findOne({
        code: req.body.code.toUpperCase().trim(),

        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Coaching code already exists",
        });
      }

      coaching.code = req.body.code.toUpperCase().trim();
    }

    if (req.body.name) {
      const duplicate = await Coaching.findOne({
        name: {
          $regex: `^${req.body.name.trim()}$`,
          $options: "i",
        },
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another coaching with this name already exists",
        });
      }

      coaching.name = req.body.name.trim();
    }

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching updated successfully",
      coaching,
    });
  } catch (error) {
    console.error("UPDATE COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coaching",
    });
  }
};

/* =========================================================
   DELETE / DEACTIVATE COACHING
========================================================= */

const deleteCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    /*
      Soft delete.
      We don't physically remove the
      franchise because students,
      batches, payments etc. may refer
      to it.
    */

    coaching.isActive = false;
    coaching.status = "inactive";
    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching deactivated successfully",
    });
  } catch (error) {
    console.error("DELETE COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate coaching",
    });
  }
};

/* =========================================================
   APPROVE COACHING
========================================================= */

const approveCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    coaching.approvalStatus = "approved";

    coaching.status = "active";

    coaching.isActive = true;

    coaching.approvedAt = new Date();

    coaching.approvedBy = req.user?._id;

    coaching.rejectionReason = undefined;

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching approved successfully",
      coaching,
    });
  } catch (error) {
    console.error("APPROVE COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve coaching",
    });
  }
};

/* =========================================================
   REJECT COACHING
========================================================= */

const rejectCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    const { rejectionReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    coaching.approvalStatus = "rejected";

    coaching.status = "rejected";

    coaching.isActive = false;

    coaching.rejectionReason = rejectionReason || "";

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching rejected successfully",
      coaching,
    });
  } catch (error) {
    console.error("REJECT COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject coaching",
    });
  }
};

/* =========================================================
   SUSPEND COACHING
========================================================= */

const suspendCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    coaching.status = "suspended";

    coaching.isActive = false;

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching suspended successfully",
      coaching,
    });
  } catch (error) {
    console.error("SUSPEND COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to suspend coaching",
    });
  }
};

/* =========================================================
   ACTIVATE COACHING
========================================================= */

const activateCoaching = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    coaching.status = "active";

    coaching.isActive = true;

    coaching.approvalStatus = "approved";

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    return res.status(200).json({
      success: true,
      message: "Coaching activated successfully",
      coaching,
    });
  } catch (error) {
    console.error("ACTIVATE COACHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate coaching",
    });
  }
};

/* =========================================================
   ASSIGN COURSE TO FRANCHISE
========================================================= */

const assignCourseToCoaching = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const [coaching, course] = await Promise.all([
      Coaching.findById(id),
      Course.findById(courseId),
    ]);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const alreadyAssigned = coaching.courses.some(
      (existingCourseId) => existingCourseId.toString() === courseId.toString(),
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Course is already assigned to this coaching",
      });
    }

    coaching.courses.push(course._id);

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    /*
      Also update Course.availableForFranchises
    */

    const alreadyAvailable = course.availableForFranchises?.some(
      (coachingId) => coachingId.toString() === id.toString(),
    );

    if (!alreadyAvailable) {
      course.availableForFranchises = course.availableForFranchises || [];

      course.availableForFranchises.push(coaching._id);

      course.updatedBy = req.user?._id;

      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Course assigned to coaching successfully",
      coaching,
    });
  } catch (error) {
    console.error("ASSIGN COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign course",
    });
  }
};

/* =========================================================
   REMOVE COURSE FROM FRANCHISE
========================================================= */

const removeCourseFromCoaching = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coaching ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const coaching = await Coaching.findById(id);

    if (!coaching) {
      return res.status(404).json({
        success: false,
        message: "Coaching/franchise not found",
      });
    }

    coaching.courses = coaching.courses.filter(
      (existingCourseId) => existingCourseId.toString() !== courseId.toString(),
    );

    coaching.updatedBy = req.user?._id;

    await coaching.save();

    /*
      Remove franchise from course availability
    */

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        availableForFranchises: coaching._id,
      },
      $set: {
        updatedBy: req.user?._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course removed from coaching successfully",
      coaching,
    });
  } catch (error) {
    console.error("REMOVE COURSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove course",
    });
  }
};

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  createCoaching,
  getCoachings,
  getActiveCoachings,
  getCoachingById,
  updateCoaching,
  deleteCoaching,
  approveCoaching,
  rejectCoaching,
  suspendCoaching,
  activateCoaching,
  assignCourseToCoaching,
  removeCourseFromCoaching,
};
