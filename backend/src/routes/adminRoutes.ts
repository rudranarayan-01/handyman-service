import express from 'express';
import { User } from '../models/User';
import { fastAuth, isAdmin } from '../middleware/auth';

const router = express.Router();

// GET all users - Protected: Only Admin/Manager can call this
router.get('/users', fastAuth, isAdmin, async (req, res) => {
    try {
        // Fetch users and sort by newest first
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user directory" });
    }
});

export default router;