import Order from "../models/Order";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyOrders = asyncHandler(async (req, res) => {
    const { id } = req.param; // Lấy id từ req.user do auth middleware gán vào
    const authId = req.authCustomer.id;

    if(!authId){
        return res.status(401).json({message: "Unauthorized"});
    }

    if(id !== authId){
        return res.status(403).json({message: "Forbidden"});
    }

    const orders = await Order.find({customerId: id});
    res.json(orders);
});