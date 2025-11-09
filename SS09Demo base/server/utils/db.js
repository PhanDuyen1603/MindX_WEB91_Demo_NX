// utils/db.js
// 👉 Gom logic kết nối MongoDB vào 1 file giúp tái sử dụng & test riêng
import mongoose from "mongoose";

export const connectDB = async (uri) => {
  // autoIndex giúp Mongoose tạo index khi dev (chấp nhận overhead nhỏ)
  await mongoose.connect(uri, { autoIndex: true });
  console.log("✅ Mongo connected:", uri);
};
