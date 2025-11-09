// controllers/deposit.controller.js
// 👉 Các API về DepositOrder (đơn đặt cọc)
import DepositOrder from "../models/DepositOrder.js";
import Customer from "../models/Customer.js";
import Property from "../models/Property.js";

// Yêu cầu 10: Customer tạo đơn đặt cọc
export const createDepositOrder = async (req, res) => {
  const { propertyId, depositAmount } = req.body;

  // Validate
  if (!propertyId || !depositAmount) {
    return res.status(400).json({ message: "propertyId and depositAmount are required" });
  }

  // Tìm Customer profile
  const customer = await Customer.findOne({ accountId: req.user.id });
  if (!customer) {
    return res.status(404).json({ message: "Customer profile not found. Please create profile first." });
  }

  // Kiểm tra Property tồn tại và đang bán
  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  if (property.status !== "ON_SALE") {
    return res.status(400).json({ message: "Property is not available for sale" });
  }

  // Tạo đơn đặt cọc
  const order = await DepositOrder.create({
    customerId: customer._id,
    propertyId,
    depositAmount,
    status: "PENDING"
  });

  res.status(201).json(order);
};

// Yêu cầu 11: Manager/Employee lấy thông tin đơn đặt cọc + thông tin khách hàng
export const getDepositOrders = async (req, res) => {
  const orders = await DepositOrder.find()
    .populate("customerId", "name email phone")
    .populate("propertyId", "address price area status")
    .lean();

  res.json(orders);
};

// Yêu cầu 12: Customer xem đơn đặt cọc của mình + Property + Employee info
export const getMyDepositOrders = async (req, res) => {
  // Tìm Customer profile
  const customer = await Customer.findOne({ accountId: req.user.id });
  if (!customer) {
    return res.status(404).json({ message: "Customer profile not found" });
  }

  // Lấy tất cả đơn đặt cọc của Customer
  const orders = await DepositOrder.find({ customerId: customer._id })
    .populate("propertyId", "address price area status")
    .populate({
      path: "propertyId",
      populate: {
        path: "employeeId",
        select: "name email phone"
      }
    })
    .lean();

  res.json(orders);
};

