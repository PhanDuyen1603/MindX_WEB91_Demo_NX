// models/DepositOrder.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // 1-n: Customer có nhiều Deposit
  customerId:    { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  // 1-n: Property có nhiều Deposit (từng khách đặt cọc)
  propertyId:    { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
  depositAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
  date:          { type: Date, default: Date.now },
  status:        { type: String, enum: ["PAID","PENDING","CANCELLED"], default: "PENDING", index: true }
}, { timestamps: true });

export default mongoose.model("DepositOrder", schema);
