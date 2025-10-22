// server/routes/order.routes.js
import { Router } from "express";
import { getHighValueOrders, createOrder, updateOrderQuantity } from "../controllers/order.controller.js";
import { requireFields } from "../middlewares/requireFields.js";

const r = Router();
r.get("/highvalue", getHighValueOrders); // (4)
r.post("/", requireFields(["customerId","productId","quantity"]), createOrder); // (7)
r.put("/:orderId", requireFields(["quantity"]), updateOrderQuantity); // (8)
export default r;
