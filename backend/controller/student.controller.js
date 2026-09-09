import mongoose from "mongoose";
import User from "../model/user.model.js";

import Student from "../model/student.model.js";
import Course from "../model/course.model.js";
import Coaching from "../model/coaching.model.js";
import Fee from "../model/fee.model.js";
import Batch from "../model/batches.model.js";

const franchiseRoles = ["FRANCHISE", "FRANCHISE_ADMIN"];

const getUserCoachingId = async (req) => {
  if (!franchiseRoles.includes(req.user?.role)) return null;

  if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
    const user = await User.findById(req.user._id).select("coachingId").lean();
    return user?.coachingId || req.user.coachingId || null;
  }

  return req.user?.coachingId || null;
};

const isOutsideFranchise = async (student, req) => {
  const coachingId = await getUserCoachingId(req);
  // `coachingId` is populated by the single-student endpoint, while it is
  // kept as an ObjectId by the update/delete endpoints. Always compare the
  // underlying id so both representations authorize the same student.
  const studentCoachingId = student.coachingId?._id || student.coachingId;
  return coachingId && String(studentCoachingId) !== String(coachingId);
};

const getNextStudentId = async (prefix) => {
  let sequence = 1;
  while (await Student.exists({ studentId: `${prefix}${String(sequence).padStart(4, "0")}` })) sequence += 1;
  if (sequence > 9999) throw new Error("Student ID limit reached for this franchise and course");
  return `${prefix}${String(sequence).padStart(4, "0")}`;
};

const getCourseCode = (course) => {
  const title = String(course?.title || course?.name || "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim();
  const normalized = title.toLowerCase();

  if (normalized.includes("full") && normalized.includes("stack")) return "FS";
  if (normalized.includes("data") && normalized.includes("analysis")) return "DS";

  const words = title.split(/\s+/).filter(Boolean);
  return (words.length > 1
    ? words.map((word) => word[0]).join("")
    : title.slice(0, 2)
  ).toUpperCase().slice(0, 2) || "CO";
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

    const userCoachingId = await getUserCoachingId(req);
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

    const [course, coaching] = await Promise.all([
      Course.findById(courseId),
      Coaching.findById(resolvedCoachingId).select("code"),
    ]);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!coaching?.code) {
      return res.status(404).json({
        success: false,
        message: "Franchise code not found",
      });
    }

    const franchiseCode = String(coaching.code)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    const studentIdPrefix = `${franchiseCode}${getCourseCode(course)}`;

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

    let student;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        student = await Student.create({
      coachingId: resolvedCoachingId,

      // Generate the ID here and check the unique index. The old model hook
      // used countDocuments() alone, which can reuse an existing ID when a
      // record was deleted or when two requests arrive together.
      studentId: await getNextStudentId(studentIdPrefix),

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
        break;
      } catch (createError) {
        if (createError?.code !== 11000 || attempt === 4) throw createError;
      }
    }

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

    const userCoachingId = await getUserCoachingId(req);

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
        .populate({
          path: "batchId",
          select: "name code course teacher status startDate endDate days room",
          populate: [
            { path: "teacher", select: "name email isActive" },
            { path: "course", select: "title name" },
          ],
        })
        .populate("createdBy", "name email")

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(limitNumber),

      Student.countDocuments(query),
    ]);

    // Older records may only be present in Batch.students and may not yet
    // have Student.batchId. Resolve that legacy relationship for admin views.
    const missingBatchStudentIds = students
      .filter((student) => !student.batchId)
      .map((student) => student._id);
    if (missingBatchStudentIds.length) {
      const linkedBatches = await Batch.find({ students: { $in: missingBatchStudentIds } })
        .select("name code course teacher status startDate endDate days room students")
        .populate("teacher", "name email isActive")
        .populate("course", "title name")
        .lean();
      const batchByStudent = new Map();
      linkedBatches.forEach((batch) => batch.students.forEach((studentId) => batchByStudent.set(String(studentId), batch)));
      students.forEach((student) => {
        const batch = batchByStudent.get(String(student._id));
        if (batch) student.batchId = batch;
      });
    }

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
      .populate({
        path: "batchId",
        select: "name code course teacher status startDate endDate days room",
        populate: [
          { path: "teacher", select: "name email isActive" },
          { path: "course", select: "title name" },
        ],
      })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (await isOutsideFranchise(student, req)) {
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

    if (await isOutsideFranchise(student, req)) {
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

    if (await isOutsideFranchise(student, req)) {
      return res.status(403).json({ success: false, message: "Student does not belong to your franchise" });
    }

    // A delete action must remove the record for franchise users as well.
    // Keep references consistent so deleted students do not remain in batches.
    await Promise.all([
      Student.deleteOne({ _id: student._id }),
      Fee.deleteMany({ studentId: student._id }),
      Batch.updateMany(
        { students: student._id },
        { $pull: { students: student._id } },
      ),
    ]);

    return res.status(200).json({
      success: true,

      message: "Student deleted successfully",
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

    if (await isOutsideFranchise(student, req)) {
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
