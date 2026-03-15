import express, { Request, Response } from 'express';
import { Category } from '../models/Categories';
import { Service } from '../models/Service';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // We include slug and seo fields in the response
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
});

router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });
        
        if (!category) return res.status(404).json({ message: "Category not found" });
        
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category details" });
    }
});

router.post('/add', async (req: Request, res: Response) => {
    try {
        const { name, description, image, seo, slug } = req.body;

        const existing = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existing) return res.status(400).json({ message: "Category or Slug already exists" });

        // Generate slug if not provided: "AC Repair" -> "ac-repair"
        const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        const newCategory = new Category({ 
            name, 
            description, 
            image, 
            slug: finalSlug,
            seo: {
                metaTitle: seo?.metaTitle || name,
                metaDescription: seo?.metaDescription || description?.substring(0, 160),
                keywords: seo?.keywords || []
            }
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Failed to create category", error });
    }
});

router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Use $set to allow partial updates to nested seo object
            { new: true }
        );
        
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const connectedServices = await Service.countDocuments({ category: req.params.id });
        
        if (connectedServices > 0) {
            console.warn(`Attempt to delete category ${req.params.id} with ${connectedServices} connected services.`);
            return res.status(400).json({ 
                message: `Cannot delete. This category has ${connectedServices} active services.` 
            });
        }

        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;