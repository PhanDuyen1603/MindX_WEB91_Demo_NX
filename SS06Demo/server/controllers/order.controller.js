import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Câu 04: Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
export const getOrders = asyncHandler(async (req, res) => {
    const { totalPrice_gt } = req.query;
    
    // Nếu có query parameter totalPrice_gt, lọc theo điều kiện
    const filter = totalPrice_gt ? { totalPrice: { $gt: Number(totalPrice_gt) } } : {};
    
    const orders = await Order.find(filter);
    res.json(orders);
});

// Câu 07: Tạo mới đơn hàng
export const createOrder = asyncHandler(async (req, res) => {
    const { customerId, productId, quantity } = req.body;
    
    // Validate input
    if (!customerId || !productId || !quantity) {
        return res.status(400).json({ message: "customerId, productId, and quantity are required" });
    }
    
    if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    // Kiểm tra customer có tồn tại không (tìm theo field id)
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    
    // Kiểm tra product có tồn tại không (tìm theo field id)
    const product = await Product.findOne({ id: productId });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    // Kiểm tra số lượng sản phẩm còn đủ không
    if (quantity > product.quantity) {
        return res.status(400).json({ 
            message: `Insufficient product quantity. Available: ${product.quantity}` 
        });
    }
    
    // Tính totalPrice
    const totalPrice = product.price * quantity;
    
    // Tạo order mới
    const newOrder = new Order({
        customerId,
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice
    });
    
    await newOrder.save();
    
    // Giảm số lượng sản phẩm
    product.quantity -= quantity;
    await product.save();
    
    res.status(201).json(newOrder);
});

// Câu 08: PUT - Cập nhật số lượng sản phẩm trong đơn hàng
export const updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { quantity } = req.body;
    
    // Validate input
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    // Tìm order theo field id
    const order = await Order.findOne({ id: orderId });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    
    // Tìm product theo field id
    const product = await Product.findOne({ id: order.productId });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    // Tính chênh lệch số lượng
    const quantityDiff = quantity - order.quantity;
    
    // Kiểm tra xem có đủ sản phẩm để tăng số lượng không
    if (quantityDiff > 0 && quantityDiff > product.quantity) {
        return res.status(400).json({ 
            message: `Insufficient product quantity. Available: ${product.quantity}` 
        });
    }
    
    // Cập nhật số lượng sản phẩm
    product.quantity -= quantityDiff;
    await product.save();
    
    // Cập nhật order
    order.quantity = quantity;
    order.totalPrice = (order.unitPrice || product.price) * quantity;
    await order.save();
    
    res.json(order);
});
