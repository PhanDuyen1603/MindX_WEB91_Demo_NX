// server/models/Customer.js
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
}, { timestamps: true });
export default mongoose.model("customers", schema);
