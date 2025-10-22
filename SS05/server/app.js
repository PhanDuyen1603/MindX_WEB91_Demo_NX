import express from "express";        
import mongoose from "mongoose";
import dotenv from "dotenv" 
import { errorHandler } from "./middlewares/errorHandler.js";

// server/app.js
import customerRoutes from "./routes/customer.routes.js";
import productRoutes  from "./routes/product.routes.js";
import orderRoutes    from "./routes/order.routes.js";


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mindx-fullstack";

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000 // fail nhanh sau 5s
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

 export const app = express();
app.use(express.json()); // Middleware để parse JSON body  

app.get ("/", (req, res) => {
    res.send("Server & MongoDB are ready!");
})

// ... giữ nguyên phần trên
app.use("/customers", customerRoutes);
app.use("/products",  productRoutes);
app.use("/orders",    orderRoutes);
app.use(errorHandler); 