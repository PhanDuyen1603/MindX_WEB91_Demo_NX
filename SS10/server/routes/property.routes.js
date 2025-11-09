// routes/property.routes.js
// 👉 Routes về Property (nhà ở)
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { allow } from "../middlewares/roles.js";
import { uploadPropertyImages } from "../middlewares/upload.js";
import {
  createProperty,
  updateProperty,
  getMyProperties
} from "../controllers/property.controller.js";

const router = Router();
router.post("/",
  auth, allow("MANAGER","EMPLOYEE"),                 // RBAC như SS09
  uploadPropertyImages.array("images", 10),          // nhận nhiều ảnh từ field "images"
  createProperty
);

// Yêu cầu 8: Manager/Employee tạo Property
router.post("/", auth, allow("MANAGER", "EMPLOYEE"), createProperty);

// Yêu cầu 9: Manager/Employee cập nhật Property
router.put("/:id", auth, allow("MANAGER", "EMPLOYEE"), updateProperty);

// Yêu cầu 13: Employee xem danh sách nhà ở đang quản lý
router.get("/my-properties", auth, allow("EMPLOYEE"), getMyProperties);

export default router;

