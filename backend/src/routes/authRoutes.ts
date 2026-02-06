import express from 'express';
import { User } from '../models/User';
import { requireAuth } from '@clerk/express';

const router = express.Router();


router.post('/sync-user', requireAuth(), async (req: any, res: any) => {
    try {
        const { userId } = req.auth;
        const { email, firstName, lastName, photo } = req.body;

        // Check karo user pehle se hai ya nahi
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            user = await User.create({
                clerkId: userId,
                email,
                firstName,
                lastName,
                photo
            });
            return res.status(201).json({ message: "User synced successfully", user });
        }

        res.status(200).json({ message: "User already exists", user });
    } catch (err) {
        res.status(500).json({ error: "Sync failed" });
    }
});

export default router;