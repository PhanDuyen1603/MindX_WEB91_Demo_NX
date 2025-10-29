export function requireFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter(f => !(f in req.body));
    if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    next();
  };
}
