import { verifyToken } from '@clerk/backend';
import { User } from '../models/User';

export const fastAuth = async (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "No token" });

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token, {
            jwtKey: process.env.CLERK_JWT_KEY, 
        });

        const clerkId = payload.sub;

        // Source of truth: MongoDB
        const dbUser = await User.findOne({ clerkId });

        if (!dbUser) {
            return res.status(404).json({ error: "User not synced" });
        }

        req.auth = { 
            userId: clerkId,
            role: dbUser.role 
        };
        
        next();
    } catch (err) {
        console.error("Auth Error:", err);
        res.status(401).json({ error: "Invalid Session" });
    }
};

export const isAdmin = (req: any, res: any, next: any) => {
    const role = req.auth?.role;
    if (role === 'admin' || role === 'manager') {
        return next();
    }
    return res.status(403).json({ error: "Access Denied" });
};