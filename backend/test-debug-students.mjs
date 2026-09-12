import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Student from "./model/student.model.js";

await mongoose.connect(process.env.MONGO_URI);
const recs = await Student.find().select("name email batchId coachingId userId status").lean();
console.log("total:", recs.length);
recs.forEach((s) => console.log("-", s.name, "|", s.email, "| batch:", String(s.batchId), "| user:", String(s.userId)));
process.exit(0);