import express from 'express';
import { User } from '../models/User';
import { fastAuth, isAdmin } from '../middleware/auth'; // Path to your middleware

const router = express.Router();

// 1. User Sync Route (Syncs Clerk data + Roles to MongoDB)
router.post('/sync-user', async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName, photo, role } = req.body;

        if (!clerkId) return res.status(400).json({ error: "Missing Clerk ID" });

        const user = await User.findOneAndUpdate(
            { clerkId: clerkId },
            { 
                email, 
                firstName, 
                lastName, 
                photo,
                role: role || 'user' // Storing the role in your DB
            }, 
            { new: true, upsert: true }
        ).populate('orders');

        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("Sync Error:", err);
        res.status(500).json({ error: "Database sync failed" });
    }
});



export default router;