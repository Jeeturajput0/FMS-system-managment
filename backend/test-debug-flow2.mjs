import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "./model/user.model.js";
import Student from "./model/student.model.js";

const MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.JWT_SECRET || "ai-scholars-dev-secret";
const base = "http://localhost:5000";

const call = async (path, { token } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { headers });
  const text = await res.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = { raw: text.slice(0, 150) }; }
  return { status: res.status, payload };
};

await mongoose.connect(MONGO_URI);
const franchise = await User.findOne({ role: "FRANCHISE" }).lean();

const sign = (id, email, role, coachingId) => jwt.sign(
  { id: String(id), email, role, coachingId },
  SECRET,
  { expiresIn: "1h" },
);

// student WITH matching record (ronit), token has coachingId null like real login
const ronitUser = await User.findOne({ email: "ronit@gmail.com" }).lean();
const ronitTok = sign(ronitUser._id, ronitUser.email, "STUDENT", null);
const r1 = await call("/api/portal/assignments", { token: ronitTok });
console.log("STUDENT ronit (has record) ->", r1.status, JSON.stringify(r1.payload).slice(0, 200));

const linked = await Student.findOne({ email: "ronit@gmail.com" }).select("userId").lean();
console.log("ronit record userId linked:", String(linked?.userId) === String(ronitUser._id));

// student WITHOUT matching record (divyansh)
const divUser = await User.findOne({ email: "divyansh@gmail.com" }).lean();
const divTok = sign(divUser._id, divUser.email, "STUDENT", null);
const r2 = await call("/api/portal/assignments", { token: divTok });
console.log("STUDENT divyansh (no record) ->", r2.status, JSON.stringify(r2.payload).slice(0, 150));

// student dashboard should also work now
const r3 = await call("/api/portal/dashboard", { token: ronitTok });
console.log("STUDENT ronit dashboard ->", r3.status, "students:", r3.payload?.data?.students);

// franchise trio (what TeacherAssignments page fetches)
const fTok = sign(franchise._id, franchise.email, "FRANCHISE", franchise.coachingId);
for (const p of ["/api/portal/assignments", "/api/portal/teacher-batches", "/api/portal/courses"]) {
  const r = await call(p, { token: fTok });
  console.log("FRANCHISE", p, "->", r.status, "count:", (r.payload.data || []).length);
}

process.exit(0);