import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./model/user.model.js";

await mongoose.connect(process.env.MONGO_URI);

for (const role of ["FRANCHISE", "TEACHER", "STUDENT"]) {
  const users = await User.find({ role }).select("email coachingId name isActive").lean();
  console.log(`== ${role} (${users.length}) ==`);
  users.forEach((u) => console.log("-", u.email, "| coaching:", String(u.coachingId), "| active:", u.isActive));
}
process.exit(0);