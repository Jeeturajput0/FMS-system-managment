const express = require("express");
const router = express.Router();

const {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controller/course.controller");

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;