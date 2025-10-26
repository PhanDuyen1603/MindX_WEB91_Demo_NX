import mongoose from "mongoose";
const schema = new mongoose.Schema(
  { 
    id: String,
    name: String, 
    email: { type: String, unique: true }, 
    age: Number,
    apiKeyRand: String,
  },
  { timestamps: true }
);
export default mongoose.model("customers", schema);
