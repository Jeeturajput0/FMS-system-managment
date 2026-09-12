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
const teacher = await User.findOne({ role: "TEACHER", coachingId: franchise.coachingId }).lean();
const studentUser = await User.findOne({ role: "STUDENT", coachingId: franchise.coachingId }).lean();
const studentRec = studentUser ? await Student.findOne({ $or: [{ userId: studentUser._id }, { email: studentUser.email }] }).select("batchId name").lean() : null;

console.log("franchise:", !!franchise, "| teacher:", !!teacher, "| studentUser:", !!studentUser, "| studentRec batch:", String(studentRec?.batchId));

const sign = (u, role) => jwt.sign(
  { id: String(u._id), email: u.email, role, coachingId: String(franchise.coachingId) },
  SECRET,
  { expiresIn: "1h" },
);

for (const [label, u, role] of [["FRANCHISE", franchise, "FRANCHISE"], ["TEACHER", teacher, "TEACHER"], ["STUDENT", studentUser, "STUDENT"]]) {
  if (!u) { console.log(label, "-> no user found, skip"); continue; }
  const r = await call("/api/portal/assignments", { token: sign(u, role) });
  const titles = (r.payload.data || []).map((a) => a.title);
  console.log(label, "->", r.status, "count:", titles.length, JSON.stringify(titles).slice(0, 200));
  if (r.payload.raw) console.log("  RAW:", r.payload.raw);
}

process.exit(0);