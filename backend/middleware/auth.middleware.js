import jwt from "jsonwebtoken";
import Student from "../model/student.model.js";

export const protect = async (req, res, next) => {
  try {
    if (process.env.ALLOW_DEV_AUTH === "true") {
      req.user = {
        _id: process.env.DEV_USER_ID || "dev-user-id",
        role: process.env.DEV_USER_ROLE || "SUPER_ADMIN",
      };
      return next();
    }

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ai-scholars-dev-secret");

    req.user = {
      _id: decoded.id || decoded._id || "dev-user-id",
      email: decoded.email,
      role: decoded.role || "SUPER_ADMIN",
      coachingId: decoded.coachingId || null,
    };

    // Students who self-registered may not have a coachingId on their login.
    // Resolve it from their Student record (matched by login email) so every
    // coaching-scoped portal endpoint (dashboard, assignments, fees...) works.
    if (req.user.role === "STUDENT" && !req.user.coachingId && req.user.email) {
      try {
        const record = await Student.findOne({
          email: String(req.user.email).toLowerCase(),
        })
          .select("coachingId userId")
          .lean();
        if (record?.coachingId) {
          req.user.coachingId = record.coachingId;
          if (!record.userId) {
            await Student.updateOne(
              { _id: record._id },
              { $set: { userId: req.user._id } },
            );
          }
        }
      } catch {
        // Resolution is best-effort; endpoints return their own errors.
      }
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    return next();
  };
};