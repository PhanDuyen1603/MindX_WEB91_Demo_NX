import { Router } from "express";
import { filterProductsByPrice } from "../controllers/product.controller.js";

const r = Router();

r.get("/", filterProductsByPrice); 

export default r;