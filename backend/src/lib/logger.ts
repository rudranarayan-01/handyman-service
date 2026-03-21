import { clerkClient } from '@clerk/express';
import AuditLog from '../models/AuditLog';
import { Request } from 'express';
// import { clerkClient } from '@clerk/clerk-sdk-node'; // Ensure you have this imported

export const logEvent = async (
    req: Request,
    data: { 
        title: string; 
        desc: string; 
        module: string; 
        status?: 'success' | 'failure' | 'warning' 
    }
) => {
    try {
        const clerkId = (req as any).auth?.userId;
        
        // If the email/username isn't on the request, fetch it from Clerk
        let email = (req as any).userEmail;
        let username = (req as any).userName;

        if (!email && clerkId) {
            const user = await clerkClient.users.getUser(clerkId);
            email = user.emailAddresses[0]?.emailAddress;
            username = user.username || `${user.firstName} ${user.lastName}`.trim() || "Admin";
        }

        const log = new AuditLog({
            title: data.title,
            description: data.desc,
            module: data.module,
            status: data.status || 'success',
            performer: {
                clerkId: clerkId || 'system_internal',
                email: email || 'system@housexpertz.com', 
                username: username || 'System'
            },
            // IP & User Agent for security auditing
            ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
            userAgent: req.headers['user-agent']
        });

        await log.save();
    } catch (err) {
        // We console.error but don't throw, so the main app logic doesn't crash if logging fails
        console.error("Critical: Audit Log Storage Failed:", err);
    }
};

export const fetchLogs = async (filter: { module?: string; status?: string; performerClerkId?: string } = {}) => {
    try {
        const query: any = {};
        if (filter.module) query.module = filter.module;
        if (filter.status) query.status = filter.status;
        if (filter.performerClerkId) query['performer.clerkId'] = filter.performerClerkId;
        return await AuditLog.find(query).sort({ createdAt: -1 });
    } catch (err) {
        console.error("Failed to fetch audit logs:", err);
        throw err;
    }
};
