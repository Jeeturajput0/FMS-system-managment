import mongoose from "mongoose";

import Student from "../model/student.model.js";
import Course from "../model/course.model.js";
import Fee from "../model/fee.model.js";

const franchiseRoles = ["FRANCHISE", "FRANCHISE_ADMIN"];

const getUserCoachingId = (req) =>
  franchiseRoles.includes(req.user?.role) ? req.user.coachingId : null;

const isOutsideFranchise = (student, req) => {
  const coachingId = getUserCoachingId(req);
  return coachingId && String(student.coachingId) !== String(coachingId);
};

// ======================================================
// CREATE STUDENT
// POST /api/students
// ======================================================

export const createStudent = async (req, res) => {
  try {
    const {
      coachingId,
      name,
      fatherName,
      motherName,
      mobile,
      email,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      photo,

      courseId,
      batchId,

      joiningDate,

      registrationFee,
      courseFee,
      certificateFee,

      status,
    } = req.body;

    // ==================================================
    // REQUIRED VALIDATION
    // ==================================================

    const userCoachingId = getUserCoachingId(req);
    const resolvedCoachingId =
      userCoachingId || coachingId || process.env.DEFAULT_COACHING_ID;

    if (!resolvedCoachingId) {
      return res.status(400).json({
        success: false,
        message: "Coaching is required",
      });
    }

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

    if (!mobile?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course is required",
      });
    }

    // ==================================================
    // VALIDATE OBJECT IDS
    // ==================================================

    if (!mongoose.Types.ObjectId.isValid(resolvedCoachingId)) {
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

    // ==================================================
    // CHECK COURSE
    // ==================================================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==================================================
    // DUPLICATE MOBILE IN SAME COACHING
    // ==================================================

    const existingStudent = await Student.findOne({
      coachingId: resolvedCoachingId,
      mobile: mobile.trim(),
      status: {
        $nin: ["dropped"],
      },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message:
          "Student with this mobile number already exists in this coaching",
      });
    }

    // ==================================================
    // BATCH VALIDATION
    // ==================================================

    if (batchId) {
      if (!mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid batch ID",
        });
      }
    }

    // ==================================================
    // FEES
    // ==================================================

    const finalRegistrationFee =
      registrationFee !== undefined
        ? Number(registrationFee)
        : Number(course.registrationFee || 0);

    const finalCourseFee =
      courseFee !== undefined
        ? Number(courseFee)
        : Number(course.courseFee || 0);

    const finalCertificateFee =
      certificateFee !== undefined
        ? Number(certificateFee)
        : Number(course.certificateFee || 0);

    const totalFee =
      finalRegistrationFee + finalCourseFee + finalCertificateFee;

    // ==================================================
    // CREATE STUDENT
    // ==================================================

    const student = await Student.create({
      coachingId: resolvedCoachingId,

      name: name.trim(),

      fatherName: fatherName?.trim() || "",

      motherName: motherName?.trim() || "",

      mobile: mobile.trim(),

      email: email?.trim().toLowerCase() || "",

      dob: dob || null,

      gender: gender || "Other",

      address: address?.trim() || "",

      city: city?.trim() || "",

      state: state?.trim() || "",

      pincode: pincode?.trim() || "",

      photo: photo || "",

      courseId,

      batchId: batchId || null,

      joiningDate: joiningDate || new Date(),

      enrollmentDate: new Date(),

      registrationFee: finalRegistrationFee,

      courseFee: finalCourseFee,

      certificateFee: finalCertificateFee,

      totalPaid: 0,

      totalPending: totalFee,

      status: status || "registered",

      createdBy: req.user._id,
    });

    try {
      await Fee.create({
        studentId: student._id,
        coachingId: resolvedCoachingId,
        courseId,
        registrationFee: finalRegistrationFee,
        courseFee: finalCourseFee,
        certificateFee: finalCertificateFee,
        totalAmount: totalFee,
        totalPending: totalFee,
      });
    } catch (feeError) {
      await Student.findByIdAndDelete(student._id);
      throw feeError;
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register student",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL STUDENTS
// GET /api/students
// ======================================================

export const getStudents = async (req, res) => {
  try {
    const {
      search = "",
      coachingId,
      courseId,
      batchId,
      status,

      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // ==================================================
    // COACHING FILTER
    // ==================================================

    const userCoachingId = getUserCoachingId(req);

    if (userCoachingId) {
      if (!mongoose.Types.ObjectId.isValid(userCoachingId)) {
        return res.status(403).json({
          success: false,
          message: "Your account is not linked to a valid franchise",
        });
      }
      query.coachingId = userCoachingId;
    } else if (coachingId) {
      if (!mongoose.Types.ObjectId.isValid(coachingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid coaching ID",
        });
      }

      query.coachingId = coachingId;
    }

    // ==================================================
    // COURSE FILTER
    // ==================================================

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      query.courseId = courseId;
    }

    // ==================================================
    // BATCH FILTER
    // ==================================================

    if (batchId) {
      if (!mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid batch ID",
        });
      }

      query.batchId = batchId;
    }

    // ==================================================
    // STATUS FILTER
    // ==================================================

    if (status) {
      query.status = status;
    }

    // ==================================================
    // SEARCH
    // ==================================================

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          mobile: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },

        {
          studentId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    // ==================================================
    // FETCH
    // ==================================================

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate("courseId", "title slug courseFee")
        .populate("coachingId", "name code email phone")
        .populate("createdBy", "name email")

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(limitNumber),

      Student.countDocuments(query),
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message: "Students fetched successfully",

      data: students,

      pagination: {
        total,

        page: pageNumber,

        limit: limitNumber,

        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE STUDENT
// GET /api/students/:id
// ======================================================

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id)
      .populate("courseId")
      .populate("coachingId", "name code email phone")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (isOutsideFranchise(student, req)) {
      return res.status(403).json({ success: false, message: "Student does not belong to your franchise" });
    }

    return res.status(200).json({
      success: true,

      message: "Student fetched successfully",

      student,
    });
  } catch (error) {
    console.error("Get Student Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch student",

      error: error.message,
    });
  }
};

