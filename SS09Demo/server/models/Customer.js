// models/Customer.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  // 1-1: mỗi Customer ứng với đúng 1 Account
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true, required: true }
}, { timestamps: true });

export default mongoose.model("Customer", schema);
