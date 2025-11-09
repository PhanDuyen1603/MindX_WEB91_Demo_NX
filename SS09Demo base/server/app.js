// app.js
// 👉 Nơi cấu hình Express: middleware, CORS, logger và route cơ bản
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import meRouter from "./routes/me.routes.js";
import adminRouter from "./routes/admin.routes.js";
import propertyRouter from "./routes/property.routes.js";
import depositRouter from "./routes/deposit.routes.js";
import path from "path";

const app = express();

app.use(cors());           // Cho phép frontend khác origin gọi API
app.use(express.json());   // Parse JSON body
app.use(morgan("dev"));    // Log HTTP gọn gàng khi dev


// Health-check: giúp test nhanh server đã chạy
app.get("/", (req, res) => {
  res.json({ message: "Lesson 9 API ready" });
});
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/me", meRouter);
app.use("/admin", adminRouter);
app.use("/properties", propertyRouter);
app.use("/deposits", depositRouter);

export default app;
