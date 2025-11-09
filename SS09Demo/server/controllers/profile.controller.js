// controllers/profile.controller.js
// 👉 Tạo hồ sơ gắn với account hiện tại theo role
import Account from "../models/Account.js";
import Customer from "../models/Customer.js";
import Manager from "../models/Manager.js";
import Employee from "../models/Employee.js";

export const createProfile = async (req, res) => {
  const acc = await Account.findById(req.user.id);
  if (!acc) return res.status(404).json({ message: "Account not found" });

  try {
    if (acc.role === "CUSTOMER") {
      const created = await Customer.create({ ...req.body, accountId: acc._id });
      return res.status(201).json(created);
    }
    if (acc.role === "MANAGER") {
      const created = await Manager.create({ ...req.body, accountId: acc._id });
      return res.status(201).json(created);
    }
    if (acc.role === "EMPLOYEE") {
      // Employee bắt buộc có managerId (quan hệ 1-n Manager–Employee)
      if (!req.body.managerId) return res.status(400).json({ message: "managerId required for employee" });
      const created = await Employee.create({ ...req.body, accountId: acc._id });
      return res.status(201).json(created);
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
