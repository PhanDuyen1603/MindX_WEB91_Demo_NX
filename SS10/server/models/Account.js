// models/Account.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true }, // unique: email duy nhất
  password: { type: String, required: true },                         // hash bcrypt
  isActive: { type: Boolean, default: true },                         // chặn login nếu false
  role: {
    type: String,
    enum: ["MANAGER","CUSTOMER","EMPLOYEE"],
    default: "CUSTOMER",
    index: true
  }
}, { timestamps: true });

export default mongoose.model("Account", schema);
