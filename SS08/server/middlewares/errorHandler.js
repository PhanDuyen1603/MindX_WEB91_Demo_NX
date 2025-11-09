export function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicated key", detail: err.keyValue });
  }
  res.status(err.status || 500).json({ message: err.message || "Server error" });
}
