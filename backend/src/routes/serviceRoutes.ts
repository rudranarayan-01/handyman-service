import express from 'express';
import { Service } from '../models/Service';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Data fetch fail ho gaya" });
    }
});

// Get services by category
router.get('/category/:catName', async (req, res) => {
    try {
        const services = await Service.find({ category: req.params.catName });
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Category fetch fail ho gayi" });
    }
});

export default router;