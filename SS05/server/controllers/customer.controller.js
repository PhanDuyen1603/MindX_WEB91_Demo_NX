import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asynHandler.js";


// 1) GET /customers
export const getAllCustomers = asyncHandler(async (_req, res) => {
  const customers = await Customer.find().lean();
  res.json(customers);
});

// 2) GET /customers/:id
export const getCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;                          // ví dụ "c001"
  const customer = await Customer.findOne({ id }).lean(); // KHÔNG dùng findById
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
});

// 3) GET /customers/:customerId/orders
export const getOrdersOfCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const orders = await Order.find({ customerId }).lean();
  res.json(orders); // nếu không có -> []
});