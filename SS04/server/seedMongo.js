import mongoose from "mongoose";
import { readFileSync } from "fs";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Thiếu MONGODB_URI trong .env");
  process.exit(1);
}
const { customers, products, orders } = JSON.parse(readFileSync("./db.json","utf8"));

await mongoose.connect(uri);
const db = mongoose.connection.db;

await Promise.all([
  db.collection("customers").deleteMany({}),
  db.collection("products").deleteMany({}),
  db.collection("orders").deleteMany({}),
]);

await db.collection("customers").insertMany(customers);
await db.collection("orders").insertMany(orders);
await db.collection("products").insertMany(products);

console.log("✅ Seed xong customers & products");
await mongoose.disconnect();