import { verifyToken } from '@clerk/backend';

export const fastAuth = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "No token provided" });

        // Verification using your JWT Key
        const payload = await verifyToken(token, {
            jwtKey: process.env.CLERK_JWT_KEY, 
        });

        // We attach the userId AND the metadata (roles) to the request object
        req.auth = { 
            userId: payload.sub,
            metadata: payload.metadata // This comes from your Clerk JWT Template
        };
        
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Session" });
    }
};

// New professional middleware for Admin/Manager protection
export const isAdmin = (req: any, res: any, next: any) => {
    const role = req.auth?.metadata?.role;

    if (role === 'admin' || role === 'manager') {
        return next();
    }

    return res.status(403).json({ error: "Access Denied: Administrative privileges required" });
};