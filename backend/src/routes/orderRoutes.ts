import express from 'express';
import { Order } from '../models/Orders';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// Place New Order
router.post('/book', requireAuth(), async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const { cartItems, totalAmount } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const newOrder = await Order.create({
            userId,
            items: cartItems.map((item: any) => ({
                serviceId: item._id,
                name: item.name,
                price: item.price
            })),
            totalAmount,
            bookingDate: new Date() 
        });

        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully!", 
            orderId: newOrder._id 
        });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ error: "Booking failed" });
    }
});
// Get User's Order History
router.get('/my-history', requireAuth(), async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const history = await Order.find({ userId }).populate('serviceId');
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "History fetch failed" });
    }
});

export default router;