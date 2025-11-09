import { Router} from "express";
import { requireApiKey } from "../middlewares/apikey.js";
import { getMyOrders } from "../controllers/user.controller.js";

const r = Router();
r.get("/:id/orders", requireApiKey, getMyOrders);

export default r;