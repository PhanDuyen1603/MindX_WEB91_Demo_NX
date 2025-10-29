import express from "express";        
import mongoose from "mongoose";
import dotenv from "dotenv" 
import customerRoutes from "./routes/customer.routes.js"
import orderRoutes from "./routes/order.routes.js"
import productRoutes from "./routes/product.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

export const app = express();
app.use(express.json()); // Middleware để parse JSON body

app.get ("/", (req, res) => {
    res.send("Server & MongoDB are ready!");
})

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() =>console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connecton error:", err));

app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use(errorHandler);
