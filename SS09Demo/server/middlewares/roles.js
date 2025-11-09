// middlewares/roles.js
// 👉 RBAC: chỉ cho phép một số role gọi endpoint
export const allow = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
