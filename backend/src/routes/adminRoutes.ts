import express from 'express';
// IMPORTANT: Use curly braces here!
import { fastAuth, isAdmin } from '../middleware/auth';
import { User } from '../models/User';
import { createClerkClient } from '@clerk/backend';
import { Order } from '../models/Orders';
import { Service } from '../models/Service';
import { Partner } from '../models/Partners';
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const router = express.Router();

// Get all users for admin Dashboard
router.get('/users', fastAuth, isAdmin, async (req: any, res: any) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
        console.log("User fetched")
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
router.get('/orders/:orderId', fastAuth, isAdmin, async (req: any, res: any) => {
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
router.get('/partners/eligible', async (req, res) => {
    try {
        const fullAddress = req.query.area ? String(req.query.area) : "";
        const serviceName = req.query.service ? String(req.query.service) : "";

        if (!fullAddress || !serviceName) {
            return res.status(400).json({ message: "Area and Service are required." });
        }

        const partners = await Partner.find({
            specializations: { $in: [new RegExp(serviceName, 'i')] }
        }).select('name phone email serviceAreas');

        const filteredPartners = partners.filter(partner => {
            return partner.serviceAreas.some(area => 
                fullAddress.toLowerCase().includes(area.toLowerCase())
            );
        });

        res.status(200).json(filteredPartners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Partners fetch karne mein dikat hui" });
    }
});

// update Order
router.patch('/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, partnerId } = req.body; 

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Bhai, ye status invalid hai!" });
        }

        // --- FIX START ---
        // Humne yahan 'any' type de diya taaki hum dynamic properties add kar sakein
        let updateData: any = { status: status };
        
        if (status === 'confirmed') {
            if (!partnerId) {
                return res.status(400).json({ message: "Confirm karne ke liye partner assign karna zaruri hai!" });
            }
            updateData.assignedPartner = partnerId; // Ab yahan error nahi aayega
        }
        // --- FIX END ---

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: updateData },
            { new: true }
        ).populate('assignedPartner'); 

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order database mein nahi mila" });
        }

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

router.delete('/orders/:orderId', async (req, res) => {
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

// SERVICE ROUTES 
router.get('/services', fastAuth, isAdmin, async (req, res) => {
    try {
        const services = await Service.find({}).sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        console.error("Backend Fetch Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/services', fastAuth, isAdmin, async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ error: "Failed to create service" });
    }
});

// UPDATE Service
router.patch('/services/:id', fastAuth, isAdmin, async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedService);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});



// DELETE Service
router.delete('/services/:id', fastAuth, isAdmin, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
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

        // Check if data exists at all (Debug step)
        const partners = await Partner.find(query).sort({ createdAt: -1 });
        
        // Bhai, agar empty array aa raha hai toh search logic loose karo 
        // ya check karo DB mein 'serviceAreas' field ka naam exact yahi hai na?
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


module.exports = router;