import express from 'express';
import { Service } from '../models/Service';
import { Order } from '../models/Orders';
import { Category } from '../models/Categories';

const router = express.Router();


router.get("/", async(req, res)=>{
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
})

interface PopulatedCategory {
  _id: string;
  name: string;
}

// 1. Get all services (Populating Category Name)
router.get('/allService', async (req, res) => {
    try {
        const services = await Service.find()
            .select('name category')
            .populate('category', 'name')
            .lean();

        const flattenedServices = services.map(service => {
            // 2. Cast the category to our interface
            const category = service.category as unknown as PopulatedCategory;

            return {
                _id: service._id,
                name: service.name,
                // 3. Now 'name' will be recognized
                category: category ? category.name : 'Uncategorized'
            };
        });

        res.json(flattenedServices);
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// 2. Category Stats (Using the new Category Model structure)
router.get('/category-stats', async (req, res) => {
    try {
        const stats = await Service.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "categories", // Collection name for Category
                    localField: "_id",
                    foreignField: "_id",
                    as: "details"
                }
            },
            { $unwind: "$details" },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    name: "$details.name",
                    categoryImage: "$details.image"
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Stats fetch failed" });
    }
});

// 3. Get services by slug (The "Smart" way)
router.get('/category/:catName', async (req, res) => {
    try {
        const { catName } = req.params; // e.g., "appliance-repair"

        /**
         * Step 1: Find the category.
         * We match the name by replacing hyphens with spaces and using 
         * a case-insensitive regex. This handles "appliance-repair" 
         * matching "Appliance Repair" perfectly.
         */
        const searchName = catName.replace(/-/g, ' ');
        
        const categoryDoc = await Category.findOne({
            name: { $regex: new RegExp(`^${searchName}$`, 'i') }
        });

        if (!categoryDoc) {
            return res.status(404).json({ 
                message: `Category '${searchName}' not found` 
            });
        }

        /**
         * Step 2: Fetch services linked to this Category ID.
         * We also populate the category to get the full object back.
         */
        const services = await Service.find({ category: categoryDoc._id })
            .populate('category', 'name image'); // Added image here since you need it for wallpapers

        // Step 3: Return services (or empty array if none exists yet)
        res.json(services);

    } catch (err) {
        console.error("Category Fetch Error:", err);
        res.status(500).json({ error: "Internal server error while fetching category" });
    }
});

// 4. Top Booked (Remains mostly same, but ensures lookup matches Service ID)
router.get('/top-booked', async (req, res) => {
    try {
        const topBookedData = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: "$serviceId", bookingCount: { $sum: 1 } } },
            { $sort: { bookingCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "services",
                    localField: "_id",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $project: {
                    _id: "$serviceDetails._id",
                    name: "$serviceDetails.name", // Changed 'title' to 'name' based on your schema
                    price: "$serviceDetails.price",
                    image: "$serviceDetails.image",
                    rating: "$serviceDetails.rating",
                    bookingCount: 1
                }
            }
        ]);

        if (topBookedData.length === 0) {
            const fallback = await Service.find().sort({ createdAt: -1 }).limit(10).populate('category', 'name');
            return res.status(200).json(fallback);
        }

        res.status(200).json(topBookedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top services" });
    }
});

// 5. Specific Appliance Repair Route
router.get('/appliance-repair', async (req, res) => {
    try {
        // Find Category ID for 'Appliance Repair'
        const cat = await Category.findOne({ name: 'Appliance Repair' });

        if (!cat) return res.json([]);

        const services = await Service.find({
            category: cat._id,
            isActive: true
        })
            .select('name image rating price')
            .limit(10)
            .sort({ rating: -1 });

        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
});

export default router;