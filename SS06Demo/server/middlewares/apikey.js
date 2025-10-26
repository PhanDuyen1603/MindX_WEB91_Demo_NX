import Customer from "../models/Customer.js";

export async function requireApiKey(req, res, next) {
    try {
        const apiKey = req.query.apiKey || "";
        const parts = apiKey.split("$").map(s => s.trim());
        if (!apiKey.startsWith("web-") || parts.length < 6) {
            return res.status(401).json({ message: "Invalid API key format" });
        }

        const customerId = parts[1];
        const email = parts[3];
        const rand = parts[5];

        const customer = await Customer.findOne({ id: customerId, email }).lean();
        if (!customer) {
            return res.status(401).json({ message: "Invalid customer API key" });
        }

        if (!customer.apiKeyRand || customer.apiKeyRand !== rand ) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        req.authCustomer = { id: customerId, email };
        next();
    }
    catch (error) {
        next(error);
    }
}
