import express from 'express';
import { Order } from '../models/Orders';
import { requireAuth } from '@clerk/express';
import { fastAuth } from '../middleware/auth';
import { sendOrderEmail } from '../lib/mail';

const router = express.Router();

// Place a new order
router.post('/book', fastAuth, async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const { cartItems, totalAmount, userEmail } = req.body;

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

        sendOrderEmail(userEmail, newOrder)

        res.status(201).json({ success: true, orderId: newOrder._id });
    } catch (err: any) {
        res.status(500).json({ error: "Booking failed", details: err.message });
    }
});

// GET: Fetch all orders for the logged-in user
router.get('/history', fastAuth, async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        // Fetch orders and sort by most recent first
        const orders = await Order.find({ userId }).sort({ bookingDate: -1 });


        res.status(200).json({
            success: true,
            orders
        });
    } catch (err: any) {
        res.status(500).json({ error: "Failed to fetch orders", details: err.message });
    }
});


// A specific  Order details
router.get('/:id', requireAuth(), async (req: any, res: any) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch order details" });
    }
});

export default router;