// ======================================================
// UPDATE STUDENT
// PUT /api/students/:id
// ======================================================

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (isOutsideFranchise(student, req)) {
      return res.status(403).json({ success: false, message: "Student does not belong to your franchise" });
    }

    const {
      name,
      fatherName,
      motherName,
      mobile,
      email,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      photo,

      courseId,
      batchId,

      joiningDate,

      registrationFee,
      courseFee,
      certificateFee,

      status,
    } = req.body;

    // ==================================================
    // BASIC DETAILS
    // ==================================================

    if (name !== undefined) {
      student.name = name.trim();
    }

    if (fatherName !== undefined) {
      student.fatherName = fatherName.trim();
    }

    if (motherName !== undefined) {
      student.motherName = motherName.trim();
    }

    if (mobile !== undefined) {
      const duplicate = await Student.findOne({
        coachingId: student.coachingId,

        mobile: mobile.trim(),

        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another student with this mobile number already exists",
        });
      }

      student.mobile = mobile.trim();
    }

    if (email !== undefined) {
      student.email = email.trim().toLowerCase();
    }

    if (dob !== undefined) {
      student.dob = dob || null;
    }

    if (gender !== undefined) {
      student.gender = gender;
    }

    if (address !== undefined) {
      student.address = address.trim();
    }

    if (city !== undefined) {
      student.city = city.trim();
    }

    if (state !== undefined) {
      student.state = state.trim();
    }

    if (pincode !== undefined) {
      student.pincode = pincode.trim();
    }

    if (photo !== undefined) {
      student.photo = photo;
    }

    // ==================================================
    // COURSE
    // ==================================================

    if (courseId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      student.courseId = courseId;
    }

    // ==================================================
    // BATCH
    // ==================================================

    if (batchId !== undefined) {
      if (batchId && !mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid batch ID",
        });
      }

      student.batchId = batchId || null;
    }

    // ==================================================
    // JOINING DATE
    // ==================================================

    if (joiningDate !== undefined) {
      student.joiningDate = joiningDate;
    }

    // ==================================================
    // FEES
    // ==================================================

    if (registrationFee !== undefined) {
      student.registrationFee = Number(registrationFee);
    }

    if (courseFee !== undefined) {
      student.courseFee = Number(courseFee);
    }

    if (certificateFee !== undefined) {
      student.certificateFee = Number(certificateFee);
    }

    // ==================================================
    // STATUS
    // ==================================================

    if (status !== undefined) {
      student.status = status;
    }

    // ==================================================
    // UPDATE PENDING
    // ==================================================

    const totalFee =
      Number(student.registrationFee) +
      Number(student.courseFee) +
      Number(student.certificateFee);

    student.totalPending = Math.max(totalFee - Number(student.totalPaid), 0);

    student.updatedBy = req.user._id;

    await student.save();

    return res.status(200).json({
      success: true,

      message: "Student updated successfully",

      student,
    });
  } catch (error) {
    console.error("Update Student Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update student",

      error: error.message,
    });
  }
};

// ======================================================
// DELETE STUDENT
// DELETE /api/students/:id
// ======================================================

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (isOutsideFranchise(student, req)) {
      return res.status(403).json({ success: false, message: "Student does not belong to your franchise" });
    }

    const isAdmin = ["SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN"].includes(req.user?.role);

    if (isAdmin) {
      await Promise.all([
        Student.deleteOne({ _id: student._id }),
        Fee.deleteMany({ studentId: student._id }),
      ]);
    } else {
      student.status = "inactive";
      student.updatedBy = req.user._id;
      await student.save();
    }

    return res.status(200).json({
      success: true,

      message: isAdmin ? "Student deleted successfully" : "Student deactivated successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete student",

      error: error.message,
    });
  }
};

// ======================================================
// UPDATE STUDENT STATUS
// PATCH /api/students/:id/status
// ======================================================

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const allowedStatuses = [
      "enquiry",
      "registered",
      "active",
      "completed",
      "inactive",
      "dropped",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student status",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (isOutsideFranchise(student, req)) {
      return res.status(403).json({
        success: false,
        message: "Student does not belong to your franchise",
      });
    }

    student.status = status;

    student.updatedBy = req.user._id;

    await student.save();

    return res.status(200).json({
      success: true,

      message: "Student status updated successfully",

      student,
    });
  } catch (error) {
    console.error("Update Student Status Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update student status",

      error: error.message,
    });
  }
};
