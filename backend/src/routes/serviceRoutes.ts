import express from 'express';
import { Service } from '../models/Service';
import { Order } from '../models/Orders';

const router = express.Router();

// Get all services
router.get('/allService', async (req, res) => {
    try {
        // Only fetch name and category to keep the response light
        const services = await Service.find().select('name category');
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch services" });
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



router.get('/top-booked', async (req, res) => {
    try {
        const topBookedData = await Order.aggregate([
            // 1. Filter completed orders
            { $match: { status: "completed" } },
            
            // 2. Count bookings per service
            { $group: { 
                _id: "$serviceId", 
                bookingCount: { $sum: 1 } 
            }},
            
            // 3. Sort by most popular
            { $sort: { bookingCount: -1 } },
            
            // 4. Take top 10
            { $limit: 10 },
            
            // 5. JOIN with the Services collection
            {
                $lookup: {
                    from: "services",       // Make sure this matches your MongoDB collection name
                    localField: "_id",      // The serviceId from the Group step
                    foreignField: "_id",    // The _id in the Services collection
                    as: "serviceDetails"
                }
            },
            
            // 6. Flatten the array returned by $lookup
            { $unwind: "$serviceDetails" },
            
            // 7. Clean up the output to match your UI needs
            {
                $project: {
                    _id: "$serviceDetails._id",
                    title: "$serviceDetails.title",
                    price: "$serviceDetails.price",
                    image: "$serviceDetails.image",
                    rating: "$serviceDetails.rating",
                    reviews: "$serviceDetails.reviews",
                    bookingCount: 1 // You can show "X bookings" in UI if you want
                }
            }
        ]);

        // FALLBACK: If no orders exist yet, just return the 10 most recent services
        if (topBookedData.length === 0) {
            const fallbackServices = await Service.find().sort({ createdAt: -1 }).limit(10);
            return res.status(200).json(fallbackServices);
        }

        res.status(200).json(topBookedData);
    } catch (error) {
        console.error("Top Booked Error:", error);
        res.status(500).json({ message: "Error fetching top services", error: error });
    }
});

export default router;