// models/Employee.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  // 1-n: Manager quản lý nhiều Employee
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true, index: true },
  // 1-1: Employee gắn 1 Account
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true, required: true }
}, { timestamps: true });

export default mongoose.model("Employee", schema);
