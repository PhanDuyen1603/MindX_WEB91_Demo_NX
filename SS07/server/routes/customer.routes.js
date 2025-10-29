import { Router } from "express";
import { requireApiKey } from "../middlewares/apikey.js";

import { 
    getAllCustomers, 
    getCustomerById, 
    getCustomerOrders, 
    createCustomer, 
    deleteCustomer, 
    getApiKey 
} from "../controllers/customer.controller.js";

const r = Router();

// (0) PUBLIC: cấp API key
r.get("/getApikey/:id", getApiKey);

// GET /customers - Lấy tất cả khách hàng
r.get("/", requireApiKey, getAllCustomers);

// GET /customers/:id - Lấy thông tin chi tiết của một khách hàng
r.get("/:id", requireApiKey, getCustomerById);

// GET /customers/:customerId/orders - Lấy danh sách đơn hàng của một khách hàng
r.get("/:customerId/orders",requireApiKey, getCustomerOrders);

// POST /customers - Thêm mới khách hàng
r.post("/", requireApiKey, createCustomer);

// DELETE /customers/:id - Xóa khách hàng
r.delete("/:id", requireApiKey, deleteCustomer);

export default r;
