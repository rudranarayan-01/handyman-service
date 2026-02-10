import express from 'express';
import { Order } from '../models/Orders';
import { requireAuth } from '@clerk/express';
import { fastAuth } from '../middleware/auth';

const router = express.Router();

// Place a new order
router.post('/book', fastAuth, async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const { cartItems, totalAmount } = req.body;

        if (!cartItems?.length) return res.status(400).json({ error: "Cart is empty" });

        const newOrder = await Order.create({
            userId,
            items: cartItems.map((item: any) => ({
                serviceId: item._id,
                name: item.name,
                price: item.price
            })),
            totalAmount,
            status: 'pending'
        });

        res.status(201).json({ success: true, orderId: newOrder._id });
    } catch (err: any) {
        res.status(500).json({ error: "Booking failed", details: err.message });
    }
});

// Get User's Order History
router.get('/my-history', requireAuth(), async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const history = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "History fetch failed" });
    }
});

export default router;