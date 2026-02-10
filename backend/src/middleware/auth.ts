import { verifyToken } from '@clerk/backend';

export const fastAuth = async (req: any, res: any, next: any) => {
    try {
        

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "No token provided" });

        // Fast local verification using your PEM key
        const payload = await verifyToken(token, {
            jwtKey: process.env.CLERK_JWT_KEY, 
        });

        req.auth = { userId: payload.sub };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Session" });
    }
};