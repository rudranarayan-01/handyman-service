import express from 'express';
import { Service } from '../models/Service';
import { Order } from '../models/Orders';
import { Category } from '../models/Categories';

const router = express.Router();

// 1. Fetch all services (for listing pages)
router.get("/", async (req, res) => {
    try {
        const services = await Service.find()
            // Updated to select basePrice and pricingType
            .select('name slug basePrice pricingType unitName rating image seo')
            .populate('category', 'name slug');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// 2. Simple list for search/dropdowns
router.get ("/allService", async (req, res) => {
    try {
        const services = await Service.find().select('name slug');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// 3. Detailed Service (including all variants)
router.get('/details/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const service = await Service.findOne({ slug: slug })
            .populate('category', 'name slug');

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error });
    }
});

// 4. Fetch services by category slug
router.get('/category/slug/:categorySlug', async (req, res) => {
    try {
        const { categorySlug } = req.params;

        const categoryDoc = await Category.findOne({ slug: categorySlug });

        if (!categoryDoc) {
            return res.status(404).json({ 
                message: `Category with slug '${categorySlug}' not found` 
            });
        }

        const services = await Service.find({ category: categoryDoc._id })
            .select('name slug basePrice pricingType unitName image rating seo');

        res.json({
            category: categoryDoc,
            services: services
        });

    } catch (err) {
        res.status(500).json({ error: "Error fetching category services" });
    }
});

// 5. Category Stats (Aggregated)
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
                    slug: "$details.slug",
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

// 6. Related Services (Logic-based fallback)
router.get('/related/:slug', async (req, res) => {
  try {
        const { slug } = req.params;

        const currentService = await Service.findOne({ slug });

        if (!currentService) {
            return res.status(440).json({ success: false, message: "Service not found" });
        }

        let related = await Service.find({
            category: currentService.category,
            _id: { $ne: currentService._id }
        })
        .select('name slug basePrice pricingType image rating') // Select new fields
        .limit(3)
        .populate('category', 'name');

        if (related.length < 3) {
            const fillCount = 3 - related.length;
            const fallback = await Service.find({
                _id: { $ne: currentService._id, $nin: related.map(r => r._id) }
            })
            .select('name slug basePrice pricingType image rating')
            .sort({ rating: -1 })
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

// 7. Top Booked Services (Aggregation with new schema fields)
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
                    basePrice: "$serviceDetails.basePrice", // Updated
                    pricingType: "$serviceDetails.pricingType", // Updated
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
                .select('name slug basePrice pricingType image rating'); // Updated
            return res.status(200).json(fallback);
        }

        res.status(200).json(topBookedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top services" });
    }
});

export default router;