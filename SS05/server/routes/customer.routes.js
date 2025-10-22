// server/routes/customer.routes.js
import { Router } from "express";
import { getAllCustomers, getCustomerById, getOrdersOfCustomer } from "../controllers/customer.controller.js";
import { requireFields } from "../middlewares/requireFields.js";

const r = Router();
r.get("/", getAllCustomers);                         // (1)
r.get("/:id", getCustomerById);                      // (2)
r.get("/:customerId/orders", getOrdersOfCustomer);   // (3)
export default r;
