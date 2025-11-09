// routes/profile.routes.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createProfile } from "../controllers/profile.controller.js";

const router = Router();
router.post("/", auth, createProfile);

export default router;
