// routes/admin.routes.js
// 👉 Routes dành cho MANAGER
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import {
  createEmployee,
  getAllDepositOrders,
  getMyEmployees
} from "../controllers/admin.controller.js";

const router = Router();

// Yêu cầu 7: Manager tạo tài khoản + thông tin cho Employee
router.post("/employees", auth, allow("MANAGER"), createEmployee);

// Yêu cầu 14: Manager xem tất cả đơn đặt cọc
router.get("/deposit-orders", auth, allow("MANAGER"), getAllDepositOrders);

// Yêu cầu 15: Manager lấy thông tin tất cả nhân viên dưới quyền
router.get("/my-employees", auth, allow("MANAGER"), getMyEmployees);

export default router;

