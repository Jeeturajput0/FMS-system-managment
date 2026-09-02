import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

const demoUsers = [
  {
    id: "admin-1",
    name: "Super Admin",
    email: "admin@aischolar.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "SUPER_ADMIN",
  },
];

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "ai-scholars-dev-secret",
    { expiresIn: "7d" }
  );

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = demoUsers.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = {
      id: `admin-${Date.now()}`,
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || "ADMIN",
    };

    demoUsers.push(newUser);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: signToken(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = demoUsers.find((item) => item.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: signToken(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
});

router.get("/me", (req, res) => {
  return res.json({
    success: true,
    user: {
      id: "admin-1",
      name: "Super Admin",
      email: "admin@aischolar.com",
      role: "SUPER_ADMIN",
    },
  });
});

export default router;
