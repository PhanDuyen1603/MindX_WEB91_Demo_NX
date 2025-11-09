// routes/deposit.routes.js
// 👉 Routes về DepositOrder (đơn đặt cọc)
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import {
  createDepositOrder,
  getDepositOrders,
  getMyDepositOrders
} from "../controllers/deposit.controller.js";

const router = Router();

// Yêu cầu 10: Customer tạo đơn đặt cọc
router.post("/", auth, allow("CUSTOMER"), createDepositOrder);

// Yêu cầu 11: Manager/Employee lấy thông tin đơn đặt cọc + thông tin khách hàng
router.get("/", auth, allow("MANAGER", "EMPLOYEE"), getDepositOrders);

// Yêu cầu 12: Customer xem đơn đặt cọc của mình
router.get("/my-orders", auth, allow("CUSTOMER"), getMyDepositOrders);

export default router;

