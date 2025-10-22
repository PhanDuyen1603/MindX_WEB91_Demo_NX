import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    id: String,
    customerId: { type: String, required: true },
    productId:  { type: String, required: true },
    quantity:   { type: Number, required: true, min: 1 },
    unitPrice:  { type: Number },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);
export default mongoose.model("orders", schema);
