// server.js
// 👉 Điểm vào chính: nạp .env → kết nối DB → listen
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./utils/db.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Kết nối DB trước khi nghe request để tránh lỗi lúc dùng models
await connectDB(process.env.MONGO_URI);



// Bắt đầu lắng nghe
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
