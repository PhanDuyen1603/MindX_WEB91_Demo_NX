# HƯỚNG DẪN TEST BÀI THỰC HÀNH LESSON 9

## Danh sách API đã hoàn thành

### ✅ Authentication (Auth)
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập (kiểm tra isActive)

### ✅ Profile
- `POST /profile` - Tạo thông tin cá nhân theo role (yêu cầu 6)
- `GET /me` - Lấy thông tin cá nhân theo role (yêu cầu 5)

### ✅ Admin (Manager)
- `POST /admin/employees` - Manager tạo tài khoản + thông tin cho Employee (yêu cầu 7)
- `GET /admin/deposit-orders` - Manager xem tất cả đơn đặt cọc (yêu cầu 14)
- `GET /admin/my-employees` - Manager lấy thông tin nhân viên dưới quyền (yêu cầu 15)

### ✅ Property (Nhà ở)
- `POST /properties` - Manager/Employee tạo Property (yêu cầu 8)
- `PUT /properties/:id` - Manager/Employee cập nhật Property (yêu cầu 9)
- `GET /properties/my-properties` - Employee xem nhà ở đang quản lý (yêu cầu 13)

### ✅ Deposit (Đơn đặt cọc)
- `POST /deposits` - Customer tạo đơn đặt cọc (yêu cầu 10)
- `GET /deposits` - Manager/Employee lấy thông tin đơn đặt cọc (yêu cầu 11)
- `GET /deposits/my-orders` - Customer xem đơn đặt cọc của mình (yêu cầu 12)

---

## FLOW TEST CHI TIẾT

### Bước 1: Đăng ký tài khoản Manager
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "manager@test.com",
  "password": "123456",
  "role": "MANAGER"
}
```

**Response mong đợi:**
```json
{
  "id": "...",
  "email": "manager@test.com",
  "role": "MANAGER"
}
```

### Bước 2: Đăng nhập Manager
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "manager@test.com",
  "password": "123456"
}
```

**Response mong đợi:**
```json
{
  "token": "eyJhbGc...",
  "role": "MANAGER"
}
```

**Lưu token này để dùng cho các bước tiếp theo!**

### Bước 3: Manager tạo profile
```bash
POST http://localhost:3001/profile
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "manager@test.com",
  "phone": "0901234567",
  "department": "Sales"
}
```

### Bước 4: Manager tạo Employee
```bash
POST http://localhost:3001/admin/employees
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json

{
  "email": "employee1@test.com",
  "password": "123456",
  "name": "Nhân viên 1",
  "phone": "0912345678",
  "department": "Sales"
}
```

### Bước 5: Đăng nhập Employee
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "employee1@test.com",
  "password": "123456"
}
```

**Lưu EMPLOYEE_TOKEN**

### Bước 6: Employee tạo Property
```bash
POST http://localhost:3001/properties
Authorization: Bearer <EMPLOYEE_TOKEN>
Content-Type: application/json

{
  "address": "123 Nguyễn Huệ, Q1, HCM",
  "price": 5000000000,
  "area": 100,
  "status": "ON_SALE"
}
```

### Bước 7: Manager cập nhật Property
```bash
PUT http://localhost:3001/properties/<PROPERTY_ID>
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json

{
  "price": 5500000000,
  "status": "ON_SALE"
}
```

### Bước 8: Đăng ký Customer
```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "customer1@test.com",
  "password": "123456",
  "role": "CUSTOMER"
}
```

### Bước 9: Đăng nhập Customer
```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "customer1@test.com",
  "password": "123456"
}
```

**Lưu CUSTOMER_TOKEN**

### Bước 10: Customer tạo profile
```bash
POST http://localhost:3001/profile
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json

{
  "name": "Khách hàng 1",
  "email": "customer1@test.com",
  "phone": "0923456789",
  "address": "456 Lê Lợi, Q1, HCM"
}
```

### Bước 11: Customer tạo đơn đặt cọc
```bash
POST http://localhost:3001/deposits
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json

{
  "propertyId": "<PROPERTY_ID>",
  "depositAmount": 500000000
}
```

### Bước 12: Customer xem đơn đặt cọc của mình (bao gồm Property + Employee)
```bash
GET http://localhost:3001/deposits/my-orders
Authorization: Bearer <CUSTOMER_TOKEN>
```

### Bước 13: Employee xem danh sách nhà ở đang quản lý
```bash
GET http://localhost:3001/properties/my-properties
Authorization: Bearer <EMPLOYEE_TOKEN>
```

### Bước 14: Manager/Employee xem tất cả đơn đặt cọc + thông tin khách hàng
```bash
GET http://localhost:3001/deposits
Authorization: Bearer <MANAGER_TOKEN hoặc EMPLOYEE_TOKEN>
```

### Bước 15: Manager xem tất cả đơn đặt cọc (API riêng cho Manager)
```bash
GET http://localhost:3001/admin/deposit-orders
Authorization: Bearer <MANAGER_TOKEN>
```

### Bước 16: Manager xem tất cả nhân viên dưới quyền
```bash
GET http://localhost:3001/admin/my-employees
Authorization: Bearer <MANAGER_TOKEN>
```

### Bước 17: Lấy thông tin cá nhân (bất kỳ role nào)
```bash
GET http://localhost:3001/me
Authorization: Bearer <TOKEN>
```

---

## Các trường hợp lỗi cần test

### 1. Đăng nhập với isActive = false
```bash
# Cần tạo account và update isActive = false trong MongoDB
# Sau đó login sẽ nhận 403 Forbidden
```

### 2. Truy cập API không đúng role
```bash
# Customer cố gắng tạo Employee
POST http://localhost:3001/admin/employees
Authorization: Bearer <CUSTOMER_TOKEN>
# Sẽ nhận 403 Forbidden
```

### 3. Tạo đơn đặt cọc cho Property không tồn tại
```bash
POST http://localhost:3001/deposits
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json

{
  "propertyId": "invalid_id",
  "depositAmount": 500000000
}
# Sẽ nhận 404 Not Found
```

### 4. Employee cập nhật Property không phải của mình
```bash
# Employee 2 cố gắng update Property của Employee 1
# Sẽ nhận 403 Forbidden
```

---

Server đang chạy tại: **http://localhost:3001**

