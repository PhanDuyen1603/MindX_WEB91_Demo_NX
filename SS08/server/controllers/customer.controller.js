import Customer from "../models/Customer.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// (0) GET /customers/getApikey/:id
export const getApiKey = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // 1) Tìm theo id (string "c1" ...), KHÔNG phải _id
  const customer = await Customer.findOne({ id });
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  // 2) Nếu chưa có rand thì sinh mới và lưu vào DB
  if (!customer.apiKeyRand) {
    customer.apiKeyRand = crypto.randomBytes(6).toString("hex"); // 12 ký tự hex
    await customer.save();
  }

  // 3) Lắp key theo format đề bài
  const apiKey = `web-$${customer.id}$-$${customer.email}$-$${customer.apiKeyRand}$`;
  res.json({ apiKey });
});

// Câu 01: Lấy tất cả khách hàng
export const getAllCustomers = asyncHandler(async (_req, res) => {
    const customers = await Customer.find().lean();
    res.json(customers);
});

// Câu 02: Lấy thông tin chi tiết của một khách hàng
export const getCustomerById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const customer = await Customer.findOne({ id });

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
});

// Câu 03: Lấy danh sách đơn hàng của một khách hàng cụ thể
export const getCustomerOrders = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    
    // Kiểm tra customer có tồn tại không
    const customer = await Customer.findOne({ id: customerId });
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    
    // Tìm orders dựa trên customerId
    const orders = await Order.find({ customerId });
    res.json(orders);
});

// Câu 06: Thêm mới khách hàng
export const createCustomer = asyncHandler(async (req, res) => {
    const { name, email, age } = req.body;
    
    // Validate input
    if (!name || !email || !age) {
        return res.status(400).json({ message: "Name, email, and age are required" });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
        return res.status(400).json({ message: "Email already exists" });
    }
    
    // Tạo customer mới
    const newCustomer = new Customer({ name, email, age });
    await newCustomer.save();
    
    res.status(201).json(newCustomer);
});

// Câu 09: Xóa khách hàng
export const deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Tìm và xóa customer theo field id
    const deletedCustomer = await Customer.findOneAndDelete({ id });
    
    if (!deletedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json({ 
        message: "Customer deleted successfully",
        customer: deletedCustomer
    });
});