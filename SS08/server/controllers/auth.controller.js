import bcrypt from "bcrypt";
import Customer from "../models/Customer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, age, password } = req.body;
  // validate tối thiểu
  if (!name || !email || !age || !password) {
    return res.status(400).json({ message: "name, email, age, password are required" });
  }

  // email duy nhất
  const existed = await Customer.findOne({ email });
  if (existed) return res.status(409).json({ message: "Email already exists" });

  // băm mật khẩu
  const passwordHash = await bcrypt.hash(password, 10);

  // tạo user mới – giữ nguyên conventions id/name/email/age của project
  const created = await Customer.create({ name, email, age, passwordHash });

  // không trả passwordHash
  res.status(201).json({ id: created.id, name: created.name, email: created.email, age: created.age });
});

const API_PREFIX = "web-";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email & password are required" });

  const user = await Customer.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid email or password" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  // nếu chưa có chuỗi rand thì sinh mới và lưu
  if (!user.apiKeyRand) {
    const { randomBytes } = await import("crypto");
    user.apiKeyRand = randomBytes(6).toString("hex"); // 12 hex
    await user.save();
  }

  const apiKey = `${API_PREFIX}$${user.id}$-$${user.email}$-$${user.apiKeyRand}$`;
  res.json({ apiKey });
});

