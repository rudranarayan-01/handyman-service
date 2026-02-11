import express from 'express';
import { User } from '../models/User';
import { requireAuth } from '@clerk/express';

const router = express.Router();


router.post('/sync-user', async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName, photo } = req.body;

        if (!clerkId) return res.status(400).json({ error: "Missing Clerk ID" });

        // upsert: true ka matlab hai - agar user nahi mila toh bana do, mil gaya toh update karo
        const user = await User.findOneAndUpdate(
            { clerkId: clerkId }, // Clerk ID se search karo
            { 
                email, 
                firstName, 
                lastName, 
                photo 
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