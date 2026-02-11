import express from 'express';
import { User } from '../models/User';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// GET USER DATA (Including Addresses)
router.get('/get-user/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/update-privacy', async (req, res) => {
    try {
        const { clerkId, privacySettings } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            { $set: { privacySettings } },
            { new: true }
        );
        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: err});
    }
});

export default router