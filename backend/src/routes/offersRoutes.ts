import express from 'express';
import { Offer } from '../models/Offers';

const router = express.Router();

// POST /api/offers/validate
router.post('/validate', async (req, res) => {
    const { code, cartTotal } = req.body;
    try {
        const offer = await Offer.findOne({ code, isActive: true });
        if (!offer) return res.status(404).json({ message: "Invalid or expired coupon" });
        if (new Date() > offer.expiryDate) {
            return res.status(400).json({ message: "Coupon has expired" });
        }
        if (cartTotal < offer.minOrderAmount) {
            return res.status(400).json({ message: `Min. order for this is ₹${offer.minOrderAmount}` });
        }

        let discount = 0;
        if (offer.discountType === 'percentage') {
            discount = (cartTotal * offer.discountValue) / 100;
            if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);
        } else {
            discount = offer.discountValue;
        }

        res.json({ 
            success: true, 
            discountAmount: discount, 
            finalTotal: cartTotal - discount,
            message: "Coupon applied successfully!" 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;