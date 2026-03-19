import express from 'express';
import { Service } from '../models/Service';
import { Order } from '../models/Orders';
import { Category } from '../models/Categories';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const services = await Service.find()
            .select('name slug price rating image seo')
            .populate('category', 'name slug');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

router.get ("/allService", async (req, res) => {
    try {
        const services = await Service.find().select('name')
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});


router.get('/details/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Find the service in your database using the slug
        const service = await Service.findOne({ slug: slug });

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
});

//  fetch services by category slug
router.get('/category/slug/:categorySlug', async (req, res) => {
    try {
        const { categorySlug } = req.params;

        // Step 1: Find the category by its unique slug
        const categoryDoc = await Category.findOne({ slug: categorySlug });

        if (!categoryDoc) {
            return res.status(404).json({ 
                message: `Category with slug '${categorySlug}' not found` 
            });
        }

        // Step 2: Fetch services linked to this ID
        const services = await Service.find({ category: categoryDoc._id })
            .select('name slug price image rating seo');

        // Step 3: Return services AND the category metadata (for the page header/SEO)
        res.json({
            category: categoryDoc,
            services: services
        });

    } catch (err) {
        res.status(500).json({ error: "Error fetching category services" });
    }
});

router.get('/category-stats', async (req, res) => {
    try {
        const stats = await Service.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "categories",
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
                    slug: "$details.slug", // Critical for linking from stats to actual pages
                    categoryImage: "$details.image",
                    description: "$details.description"
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Stats fetch failed" });
    }
});

router.get('/related/:slug',async (req, res) => {
  try {
        const { slug } = req.params;

        // 1. Find the current service to get its category
        const currentService = await Service.findOne({ slug });

        if (!currentService) {
            return res.status(440).json({ success: false, message: "Service not found" });
        }

        // 2. Find services in the same category (excluding current)
        let related = await Service.find({
            category: currentService.category,
            _id: { $ne: currentService._id }
        })
        .limit(3)
        .populate('category', 'name');

        // 3. "Heavy" Logic: If category is thin, pull top-rated global services
        if (related.length < 3) {
            const fillCount = 3 - related.length;
            const fallback = await Service.find({
                _id: { $ne: currentService._id, $nin: related.map(r => r._id) }
            })
            .sort({ rating: -1 }) // Get best rated ones
            .limit(fillCount)
            .populate('category', 'name');

            related = [...related, ...fallback];
        }

        res.status(200).json({
            success: true,
            count: related.length,
            data: related
        });
    } catch (error) {
        console.error("Related Services Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});




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
                    name: "$serviceDetails.name",
                    slug: "$serviceDetails.slug",
                    price: "$serviceDetails.price",
                    image: "$serviceDetails.image",
                    rating: "$serviceDetails.rating",
                    bookingCount: 1
                }
            }
        ]);

        if (topBookedData.length === 0) {
            const fallback = await Service.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name slug price image rating');
            return res.status(200).json(fallback);
        }

        res.status(200).json(topBookedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top services" });
    }
});

export default router;