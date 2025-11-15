import Order from "../models/order.js";
import Product from "../models/product.js";



// Placed Order COD :/api/order/cod
export const placeOrderCOD = async(req, res)=>{
    try {
        const { userId, items, address }= req.body;
        if(!address|| items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
        
             // Calculate Amount using items
          const itemAmounts = await Promise.all(
             items.map(async (item) => {
                const prod = await Product.findById(item.product); // fetch product from DB
                 if (!prod) throw new Error("Product not found");
                return prod.offerPrice * item.quantity;
  })
);

let amount = itemAmounts.reduce((acc, val) => acc + val, 0);

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({success: true, message: "Order Placed Successfully"})
    } catch (error) {
        return res.json({ success: false, message: error.message});
        
    }
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const { userId }= req.body;
        const Orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, Orders});
    } catch (error) {
        res.json({success: false, message:error.message});
        
    }
}

// Get All Order ( for seller/ admin ): /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        
        const Orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, Orders});
    } catch (error) {
        res.json({success: false, message:error.message});
        
    }
}
