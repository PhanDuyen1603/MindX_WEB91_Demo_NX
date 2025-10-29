import { Router } from "express";
import { register, login } from "../controllers/auth.controllers.js";

const r = Router();

// POST /auth/register
r.post("/register", register);

// POST /auth/login
r.post("/login", login);

export default r;