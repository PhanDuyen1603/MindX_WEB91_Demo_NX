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
app.get('/customers/:id', async (req, res) => {

  try{
    const id = req.params.id;//nhập vào URL C001
    const customer = await Customer.findById(id); //tìm trong DB cái customer có id trùng với id truyền vào
    
    if(!customer) {
      return res.status(404).json({message: 'Customer not found'});
    }
    res.json(customer);
  }
  catch(error){
    return res.status(500).json({message: 'Server error'});
  }
}

);

// 3) GET /customers/:customerId/orders — đơn hàng của KH

app.get('/customers/:customerId/orders'), async(req, res)=>{
  try{
    const customerId = req.params.id;

    const orders = await Customer.find({ customerId}).populate("p")
  }

}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 API ready on http://localhost:${PORT}`));
