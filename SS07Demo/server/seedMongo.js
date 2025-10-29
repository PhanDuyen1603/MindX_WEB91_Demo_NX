import mongoose from "mongoose";
import "dotenv/config";
import { customers, products, orders } from "./data.js";

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
console.log("✅ Connected to MongoDB");

await Promise.all([
  db.collection("customers").deleteMany({}),
  db.collection("products").deleteMany({}),
  db.collection("orders").deleteMany({})
]);
await db.collection("customers").insertMany(customers || []);
await db.collection("products").insertMany(products || []);
if (orders?.length) await db.collection("orders").insertMany(orders);

console.log("🚀 Seeded data");
await mongoose.disconnect();
console.log("🔌 Done");
