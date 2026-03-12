import express, { Request, Response } from 'express';
import { isAdmin } from '../middleware/auth'; // Optional: for protected routes
import { Category } from '../models/Categories';
import { Service } from '../models/Service';

const router = express.Router();

/**
 * 1. GET ALL CATEGORIES
 * Used for the homepage grid and the "Join as Partner" dropdowns.
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
});

/**
 * 2. GET CATEGORY BY SLUG/NAME
 * Useful for showing a specific category's details (like description/header image)
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category details" });
    }
});

/**
 * 3. CREATE NEW CATEGORY (Admin Only)
 * Used to add things like "EV Charging Setup" or "Smart Home"
 */
router.post('/add', async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;

        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ message: "Category already exists" });

        const newCategory = new Category({ name, description, image });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
});

/**
 * 4. UPDATE CATEGORY (Admin Only)
 * Perfect for updating the "Summer Special" images or descriptions
 */
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

/**
 * 5. DELETE CATEGORY (Admin Only)
 * CRITICAL: Check if services exist in this category before deleting!
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        // Check if any services are still using this category
        const connectedServices = await Service.countDocuments({ category: req.params.id });
        
        if (connectedServices > 0) {
            return res.status(400).json({ 
                message: `Cannot delete. This category has ${connectedServices} active services.` 
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;