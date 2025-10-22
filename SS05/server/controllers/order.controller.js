// server/controllers/order.controller.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asynHandler.js";

// 4) GET /orders/highvalue
export const getHighValueOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({ totalPrice: { $gt: 10_000_000 } }).lean();
  res.json(orders);
});

// 7) POST /orders
export const createOrder = asyncHandler(async (req, res) => {
  const { id, customerId, productId, quantity } = req.body;
  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ message: "customerId, productId, quantity are required" });
  }
  if (quantity <= 0) return res.status(400).json({ message: "Quantity must be > 0" });

  const product = await Product.findOne({ id: productId }); // tìm theo id String
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (quantity > product.quantity) {
    return res.status(400).json({ message: `Insufficient stock. Available: ${product.quantity}` });
  }

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const order = await Order.create({
    id, customerId, productId, quantity, unitPrice, totalPrice
  });

  product.quantity -= quantity;
  await product.save();

  res.status(201).json(order);
});

// 8) PUT /orders/:orderId
export const updateOrderQuantity = asyncHandler(async (req, res) => {
  const { orderId } = req.params; // id String của Order (o001...), không phải _id
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) return res.status(400).json({ message: "Quantity must be > 0" });

  const order = await Order.findOne({ id: orderId });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const product = await Product.findOne({ id: order.productId });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const diff = quantity - order.quantity; // +: tăng, -: giảm

  if (diff > 0 && diff > product.quantity) {
    return res.status(400).json({ message: `Insufficient stock. Available: ${product.quantity}` });
  }

  if (diff > 0) product.quantity -= diff;
  if (diff < 0) product.quantity += Math.abs(diff);

  order.quantity = quantity;
  order.totalPrice = (order.unitPrice ?? product.price) * quantity;

  await Promise.all([order.save(), product.save()]);
  res.json(order);
});
