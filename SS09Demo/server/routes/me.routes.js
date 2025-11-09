// routes/me.routes.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { getMe } from "../controllers/me.controller.js";

const router = Router();
router.get("/", auth, getMe);

export default router;
