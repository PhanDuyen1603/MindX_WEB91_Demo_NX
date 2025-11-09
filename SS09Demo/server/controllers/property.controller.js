// controllers/property.controller.js
// 👉 Các API về Property (nhà ở)
import Property from "../models/Property.js";
import Employee from "../models/Employee.js";

// Helper: convert Multer files -> mảng metadata ảnh để lưu DB
const toImageDocs = (files) => (files || []).map(f => ({
  originalName: f.originalname,
  filename: f.filename,
  url: `/uploads/properties/${f.filename}`, // FE dùng URL này để hiển thị
  size: f.size,
  mimetype: f.mimetype
}));

// Yêu cầu 8: Manager/Employee tạo Property
export const createProperty = async (req, res) => {
  const { address, price, area, status, employeeId } = req.body;

  // Validate
  if (!address || !price || !area) {
    return res.status(400).json({ message: "address, price, area are required" });
  }

  let finalEmployeeId = employeeId;

  // Nếu là Employee tự tạo, gán employeeId = chính họ
  if (req.user.role === "EMPLOYEE") {
    const emp = await Employee.findOne({ accountId: req.user.id });
    if (!emp) {
      return res.status(404).json({ message: "Employee profile not found" });
    }
    finalEmployeeId = emp._id;
  } else if (req.user.role === "MANAGER") {
    // Manager phải chỉ định employeeId
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required for Manager" });
    }
  }

    const images = toImageDocs(req.files);

  // Tạo Property
  const property = await Property.create({
    address,
    price,
    area,
    status: status || "ON_SALE",
    employeeId: finalEmployeeId,
    images  
  });

  res.status(201).json(property);
};

// Yêu cầu 9: Manager/Employee cập nhật Property
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Tìm Property
  const property = await Property.findById(id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  // Nếu là Employee, chỉ được update Property của mình
  if (req.user.role === "EMPLOYEE") {
    const emp = await Employee.findOne({ accountId: req.user.id });
    if (!emp || !property.employeeId.equals(emp._id)) {
      return res.status(403).json({ message: "You can only update your own properties" });
    }
  }

  // Cập nhật
  Object.assign(property, updates);
  await property.save();

  res.json(property);
};

// Yêu cầu 13: Employee xem danh sách nhà ở đang quản lý
export const getMyProperties = async (req, res) => {
  // Lấy Employee profile
  const emp = await Employee.findOne({ accountId: req.user.id });
  if (!emp) {
    return res.status(404).json({ message: "Employee profile not found" });
  }

  // Lấy tất cả Property của Employee này
  const properties = await Property.find({ employeeId: emp._id }).lean();

  res.json(properties);
};

