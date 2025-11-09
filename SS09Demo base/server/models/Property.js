// models/Property.js
import mongoose from "mongoose";


const schema = new mongoose.Schema({
  address: { type: String, required: true },
  // Decimal128 để lưu tiền tệ chính xác (tránh sai số float)
  price:   { type: mongoose.Schema.Types.Decimal128, required: true },
  area:    { type: Number, required: true },
  status:  { type: String, enum: ["ON_SALE","SOLD","PAUSED"], default: "ON_SALE", index: true },
  // 1-n: Employee phụ trách nhiều Property
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
}, { timestamps: true });

export default mongoose.model("Property", schema);
