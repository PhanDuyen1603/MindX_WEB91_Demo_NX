import { Router} from "express";
const r = Router();
import { getAllCustomers} from "../controllers/customer.controller.js";

r.get("/", getAllCustomers)
r.get("/:id", (_req, res)=> res.send("Customer by id ready!"))
r.get("/:customerId/orders", (_req, res)=> res.send("Customer orders!"))

export default r;