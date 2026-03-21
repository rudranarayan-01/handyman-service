import express from 'express';
// IMPORTANT: Use curly braces here!
import { fastAuth, isAdmin } from '../middleware/auth';
import { User } from '../models/User';
import { createClerkClient } from '@clerk/backend';
import { Order } from '../models/Orders';
import { Service } from '../models/Service';
import { Partner } from '../models/Partners';
import { triggerOrderNotifications } from '../lib/Allnotifications';
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Get all users for admin Dashboard
router.get('/users', fastAuth, isAdmin, async (req: any, res: any) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
        // console.log("User fetched")
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// Modify role
router.patch('/users/:clerkId/role', fastAuth, isAdmin, async (req, res) => {
    try {
        const { clerkId } = req.params;
        const { newRole } = req.body;

        const allowedRoles = ['admin', 'manager', 'user'];
        if (!allowedRoles.includes(newRole)) {
            return res.status(400).json({ error: "Invalid role type" });
        }

        // 1. Update Clerk Metadata (Important for JWT/Auth)
        await clerkClient.users.updateUserMetadata(clerkId, {
            publicMetadata: {
                role: newRole
            }
        });

        // 2. Update MongoDB (Important for User Directory/Frontend)
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            { role: newRole },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Role updated to ${newRole}`,
            user: updatedUser
        });
    } catch (err: any) {
        console.error("Role Update Error:", err);
        res.status(500).json({ error: "Failed to update role" });
    }
});

// DELETE User Route
router.delete('/users/:clerkId', fastAuth, isAdmin, async (req, res) => {
    try {
        const { clerkId } = req.params;

        // 1. Delete from Clerk (Auth)
        await clerkClient.users.deleteUser(clerkId);

        // 2. Delete from MongoDB (Database)
        const deletedUser = await User.findOneAndDelete({ clerkId });

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found in Database" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully from Clerk and DB" });
    } catch (err: any) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete user", details: err.message });
    }
});


// Order Management 
router.get('/orders', fastAuth, isAdmin, async (req, res) => {
    try {
        const orders = await Order.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'clerkId',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' }
        ]);

        res.status(200).json(orders);
    } catch (err: any) {
        console.error("Fetch Orders Error:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// GET /admin/orders/:orderId
router.get('/orders/:orderId',  async (req: any, res: any) => {
    try {
        const { orderId } = req.params;

        // Hum custom 'orderId' se find karenge
        // .lean() performance ke liye aur .populate() agar extra service data chahiye
        const order = await Order.findOne({ orderId }).populate('items.serviceId');

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
    } catch (err: any) {
        res.status(500).json({ error: "Fetch failed", details: err.message });
    }
});

// Get Eligible partner for service
router.get('/partners/eligible',  async (req, res) => {
    try {
        const city = req.query.city ? String(req.query.city) : "";
        const serviceName = req.query.service ? String(req.query.service) : "";

        if (!city || !serviceName) {
            return res.status(400).json({ message: "City and Service are required." });
        }
        const eligiblePartners = await Partner.find({
            specializations: { 
                $in: [new RegExp(`^${serviceName}$`, 'i')] 
            },
            serviceAreas: { 
                $in: [new RegExp(`^${city}$`, 'i')] 
            }
        }).select('name phone email serviceAreas');

        res.status(200).json(eligiblePartners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching partners for " + req.query.city });
    }
});

// update Order
router.patch('/orders/:orderId',  async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, partnerId } = req.body; 

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status !" });
        }

        let updateData: any = { status: status };
        
        if (status === 'confirmed') {
            if (!partnerId) {
                return res.status(400).json({ message: "Asign a partner to confirm this" });
            }
            updateData.assignedPartner = partnerId; 
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: updateData },
            { new: true }
        ).populate('assignedPartner'); 

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order database mein nahi mila" });
        }
        triggerOrderNotifications(updatedOrder, updatedOrder.assignedPartner);

        return res.status(200).json({
            success: true,
            message: status === 'confirmed' ? "Order assigned and confirmed!" : `Status updated to ${status}`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/orders/:orderId', fastAuth, isAdmin, async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ message: "Invalid orderID" });
        }
        const deletedOrder = await Order.findOneAndDelete({ orderId: orderId });
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found in DB" });
        }
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Internal server error", details: error });
    }
});

///////////////////////////////////////////// SERVICE ROUTES ////////////////////////////////////////////////
const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') 
        .replace(/\s+/g, '-')      
        .replace(/-+/g, '-');      
};

// 1. GET ALL (Admin view - usually needs more data)
router.get('/services', fastAuth, async (req, res) => {
    try {
        // Fetching everything so the admin table can show basePrice and pricingType
        const services = await Service.find({}).sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        console.error("Backend Fetch Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. CREATE Service (Updated for Variants)
router.post('/services', fastAuth, isAdmin, async (req, res) => {
    try {
        const { name, basePrice, pricingType, variants } = req.body;

        if (!name || !basePrice) {
            return res.status(400).json({ error: "Service name and base price are required" });
        }

        const slug = generateSlug(name);

        // We spread req.body to catch variants, unitName, and seo fields automatically
        const newService = new Service({
            ...req.body,
            slug: slug
        });

        await newService.save();
        res.status(201).json(newService);
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "A service with this name/slug already exists" });
        }
        res.status(500).json({ error: "Failed to create service", details: err.message });
    }
});

// 3. UPDATE Service (Updated for Variants)
router.patch('/services/:id', fastAuth, isAdmin, async (req, res) => {
    try {
        const updates = { ...req.body };

        // If the admin changes the name, we must update the slug too
        if (updates.name) {
            updates.slug = generateSlug(updates.name);
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updates, 
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.status(200).json(updatedService);
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Another service already uses this name/slug" });
        }
        res.status(500).json({ error: "Update failed", details: err.message });
    }
});

// 4. DELETE Service (Includes Cloudinary Cleanup)
router.delete('/services/:id', fastAuth, isAdmin, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        // Cloudinary cleanup logic
        if (service.image && service.image.includes('cloudinary')) {
            try {
                const urlParts = service.image.split('/');
                const lastPart = urlParts[urlParts.length - 1]; // "image_name.jpg"
                const publicId = lastPart.split('.')[0]; 
                
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudErr) {
                console.error("Cloudinary Delete Error:", cloudErr);
                // We continue deleting from DB even if Cloudinary fails
            }
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Service and associated image deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////


// 1. GET PARTNERS (With Search & Filter)
router.get('/partners', async (req, res) => {
    try {
        const search = req.query.search ? String(req.query.search) : "";
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');

            query = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                    { serviceAreas: { $regex: searchRegex } }, 
                    { specializations: { $regex: searchRegex } }
                ]
            };
        }

        const partners = await Partner.find(query).sort({ createdAt: -1 });
        
        res.json(partners);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Database fetch fail ho gaya bhai" });
    }
});

// 2. ADD PARTNER
router.post('/partners', async (req, res) => {
    try {
        const newPartner = new Partner(req.body);
        await newPartner.save();
        res.status(201).json({ success: true, partner: newPartner });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// 3. GET ALL SERVICE NAMES (For the Dropdown)
router.get('/service-list', async (req, res) => {
    try {
        const services = await Service.find({}, 'name'); // Sirf names chahiye
        res.json(services.map(s => s.name));
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// DELETE PARTNER
router.delete('/partners/:id', async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Partner deleted" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// UPDATE PARTNER (PATCH)
router.patch('/partners/:id', async (req, res) => {
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedPartner);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


///////// DASHBOARD ////////////////
router.get('/orders-recent',fastAuth, isAdmin, async (req, res) => {
    try {
        // console.log("Recent Orders")
        const recentOrders = await Order.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            
            // 3. Join with Users collection
            {
                $lookup: {
                    from: 'users',           
                    localField: 'userId',    
                    foreignField: 'clerkId', 
                    as: 'userDetails'
                }
            },
            
            // 4. Flatten the array and keep orders even if user is missing
            { 
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true 
                }
            }
        ]);

        res.status(200).json(recentOrders);
    } catch (err: any) {
        console.error("Dashboard Orders Error:", err);
        res.status(500).json([]); // Fallback to empty array
    }
});

// GET: Dashboard Stats (Revenue, Customers, etc.)
router.get('/dashboard-stats',fastAuth, isAdmin,async (req, res) => {
    try {
        const allOrders = await Order.find({});
        // console.log("Total Orders in DB:", allOrders.length);

        if (allOrders.length === 0) {
            return res.status(200).json({
                revenue: 0, activeOrders: 0, totalCustomers: 0, growthRate: "0%"
            });
        }

        // 2. Manual Calculation 
        let revenue = 0;
        let active = 0;
        const customerIds = new Set();

        allOrders.forEach(order => {
            if (order.status?.toLowerCase() === 'confirmed' || order.status?.toLowerCase() === 'completed') {
                revenue += parseFloat(order.totalAmount?.toString() || "0");
            }

            // Active: Pending ya Processing
            if (['pending', 'processing'].includes(order.status?.toLowerCase())) {
                active++;
            }

            // Customers
            if (order.userId) {
                customerIds.add(order.userId.toString());
            }
        });

        // console.log("Calculated Revenue:", revenue);
        // console.log("Calculated Active:", active);

        res.status(200).json({
            revenue: revenue,
            activeOrders: active,
            totalCustomers: customerIds.size,
            growthRate: "18.4%"
        });

    } catch (err: any) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: "Stats failed", details: err.message });
    }
});



export default router