import express from 'express';
// IMPORTANT: Use curly braces here!
import { fastAuth, isAdmin } from '../middleware/auth'; 
import { User } from '../models/User';
import { createClerkClient } from '@clerk/backend';
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const router = express.Router();

// Get all users for admin Dashboard
router.get('/users', fastAuth, isAdmin, async (req: any, res: any) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
        console.log("User fetched")
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// Modify role
router.patch('/users/:clerkId/role', fastAuth, isAdmin, async (req, res) => {
    try {
        const { clerkId } = req.params;
        const { newRole } = req.body;

        const allowedRoles = ['admin', 'manager', 'user'];
        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({ error: "Invalid role type" });
        }

        // 1. Update Clerk Metadata (Important for JWT/Auth)
        await clerkClient.users.updateUserMetadata(clerkId, {
            publicMetadata: {
                role: newRole
            }
        });

        // 2. Update MongoDB (Important for User Directory/Frontend)
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            { role: newRole },
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            message: `Role updated to ${newRole}`,
            user: updatedUser 
        });
    } catch (err: any) {
        console.error("Role Update Error:", err);
        res.status(500).json({ error: "Failed to update role" });
    }
});

// DELETE User Route
router.delete('/users/:clerkId', fastAuth, isAdmin, async (req, res) => {
    try {
        const { clerkId } = req.params;

        // 1. Delete from Clerk (Auth)
        await clerkClient.users.deleteUser(clerkId);

        // 2. Delete from MongoDB (Database)
        const deletedUser = await User.findOneAndDelete({ clerkId });

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found in Database" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully from Clerk and DB" });
    } catch (err: any) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete user", details: err.message });
    }
});

export default router;