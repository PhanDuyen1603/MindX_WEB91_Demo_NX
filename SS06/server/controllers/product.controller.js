import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Câu 05: Lọc danh sách sản phẩm theo khoảng giá
export const getProducts = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    
    // Xây dựng filter dựa trên query parameters
    const filter = {};
    
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(filter);
    res.json(products);
});
