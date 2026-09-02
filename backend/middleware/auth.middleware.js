import jwt from "jsonwebtoken";

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
      role: decoded.role || "SUPER_ADMIN",
    };

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