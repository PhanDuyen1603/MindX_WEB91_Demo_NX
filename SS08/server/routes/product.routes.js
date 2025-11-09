import { Router } from "express";
import { requireApiKey } from "../middlewares/apikey.js";
import { getProducts } from "../controllers/product.controller.js";

const r = Router();

// GET /products - Lấy danh sách sản phẩm (có thể lọc theo minPrice, maxPrice)
r.get("/", requireApiKey, getProducts);

export default r;