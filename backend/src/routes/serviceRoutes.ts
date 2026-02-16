import express from 'express';
import { Service } from '../models/Service';

const router = express.Router();

// Get all services
router.get('/allService', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Data fetch fail ho gaya" });
    }
});

router.get('/category-stats', async (req, res) => {
  try {
    const stats = await Service.aggregate([
      {
        $group: {
          _id: "$category", // Category field ke basis par group karega
          count: { $sum: 1 }, // Har category mein kitne items hain count karega
          categoryImage: { $first: "$image" }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get services by category
router.get('/category/:catName', async (req, res) => {
    try {
        const rawCatName = req.params.catName; // URL se slug lo: "appliance-repair"

        // 1. Slug to Title Case: "appliance-repair" -> "Appliance Repair"
        const formattedName = rawCatName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        console.log("🔍 Database Search Query:", formattedName);

        // 2. Database mein dhoondo
        // Pro tip: Use case-insensitive regex agar spelling thodi upar niche ho
        const services = await Service.find({ 
            category: { $regex: new RegExp(`^${formattedName}$`, 'i') } 
        });

        if (services.length === 0) {
            return res.status(404).json({ message: "Koi services nahi mili is category mein" });
        }

        res.json(services);
    } catch (err) {
        console.error("❌ Error fetching category:", err);
        res.status(500).json({ error: "Server error: Category fetch fail ho gayi" });
    }
});

export default router;