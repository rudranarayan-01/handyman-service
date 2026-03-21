import { verifyToken } from '@clerk/backend';
import { User } from '../models/User';

// ✅ In-memory cache — no DB call on repeat requests
const userCache = new Map<string, { role: string; cachedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const fastAuth = async (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "No token" });

        const token = authHeader.split(' ')[1];

        // ✅ Step 1: Local JWT verify (instant, no network)
        const payload = await verifyToken(token, {
            jwtKey: process.env.CLERK_JWT_KEY,
        });

        const clerkId = payload.sub;

        // ✅ Step 2: Check cache first before hitting MongoDB
        const cached = userCache.get(clerkId);
        const now = Date.now();

        if (cached && (now - cached.cachedAt) < CACHE_TTL) {
            // Cache hit — skip DB entirely
            req.auth = { userId: clerkId, role: cached.role };
            return next();
        }

        // ✅ Step 3: Only hits DB if not cached or cache expired
        const dbUser = await User.findOne({ clerkId }).lean(); // .lean() = faster

        if (!dbUser) {
            return res.status(404).json({ error: "User not synced" });
        }

        // Store in cache
        userCache.set(clerkId, { role: dbUser.role, cachedAt: now });

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

export const AdminProtected = (req:any, res:any, next:any) => {
    const role = req.auth?.role;
    if (role ==='admin') {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized" });
};


// ✅ Call this if a user's role changes so cache updates immediately
export const clearUserCache = (clerkId: string) => {
    userCache.delete(clerkId);
};