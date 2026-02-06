import express from 'express';
import { Order } from '../models/Orders';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// Place a new order
router.post('/book', requireAuth(), async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const { serviceId, bookingDate, amount } = req.body;

        const newOrder = await Order.create({
            userId,
            serviceId,
            bookingDate,
            amount
        });

        res.status(201).json({ message: "Order placed!", order: newOrder });
    } catch (err) {
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