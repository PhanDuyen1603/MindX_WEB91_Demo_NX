// models/Manager.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", unique: true, required: true }
}, { timestamps: true });

export default mongoose.model("Manager", schema);
