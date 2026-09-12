import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./model/user.model.js";
import Student from "./model/student.model.js";

await mongoose.connect(process.env.MONGO_URI);

const studentUsers = await User.find({ role: "STUDENT" }).select("email coachingId name").lean();
console.log("STUDENT users total:", studentUsers.length);
studentUsers.slice(0, 10).forEach((u) => console.log("-", u.email, "| coaching:", String(u.coachingId)));

const totalStudents = await Student.countDocuments();
const withUser = await Student.countDocuments({ userId: { $ne: null } });
console.log("Student records total:", totalStudents, "| with userId:", withUser);

const sample = await Student.findOne().select("name email batchId courseId coachingId userId").lean();
console.log("sample student:", JSON.stringify(sample));
process.exit(0);