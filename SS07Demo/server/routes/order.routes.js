import { Router } from "express";
import { requireApiKey } from "../middlewares/apikey.js";
import { 
    getOrders, 
    createOrder, 
    updateOrder 
} from "../controllers/order.controller.js";

const r = Router();

// GET /orders - Lấy danh sách đơn hàng (có thể lọc theo totalPrice_gt)
r.get("/", requireApiKey, getOrders);

// POST /orders - Tạo mới đơn hàng
r.post("/", requireApiKey, createOrder);

// PUT /orders/:orderId - Cập nhật số lượng sản phẩm trong đơn hàng
r.put("/:orderId", requireApiKey, updateOrder);

export default r;
