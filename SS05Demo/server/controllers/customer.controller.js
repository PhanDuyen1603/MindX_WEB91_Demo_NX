import Customer from "../models/Customer";
import Order from "../models/Order";
import { asyncHandler } from "../utils/asyncHandler";

//Caau 01:
const getAllCustomers = asyncHandler(async (_req, res)=>{
    const customers = await Customer.find().lean();
    res.json(customers);
});