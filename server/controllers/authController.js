import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/helpers.js";

// تسجيل مستخدم جديد
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash
  });

  const token = generateToken(user._id);

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
};

// تسجيل الدخول
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: "Email or password are wrong" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ msg: "Email or password are wrong" });
  }

  const token = generateToken(user._id);

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
};

// جلب بيانات المستخدم الحالي
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: "User not authenticated" });
  }

  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};
