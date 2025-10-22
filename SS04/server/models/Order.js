import mongoose from "mongoose";

const schema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  quantity: Number,
  totalPrice: Number,
}, { timestamps: true });

export default mongoose.model("orders", schema);
