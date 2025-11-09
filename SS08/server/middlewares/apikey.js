// server/middlewares/apikey.js
import Customer from "../models/Customer.js";

/**
 * YÊU CẦU: apiKey trên query ?apiKey=...
 * Format: web-$<customerId>$-$<email>$-$<rand>$
 */
export async function requireApiKey(req, res, next) {
  try {
    const apiKey = req.query.apiKey || "";

    // 1) Kiểm tra format
    const parts = apiKey.split("$").map(s => s.trim());
    // Ví dụ "web-$c1$-$alice@example.com$-$abcdef123456$"
    if (!apiKey.startsWith("web-") || parts.length < 6) {
      return res.status(401).json({ message: "Invalid apiKey format" });
    }

    // 2) Rút thông tin
    const customerId = parts[1];
    const email      = parts[3];
    const rand       = parts[5];

    // 3) Đối chiếu DB
    const customer = await Customer.findOne({ id: customerId, email }).lean();
    if (!customer) return res.status(401).json({ message: "Invalid customer in apiKey" });
    if (!customer.apiKeyRand || customer.apiKeyRand !== rand) {
      return res.status(401).json({ message: "Invalid apiKey (rand mismatch)" });
    }

    // 4) Pass qua: có thể đính kèm info cho downstream
    req.authCustomer = { id: customerId, email };
    next();
  } catch (err) {
    next(err);
  }
}
