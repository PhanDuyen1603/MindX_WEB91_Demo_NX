import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";

const r = Router();

// GET /products - Lấy danh sách sản phẩm (có thể lọc theo minPrice, maxPrice)
r.get("/", getProducts);

export default r;