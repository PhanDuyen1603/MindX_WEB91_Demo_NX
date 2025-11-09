// controllers/auth.controller.js
// 👉 Đăng ký & đăng nhập tài khoản (Account)
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Account from "../models/Account.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate cơ bản
  if (!email || !password) return res.status(400).json({ message: "email & password required" });
  if (await Account.findOne({ email })) return res.status(409).json({ message: "Email already used" });

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Tạo account
  const acc = await Account.create({ email, password: hash, role: role || "CUSTOMER" });

  // Không trả password ra response
  res.status(201).json({ id: acc._id, email: acc.email, role: acc.role });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Tìm account theo email
  const acc = await Account.findOne({ email });
  if (!acc) return res.status(401).json({ message: "Invalid credentials" });

  // Chặn đăng nhập khi chưa active
  if (!acc.isActive) return res.status(403).json({ message: "Account is inactive" });

  // So sánh password
  const ok = await bcrypt.compare(password, acc.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // Ký JWT chứa id & role
  const token = jwt.sign({ id: acc._id, role: acc.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

  res.json({ token, role: acc.role });
};
