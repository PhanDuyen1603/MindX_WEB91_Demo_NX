// controllers/admin.controller.js
// 👉 Các API dành cho MANAGER
import bcrypt from "bcrypt";
import Account from "../models/Account.js";
import Employee from "../models/Employee.js";
import Manager from "../models/Manager.js";
import DepositOrder from "../models/DepositOrder.js";

// Yêu cầu 7: Manager tạo tài khoản + thông tin cho Employee
export const createEmployee = async (req, res) => {
  const { email, password, name, phone, department } = req.body;

  // Validate
  if (!email || !password || !name) {
    return res.status(400).json({ message: "email, password, name are required" });
  }

  // Kiểm tra email đã tồn tại
  if (await Account.findOne({ email })) {
    return res.status(409).json({ message: "Email already used" });
  }

  // Lấy thông tin Manager hiện tại
  const manager = await Manager.findOne({ accountId: req.user.id });
  if (!manager) {
    return res.status(404).json({ message: "Manager profile not found" });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Tạo Account cho Employee
  const acc = await Account.create({ email, password: hash, role: "EMPLOYEE" });

  // Tạo Employee profile
  const employee = await Employee.create({
    name,
    email,
    phone,
    department: department || manager.department,
    managerId: manager._id,
    accountId: acc._id
  });

  res.status(201).json({ account: { id: acc._id, email: acc.email, role: acc.role }, employee });
};

// Yêu cầu 14: Manager xem tất cả đơn đặt cọc
export const getAllDepositOrders = async (req, res) => {
  const orders = await DepositOrder.find()
    .populate("customerId", "name email phone")
    .populate({
      path: "propertyId",
      populate: { path: "employeeId", select: "name email phone" }
    })
    .lean();

  res.json(orders);
};

// Yêu cầu 15: Manager lấy thông tin tất cả nhân viên dưới quyền
export const getMyEmployees = async (req, res) => {
  // Tìm Manager profile
  const manager = await Manager.findOne({ accountId: req.user.id });
  if (!manager) {
    return res.status(404).json({ message: "Manager profile not found" });
  }

  // Lấy tất cả Employee thuộc Manager này
  const employees = await Employee.find({ managerId: manager._id })
    .populate("accountId", "email isActive")
    .lean();

  res.json(employees);
};

