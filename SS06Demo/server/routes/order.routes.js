import { Router } from "express";
import { 
    getOrders, 
    createOrder, 
    updateOrder 
} from "../controllers/order.controller.js";

const r = Router();

// GET /orders - Lấy danh sách đơn hàng (có thể lọc theo totalPrice_gt)
r.get("/", getOrders);

// POST /orders - Tạo mới đơn hàng
r.post("/", createOrder);

// PUT /orders/:orderId - Cập nhật số lượng sản phẩm trong đơn hàng
r.put("/:orderId", updateOrder);

export default r;