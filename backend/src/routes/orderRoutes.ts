import express from 'express';
import { Order } from '../models/Orders';
import { requireAuth } from '@clerk/express';
import { fastAuth } from '../middleware/auth';
import { sendOrderEmail } from '../lib/mail';

const router = express.Router();

export const generateOrderId = () => {
    return `ORD-${Math.random().toString(36).toUpperCase().substring(2, 9)}`;
};

// Place a new order
router.post('/book', fastAuth, async (req: any, res: any) => {
    try {
        const { userId } = req.auth; // Clerk ID from middleware
        const { cartItems, totalAmount, userEmail, userName, address, phone } = req.body;

        if (!cartItems?.length) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // 1. Generate a human-readable Order ID
        const customOrderId = generateOrderId();

        // 2. Create the order with snapshots
        const newOrder = await Order.create({
            orderId: customOrderId,
            userId,
            customerDetails: {
                name: userName || 'Customer', // Frontend se pass karein ya Clerk se nikalein
                email: userEmail,
                phone: phone, 
                address: address
            },
            items: cartItems.map((item: any) => ({
                serviceId: item._id,
                name: item.name,
                price: item.price,
                image: item.image // Scalability: snapshot the image URL
            })),
            totalAmount,
            status: 'pending',
            bookingDate: new Date(),
            serviceFee: 19 // Default value as per schema
        });

        // 3. Email trigger (Non-blocking)
        // Background run
        sendOrderEmail(userEmail, newOrder).catch(err => console.log("Email Error:", err));

        // 4. Send back the Custom Order ID for tracking
        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully",
            orderId: newOrder.orderId, // Human readable
            dbId: newOrder._id,         // Technical ID
        });

    } catch (err: any) {
        console.error("Booking Error:", err);
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
        const order = await Order.findById(req.params.id)
            .populate('assignedPartner', 'name phone'); 

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        console.error("Fetch Order Error:", err);
        res.status(500).json({ error: "Failed to fetch order details" });
    }
});

// Route for Feedback
router.patch("/:id/feedback", fastAuth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { id } = req.params;

        // Agar aap MongoDB ki _id use kar rahe hain:
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { 
                feedback: { rating, comment, submittedAt: new Date() } 
            },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// DELETE feedback from an order
router.delete("/:id/feedback", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { 
                $unset: { feedback: "" }
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error});
    }
});

export default router;