import { isDbConnected } from "../config/db.js";

export const requireDatabase = (_req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database unavailable. Add this machine IP to MongoDB Atlas Network Access and restart the backend.",
    });
  }
  return next();
};
