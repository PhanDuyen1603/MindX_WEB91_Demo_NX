// index.js
import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// JSON Server chạy ở cổng 3000
const JSON_SERVER = "http://localhost:3000";
// Express chạy ở cổng 3001
const PORT = 3001;

// ----------- ROUTES ------------

// Test route (Hello World)
app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello MindX-er 🚀" });
});

// ========== USERS DEMO (ví dụ trong lý thuyết) ==========

// Lấy danh sách users từ JSON Server
app.get("/users", async (req, res) => {
  try {
    const users = await axios.get(`${JSON_SERVER}/users`);
    res.status(200).send({
      data: users.data,
      message: "Users list retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Thêm user mới
app.post("/users", async (req, res) => {
  try {
    const { id, userName } = req.body;

    if (!id) throw new Error("Id is required");
    if (!userName) throw new Error("UserName is required");

    const newUser = { id, userName };
    const response = await axios.post(`${JSON_SERVER}/users`, newUser);

    res.status(201).send({
      data: response.data,
      message: "User created successfully ✅",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// ========== CUSTOMERS DEMO (phần thực hành chính) ==========

// 1. Lấy toàn bộ danh sách khách hàng
app.get("/customers", async (req, res) => {
  try {
    const customers = await axios.get(`${JSON_SERVER}/customers`);
    res.status(200).send({
      data: customers.data,
      message: "Customers list retrieved successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving customers",
      error: error.message,
    });
  }
});

// 2. Lấy thông tin chi tiết 1 khách hàng
app.get("/customers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await axios.get(`${JSON_SERVER}/customers/${id}`);
    res.status(200).send({
      data: customer.data,
      message: `Customer ${id} details`,
    });
  } catch (error) {
    res.status(404).send({
      message: "Customer not found",
      error: error.message,
    });
  }
});

// 3. Lấy đơn hàng của 1 khách hàng
app.get("/customers/:customerId/orders", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await axios.get(`${JSON_SERVER}/orders`, {
      params: { customerId },
    });
    res.status(200).send({
      data: orders.data,
      message: `Orders of customer ${customerId}`,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching orders for this customer",
      error: error.message,
    });
  }
});

// 4. Lấy đơn hàng có totalPrice > 10 triệu
app.get("/orders/highvalue", async (req, res) => {
  try {
    const orders = await axios.get(`${JSON_SERVER}/orders`);
    const highValue = orders.data.filter((o) => o.totalPrice > 10000000);
    res.status(200).send({
      data: highValue,
      message: "High-value orders retrieved",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving high-value orders",
      error: error.message,
    });
  }
});

// 5. Lọc sản phẩm theo khoảng giá
app.get("/products", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const products = await axios.get(`${JSON_SERVER}/products`);
    const data = products.data;

    if (!minPrice || !maxPrice) {
      return res.status(200).send({
        data,
        message: "Full product list (no price filter)",
      });
    }

    const filtered = data.filter(
      (p) => p.price >= Number(minPrice) && p.price <= Number(maxPrice)
    );

    res.status(200).send({
      data: filtered,
      message: `Products filtered by price range ${minPrice} - ${maxPrice}`,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error filtering products",
      error: error.message,
    });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || typeof age !== "number") {
      return res.status(400).send({ message: "name/email/age invalid" });
    }
    // kiểm tra email trùng
    const existed = await axios.get(`${JSON_SERVER}/customers`, { params: { email } });
    if (existed.data.length > 0) return res.status(409).send({ message: "Email already exists" });

    const payload = { id: "c-" + Date.now(), name, email, age };
    const created = await axios.post(`${JSON_SERVER}/customers`, payload);
    res.status(201).send(created.data);
  } catch (e) {
    res.status(500).send({ message: "Cannot create customer", error: e.message });
  }
});

// --------------------------------
app.listen(PORT, () => {
  console.log(`✅ Express server is running on http://localhost:${PORT}`);
  console.log(`💾 JSON Server should be running on http://localhost:3000`);
});
