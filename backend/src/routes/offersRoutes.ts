import express from 'express';
import { Offer } from '../models/Offers';

const router = express.Router();

// ─── USER SIDE ROUTES ──────────────────────────────────────────────────

/**
 * @route   GET /api/offers/available
 * @desc    Get all active, non-expired offers for the user (Zomato-style list)
 *
**/ 

router.get('/available', async (req, res) => {
    try {
        const now = new Date();
        
        const offers = await Offer.find({
            isActive: true,
            expiryDate: { $gt: now }, // Must be in the future
            $or: [
                { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
                { usageLimit: { $exists: false } } // Handle documents without limits
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            offers: offers || [] 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching offers" });
    }
});

/**
 * @route   POST /api/offers/validate
 * @desc    Validate a coupon code and calculate discount
 */
router.post('/validate', async (req, res) => {
    const { code, cartTotal } = req.body;

    try {
        // Find offer (Case-insensitive search)
        const offer = await Offer.findOne({ 
            code: code.toUpperCase(), 
            isActive: true 
        });

        if (!offer) {
            return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });
        }

        // 1. Expiry Check
        if (new Date() > offer.expiryDate) {
            return res.status(400).json({ success: false, message: "This coupon has expired" });
        }

        // 2. Usage Limit Check
        if (offer.usedCount >= offer.usageLimit) {
            return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
        }

        // 3. Minimum Order Check
        if (cartTotal < offer.minOrderAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Add ₹${offer.minOrderAmount - cartTotal} more to use this offer` 
            });
        }

        // 4. Calculate Discount Logic
        let discount = 0;
        if (offer.discountType === 'percentage') {
            discount = (cartTotal * offer.discountValue) / 100;
            // Apply cap if maxDiscount exists
            if (offer.maxDiscount && discount > offer.maxDiscount) {
                discount = offer.maxDiscount;
            }
        } else {
            // Flat discount
            discount = offer.discountValue;
        }

        // Ensure discount doesn't exceed cart total (safety check)
        discount = Math.min(discount, cartTotal);

        res.json({ 
            success: true, 
            discountAmount: Math.round(discount), 
            finalTotal: Math.round(cartTotal - discount),
            couponCode: offer.code,
            message: "Coupon applied successfully!" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ─── ADMIN SIDE ROUTES ─────────────────────────────────────────────────

/**
 * @route   GET /api/offers/admin/all
 * @desc    Get ALL offers including inactive/expired for Admin Panel
 */
router.get('/all', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.json({ success: true, offers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all offers" });
    }
});

/**
 * @route   POST /api/offers/create
 * @desc    Create a new offer
 */
router.post('/create', async (req, res) => {
    try {
        const { code } = req.body;
        const existing = await Offer.findOne({ code: code.toUpperCase() });
        
        if (existing) {
            return res.status(400).json({ success: false, message: "Offer code already exists" });
        }

        const offer = new Offer({
            ...req.body,
            code: code.toUpperCase() // Ensure codes are always uppercase
        });

        await offer.save();
        res.status(201).json({ success: true, offer });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
});

/**
 * @route   PATCH /api/offers/update/:id
 * @desc    Update offer details or toggle isActive
 */
router.patch('/update/:id', async (req, res) => {
    try {
        // If updating code, ensure it is uppercase
        if (req.body.code) req.body.code = req.body.code.toUpperCase();

        const offer = await Offer.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
        
        res.json({ success: true, offer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating offer" });
    }
});

/**
 * @route   DELETE /api/offers/delete/:id
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);   
        if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });
        res.json({ success: true, message: "Offer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting offer" });
    }
});

/**
 * @route   GET /api/offers/stats/:id
 * @desc    Quick stats for a specific coupon (Admin)
 */
router.get('/stats/:id', async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });

        const usagePercentage = (offer.usedCount / offer.usageLimit) * 100;
        res.json({ 
            success: true, 
            stats: {
                totalUsage: offer.usedCount,
                remaining: offer.usageLimit - offer.usedCount,
                usagePercentage: usagePercentage.toFixed(2) + "%"
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching stats" });
    }
});

export default router;