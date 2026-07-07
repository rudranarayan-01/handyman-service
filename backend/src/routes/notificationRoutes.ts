import express, { Response } from 'express';
import { Expo, ExpoPushMessage } from 'expo-server-sdk'; 
import PushToken from '../models/PushToken';

const router = express.Router();

// Initialize the Expo SDK client instance
const expo = new Expo();

// local authenticated request interface extension
interface AuthenticatedRequest extends express.Request {
    auth?: {
        userId: string;
    };
}

/**
 * @route   POST /api/notifications/register-token
 * @desc    Save or update an Expo Push Token for an authenticated user
 */
router.post('/register-token', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { token, platform } = req.body;
        const clerkId = req.auth?.userId;

        if (!clerkId) {
            return res.status(401).json({ error: "Unauthorized: Missing user authentication" });
        }

        if (!token || !token.startsWith('ExponentPushToken')) {
            return res.status(400).json({ error: "Invalid token format. Must be a valid Expo Push Token." });
        }

        const updatedTokenRecord = await PushToken.findOneAndUpdate(
            { expoPushToken: token },
            {
                clerkId: clerkId,
                devicePlatform: platform || 'unknown'
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Push token registered successfully",
            data: {
                id: updatedTokenRecord._id,
                platform: updatedTokenRecord.devicePlatform
            }
        });

    } catch (error: any) {
        console.error("Push Token Registration Error:", error);
        return res.status(500).json({ error: "Internal Server Error updating notification tokens" });
    }
});

/**
 * @route   POST /api/notifications/deregister-token
 * @desc    Remove a token when a user logs out manually
 */
router.post('/deregister-token', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: "No token provided for deregulation" });
        }

        await PushToken.deleteOne({ expoPushToken: token });

        return res.status(200).json({
            success: true,
            message: "Token detached and removed safely."
        });
    } catch (error) {
        console.error("Deregister Token Error:", error);
        return res.status(500).json({ error: "Internal Server Error details hidden" });
    }
});

/**
 * @route   POST /api/notifications/send
 * @desc    Dispatches push payloads via Expo to a single target user, or broadcasts globally
 */
router.post('/send', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { targetClerkId, title, body, data } = req.body;

        // 1. Core structural payload validation
        if (!title || !body) {
            return res.status(400).json({ error: "Title and Body are required fields." });
        }

        // 2. Locate matching notification receivers
        // If targetClerkId is omitted in the body request, it turns into a global broadcast
        const query = targetClerkId ? { clerkId: targetClerkId } : {}; 
        const tokenRecords = await PushToken.find(query);

        if (tokenRecords.length === 0) {
            return res.status(404).json({ error: "No registered push tokens found for target context." });
        }

        // 3. Construct array of raw target objects
        const messages: ExpoPushMessage[] = [];
        for (const record of tokenRecords) {
            if (!Expo.isExpoPushToken(record.expoPushToken)) {
                console.error(`Invalid Expo token skipped: ${record.expoPushToken}`);
                continue;
            }

            messages.push({
                to: record.expoPushToken,
                sound: 'default',
                title: title,
                body: body,
                data: data || { type: "GENERAL_UPDATE" }, // App context tracking data payload
                badge: 1
            });
        }

        // 4. Batch items into chunks to conform with Expo infrastructure limits
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error("Error dispatching chunk batch:", error);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Dispatched payloads successfully to ${tickets.length} devices.`,
            tickets
        });

    } catch (error: any) {
        console.error("Fatal Notification Broadcast Error:", error);
        return res.status(500).json({ error: "Internal transmission layer exception." });
    }
});

export default router;