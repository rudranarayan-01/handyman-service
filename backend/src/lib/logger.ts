import { clerkClient } from '@clerk/express';
import AuditLog from '../models/AuditLog';
import { Request } from 'express';

/**
 * 🔹 Extract real client IP (Production Safe)
 */
const getClientIp = (req: Request): string => {
    const xForwardedFor = req.headers['x-forwarded-for'];

    if (xForwardedFor) {
        if (typeof xForwardedFor === 'string') {
            return xForwardedFor.split(',')[0].trim();
        }
        if (Array.isArray(xForwardedFor)) {
            return xForwardedFor[0];
        }
    }

    // Fallback chain
    const ip =
        req.ip ||
        req.socket?.remoteAddress ||
        (req.connection as any)?.remoteAddress ||
        '';

    // Normalize IPv6 localhost (::1 → 127.0.0.1)
    if (ip === '::1') return '127.0.0.1';

    // Remove IPv6 prefix if present (::ffff:127.0.0.1)
    if (ip?.startsWith('::ffff:')) {
        return ip.replace('::ffff:', '');
    }

    return ip || '127.0.0.1';
};

/**
 * 🔹 Main Logger
 */
export const logEvent = async (
    req: Request,
    data: {
        title: string;
        desc: string;
        module: string;
        status?: 'success' | 'failure' | 'warning';
    }
) => {
    try {
        const clerkId = (req as any).auth?.userId;

        let email = (req as any).userEmail;
        let username = (req as any).userName;

        // 🔹 Fetch from Clerk if missing
        if (!email && clerkId) {
            const user = await clerkClient.users.getUser(clerkId);

            email = user.emailAddresses?.[0]?.emailAddress;

            username =
                user.username ||
                `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                'Admin';
        }

        const ipAddress = getClientIp(req);

        const log = new AuditLog({
            title: data.title,
            description: data.desc,
            module: data.module,
            status: data.status || 'success',

            performer: {
                clerkId: clerkId || 'system_internal',
                email: email || 'system@housexpertz.com',
                username: username || 'System',
            },

            ipAddress,
            userAgent: req.headers['user-agent'] || 'Unknown',
        });

        await log.save();

    } catch (err) {
        console.error('Audit Log Storage Failed:', err);
    }
};

/**
 * 🔹 Fetch Logs with Filters
 */
export const fetchLogs = async (
    filter: {
        module?: string;
        status?: string;
        performerClerkId?: string;
    } = {}
) => {
    try {
        const query: any = {};

        if (filter.module) query.module = filter.module;
        if (filter.status) query.status = filter.status;
        if (filter.performerClerkId)
            query['performer.clerkId'] = filter.performerClerkId;

        return await AuditLog.find(query).sort({ createdAt: -1 });

    } catch (err) {
        console.error('Failed to fetch audit logs:', err);
        throw err;
    }
};