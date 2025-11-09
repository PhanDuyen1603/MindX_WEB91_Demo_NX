// middlewares/auth.js
// 👉 Xác thực JWT từ header Authorization: Bearer <token>
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // {id, role, iat, exp}
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
