// server/index.js
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import Customer from "./models/Customer.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

const app = express();
app.use(express.json());

// Kết nối DB
const uri = process.env.MONGODB_URI;
await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
console.log("✅ MongoDB connected");

// 1) GET /customers — toàn bộ KH
app.get("/customers", async (_req, res) => {
  res.json(await Customer.find());
});

// 2) GET /customers/:id — chi tiết KH
app.get("/customers/:id", async (req, res) => {
  const c = await Customer.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Customer not found" });
  res.json(c);
});

// 3) GET /customers/:customerId/orders — đơn hàng của KH
app.get("/customers/:customerId/orders", async (req, res) => {
  const orders = await Order.find({ customerId: req.params.customerId })
    .populate("productId", "name price");
  res.json(orders);
});

// 4) GET /products?minPrice&maxPrice — lọc theo khoảng giá
app.get("/products", async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  const q = {};
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  res.json(await Product.find(q));
});

// 5) POST /customers — tạo KH (email unique)
app.post("/customers", async (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) return res.status(400).json({ message: "name & email required" });
  const existed = await Customer.findOne({ email });
  if (existed) return res.status(409).json({ message: "Email already exists" });
  const created = await Customer.create({ name, email, age });
  res.status(201).json(created);
});

// 6) POST /orders — tạo đơn, tính totalPrice, trừ tồn kho
app.post("/orders", async (req, res) => {
  const { customerId, productId, quantity } = req.body;
  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ message: "customerId, productId, quantity required" });
  }
  const [c, p] = await Promise.all([
    Customer.findById(customerId),
    Product.findById(productId),
  ]);
  if (!c) return res.status(404).json({ message: "Customer not found" });
  if (!p) return res.status(404).json({ message: "Product not found" });
  if (quantity <= 0) return res.status(400).json({ message: "quantity > 0" });
  if (quantity > p.quantity) return res.status(400).json({ message: "Not enough stock" });

  const totalPrice = p.price * quantity;
  const order = await Order.create({ customerId, productId, quantity, totalPrice });
  // trừ tồn kho
  p.quantity -= quantity;
  await p.save();

  res.status(201).json(order);
});

// 7) PUT /orders/:id — cập nhật quantity, tính lại totalPrice, cân bằng tồn kho
app.put("/orders/:id", async (req, res) => {
  const { quantity } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!quantity || quantity <= 0) return res.status(400).json({ message: "quantity > 0" });

  const product = await Product.findById(order.productId);
  const diff = quantity - order.quantity; // số lượng tăng/thay đổi
  if (diff > 0 && diff > product.quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  product.quantity -= diff; // trả/nhận lại kho
  await product.save();

  order.quantity = quantity;
  order.totalPrice = product.price * quantity;
  await order.save();

  res.json(order);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 API ready on http://localhost:${PORT}`));
