import express from 'express';
// IMPORTANT: Use curly braces here!
import { fastAuth, isAdmin } from '../middleware/auth'; 
import { User } from '../models/User';

const router = express.Router();

// This is likely your Line 8
router.get('/users', fastAuth, isAdmin, async (req: any, res: any) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
        console.log("User fetched")
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

export default router;