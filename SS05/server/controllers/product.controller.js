// server/controllers/product.controller.js
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asynHandler.js";

// 5) GET /products?minPrice=&maxPrice=
export const filterProductsByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  // theo đề: thiếu 1 trong 2 -> trả ALL
  if (!minPrice || !maxPrice) {
    const all = await Product.find().lean();
    return res.json(all);
  }
  const min = Number(minPrice), max = Number(maxPrice);
  if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
    return res.status(400).json({ message: "Invalid minPrice/maxPrice" });
  }
  const products = await Product.find({ price: { $gte: min, $lte: max } }).lean();
  res.json(products);
});
