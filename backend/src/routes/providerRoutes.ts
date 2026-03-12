import express, { Request, Response } from 'express';
import { Partner } from '../models/Partners';
import { fastAuth, isAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * 1. GET ALL PARTNERS (Admin Only)
 * Updated: Populates the category details in specializations
 */
router.get('/all', async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter = status ? { status: status as string } : {};
        
        const providers = await Partner.find(filter)
            .populate('specializations', 'name image') // Populates Category info
            .sort({ createdAt: -1 });

        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching providers", error });
    }
});

/**
 * 2. APPROVE / REJECT (Admin Only)
 * Updates both status string and boolean verification flag
 */
router.patch('/verify/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'approved' | 'rejected' | 'pending'

    try {
        const isVerified = status === 'approved';
        
        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { 
                status: status, 
                isVerified: isVerified 
            },
            { new: true }
        ).populate('specializations', 'name');

        if (!updatedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        res.json(updatedPartner);
    } catch (error) {
        res.status(500).json({ message: "Server error during verification" });
    }
});

/**
 * 3. DELETE PARTNER (Admin Only)
 */
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
    try {
        const deletedPartner = await Partner.findByIdAndDelete(req.params.id);
        if (!deletedPartner) {
            return res.status(404).json({ message: "Partner not found" });
        }
        res.status(200).json({ message: "Partner deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete operation failed", error });
    }
});

/**
 * 4. PUBLIC REGISTRATION
 * Updated: Logic to handle specializations as Category IDs
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, serviceAreas, specializations } = req.body;

        // Check for existing application
        const existing = await Partner.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "This email is already registered as a partner" });
        }

        // Create new application
        // Note: 'specializations' should be an array of Category ObjectIds sent from frontend
        const newPartner = new Partner({
            name,
            email,
            phone,
            serviceAreas,
            specializations, // Store Category IDs
            status: 'pending',
            isVerified: false
        });

        await newPartner.save();
        res.status(201).json({ 
            message: "Your partner application has been submitted and is under review.",
            partnerId: newPartner._id 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed. Please check your details.", error });
    }
});

export default router;