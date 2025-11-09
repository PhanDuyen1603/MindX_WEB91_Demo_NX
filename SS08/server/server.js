import {app} from "./app.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));