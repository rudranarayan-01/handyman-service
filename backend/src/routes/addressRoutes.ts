import express from 'express';
import { User } from '../models/User';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.post('/add', async (req, res) => {
    try {
        const { clerkId, addressData } = req.body;
        // with using $push we push address data into User data
        const user = await User.findOneAndUpdate(
            { clerkId: clerkId },
            { $push: { addresses: addressData } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, allAddresses: user.addresses });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.put('/update/:clerkId/:addressId', async (req, res) => {
    try {
        const { clerkId, addressId } = req.params;
        const { updatedData } = req.body;

        // Agar user ne naya address default set kiya hai, toh baki sab false kar do
        if (updatedData.isDefault) {
            await User.updateOne(
                { clerkId },
                { $set: { "addresses.$[].isDefault": false } }
            );
        }

        const user = await User.findOneAndUpdate(
            { clerkId, "addresses._id": addressId }, // Address ki auto-generated ID search kar rahe hain
            { 
                $set: { 
                    "addresses.$": { ...updatedData, _id: addressId } 
                } 
            },
            { new: true }
        );

        res.status(200).json({ success: true, addresses: user?.addresses });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// 3. DELETE ADDRESS
router.delete('/delete/:clerkId/:addressId', async (req, res) => {
    try {
        const { clerkId, addressId } = req.params;

        const user = await User.findOneAndUpdate(
            { clerkId },
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );

        res.status(200).json({ success: true, addresses: user?.addresses });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router