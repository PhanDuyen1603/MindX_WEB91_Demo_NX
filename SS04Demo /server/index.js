import express from "express";        
import mongoose from "mongoose";
import dotenv from "dotenv" 
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";

dotenv.config();

const app = express();
app.use(express.json()); // Middleware để parse JSON body      
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() =>console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connecton error:", err));

// app.get("/", (req, res) => {
//   res.send("🎉 Express server is running!");
// });

app.get ("/", (req, res) => {
    res.send("Server & MongoDB are ready!");
})

//Caau 01:
app.get("/customers", async (_req, res)=>{
    try{
        const customers = await Customer.find();
        res.json(customers);
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
});

//Caau 02: 2. Lấy thông tin chi tiết của một khách hàng
// Viết API để lấy thông tin chi tiết của một khách hàng dựa trên id.
// Endpoint: GET /customers/:id
// Ví dụ:
//  /customers/1  -> trả về thông tin customer có id là 1
// /customers/2   -> trả về thông tin customer có id là 2
// :id sẽ đại diện như một biến trên url
// Yêu cầu: Trả về thông tin của một khách hàng cụ thể dựa trên id được truyền vào URL

app.get("/customers/:id", async(req, res)=>{
    try{
        const {id}= req.params;
        const customers = await Customer.findById(id);

        if(!customers){
            return res.status(404).json({message:"Customer not found"});
        }
        res.json(customers);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

//Cau 03: 3. Lấy danh sách đơn hàng của một khách hàng cụ thể
// Viết API để lấy danh sách các đơn hàng của một khách hàng cụ thể dựa trên customerId.
// Endpoint: GET /customers/:customerId/orders
// Ví dụ: /customers/1/orders  -> Trả về danh sách orders của customer có id là 1
// Yêu cầu: Trả về danh sách tất cả đơn hàng của một khách hàng dựa trên customerId. Nếu khách hàng không có đơn hàng nào, trả về danh sách rỗng.

app.get("/customers/:customerId/orders", async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Tìm customer trước để lấy field 'id' 
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Tìm orders dựa trên field 'id' của customer
    const orders = await Order.find({ customerId: customer.id });
    console.log(`Finding orders for customer ${customerId} (id: ${customer.id}) -> found: ${orders.length}`);

    res.json(orders);
  } catch (err) {
    console.error("find orders error:", err);
    res.status(500).json({ message: err.message });
  }
});

//Cau 04: 4. Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
// Viết API để lấy danh sách các đơn hàng có tổng giá trị (totalPrice) trên 10 triệu.
// VD Endpoint: GET /orders?totalPrice_gt=10000000
// Yêu cầu: Trả về danh sách các đơn hàng có totalPrice lớn hơn 10 triệu.
app.get("/orders", async (req, res) => {
  try {
    const { totalPrice_gt } = req.query;
    
    // Nếu có query parameter totalPrice_gt, lọc theo điều kiện
    const filter = totalPrice_gt ? { totalPrice: { $gt: Number(totalPrice_gt) } } : {};
    
    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Cau 05: 5. Lọc danh sách sản phẩm theo khoảng giá
// Viết API để lọc danh sách sản phẩm dựa trên khoảng giá minPrice và maxPrice được truyền vào thông qua query parameters
// Nếu không có 1 trong 2, thì trả về toàn bộ danh sách product
// GET /products?minPrice=?&maxPrice=?
// Ví dụ: GET /products?minPrice=5000000&maxPrice=10000000 sẽ trả về danh sách sản phẩm có giá từ 5 triệu đến 10 triệu.
app.get("/products", async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    
    // Xây dựng filter dựa trên query parameters
    const filter = {};
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Cau 06: 6. Thêm mới khách hàng
// Viết API để thêm một khách hàng mới vào danh sách khách hàng.
// POST /customers
// Yêu cầu:
// - Nhận thông tin khách hàng từ body của request (bao gồm: name, email, và age).
// - Thêm khách hàng mới vào mảng customers và trả về thông tin khách hàng mới thêm.
// - email là duy nhất, không được trùng.
app.post("/customers", async (req, res) => {
  try {
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
  } catch (err) {
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: err.message });
  }
});

//Cau 07: 7. Tạo mới đơn hàng
// Viết API để thêm một đơn hàng mới vào danh sách đơn hàng.
// POST /orders
// Yêu cầu:
// - Nhận thông tin đơn hàng từ body của request (bao gồm customerId, productId, quantity).
// - quantity phải hợp lệ (<= quantity của product tức số lượng sp còn lại, > 0)
// - Tính totalPrice dựa trên price của sản phẩm và quantity.
// - Thêm đơn hàng vào mảng orders và trả về thông tin đơn hàng mới thêm.
// - Khi đơn hàng được tạo thành công, số lượng của sản phẩm phải bị giảm
app.post("/orders", async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    
    // Validate input
    if (!customerId || !productId || !quantity) {
      return res.status(400).json({ message: "customerId, productId, and quantity are required" });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    // Kiểm tra customer có tồn tại không
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Kiểm tra product có tồn tại không
    const product = await Product.findById(productId);
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
    // customerId: dùng field 'id' nếu có (như "c001"), không thì dùng _id
    // productId: dùng field 'id' nếu có (như "p001"), không thì dùng _id
    const newOrder = new Order({
      customerId: customer.id || customer._id.toString(),
      productId: product.id || product._id.toString(),
      quantity,
      unitPrice: product.price,
      totalPrice
    });
    
    await newOrder.save();
    
    // Giảm số lượng sản phẩm
    product.quantity -= quantity;
    await product.save();
    
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Cau 08: 8. PUT - Cập nhật số lượng sản phẩm trong đơn hàng
// Viết API để cập nhật số lượng sản phẩm trong một đơn hàng dựa trên orderId.
// PUT /orders/:orderId
// Yêu cầu:
// - Nhận thông tin cập nhật từ body của request (bao gồm quantity).
// - Tìm đơn hàng dựa trên orderId, cập nhật quantity và tính toán lại totalPrice.
// - Nếu không tìm thấy đơn hàng, trả về lỗi 404.
app.put("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { quantity } = req.body;
    
    // Validate input
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    // Tìm order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Tìm product để lấy giá và kiểm tra số lượng
    // Thử tìm theo _id trước, nếu không được thì tìm theo field 'id'
    let product = await Product.findById(order.productId);
    if (!product) {
      product = await Product.findOne({ id: order.productId });
    }
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Cau 09: 9. DELETE - Xóa khách hàng
// Viết API để xóa một khách hàng dựa trên id.
// DELETE /customers/:id
// Yêu cầu:
// - Xóa khách hàng có id tương ứng khỏi mảng customers.
// - Nếu không tìm thấy khách hàng, trả về lỗi 404.
// - Trả về thông báo thành công sau khi xóa.
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tìm và xóa customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json({ 
      message: "Customer deleted successfully",
      customer: deletedCustomer
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
  console.log("✅ Server ready at http://localhost:3001");
});
