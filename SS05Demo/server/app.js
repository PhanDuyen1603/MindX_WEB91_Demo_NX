import express from "express";        
import mongoose from "mongoose";
import dotenv from "dotenv" 
import customerRoutes from "./routes/customer.routes.js"
import orderRoutes from "./routes/order.routes.js"
import productRoutes from "./routes/product.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

export const app = express();
app.use(express.json()); // Middleware để parse JSON body

app.get ("/", (req, res) => {
    res.send("Server & MongoDB are ready!");
})

mongoose
    .connect(MONGODB_URI)
    .then(() =>console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connecton error:", err));

app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use(errorHandler);
