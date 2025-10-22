import mongoose from "mongoose";
const schema = new mongoose.Schema(
  { name: String, price: Number, quantity: Number },
  { timestamps: true }
);
export default mongoose.model("products", schema);
