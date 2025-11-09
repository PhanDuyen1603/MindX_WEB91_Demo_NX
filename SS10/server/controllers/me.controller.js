// controllers/me.controller.js
// 👉 Trả về { account, profile } theo role của account hiện tại
import Account from "../models/Account.js";
import Customer from "../models/Customer.js";
import Manager from "../models/Manager.js";
import Employee from "../models/Employee.js";

export const getMe = async (req, res) => {
  const acc = await Account.findById(req.user.id).lean();
  if (!acc) return res.status(404).json({ message: "Account not found" });

  if (acc.role === "CUSTOMER") {
    const profile = await Customer.findOne({ accountId: acc._id }).lean();
    return res.json({ account: acc, profile });
  }
  if (acc.role === "MANAGER") {
    const profile = await Manager.findOne({ accountId: acc._id }).lean();
    return res.json({ account: acc, profile });
  }
  if (acc.role === "EMPLOYEE") {
    const profile = await Employee.findOne({ accountId: acc._id }).lean();
    return res.json({ account: acc, profile });
  }
};
