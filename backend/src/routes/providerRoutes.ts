import express, { Request, Response } from 'express';
import { Partner } from '../models/Partners';
import { fastAuth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all partners (Admin only)
router.get('/all', async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter = status ? { status: status as string } : {};
        
        const providers = await Partner.find(filter).sort({ createdAt: -1 });
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching providers", error });
    }
});

// Approve/Reject (Admin only)
router.patch('/verify/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    try {
        const isVerified = status === 'approved';
        
        // Update the partner in your database
        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { 
                status: status, 
                isVerified: isVerified 
            },
            { new: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.json(updatedPartner);
    } catch (error) {
        res.status(500).json({ message: "Server error during verification" });
    }
});

// Delete (Admin only)
// Removed 'providers' from path because it's usually in the prefix
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
    try {
        const deletedPartner = await Partner.findByIdAndDelete(req.params.id);
        if (!deletedPartner) return res.status(404).json({ message: "Partner not found" });
        res.status(200).json({ message: "Partner deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
});

// Public Registration
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, serviceAreas, specializations } = req.body;

        const existing = await Partner.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const newPartner = new Partner({
            name,
            email,
            phone,
            serviceAreas,
            specializations,
            status: 'pending'
        });

        await newPartner.save();
        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});

export default router;