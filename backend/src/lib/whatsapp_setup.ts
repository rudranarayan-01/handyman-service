import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';
import pino from 'pino';
import dns from 'node:dns';

// CRITICAL: Force IPv4 to bypass the ETIMEDOUT / 408 errors
dns.setDefaultResultOrder('ipv4first');

let sock: any = null;
let isReady = false;

export async function connectToWhatsApp() {
    console.log('🔄 Initializing WhatsApp Bot (Resilient Mode)...');

    // 1. Auth State with Signal Key Store (Highly Recommended for stability)
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        // Pinned version known for 2026 stability
        version: [2, 3000, 1015901307],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'error' })),
        },
        logger: pino({ level: 'error' }),
        
        // 2. Use a Desktop signature to reduce "408" and "405" connection drops
        browser: Browsers.macOS('Desktop'), 

        // 3. Robust Connection Parameters
        connectTimeoutMs: 120000, // 2 minutes to allow for slow handshakes
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000, // Frequent pings to prevent the socket from idling
        
        // Disable history sync to stop massive data transfers that trigger timeouts
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n--- SCAN THIS QR CODE ---');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            isReady = false;
            const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
            
            // 408 = Timeout, 503 = Unavailable. Both should trigger a reconnect.
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.error(`📡 Connection Closed. Status: ${statusCode}. Reconnecting: ${shouldReconnect}`);
            
            if (shouldReconnect) {
                // Wait 10 seconds before retrying to avoid "too many attempts"
                setTimeout(() => connectToWhatsApp(), 10000);
            } else {
                console.log('🛑 Logged out. Delete "auth_info_baileys" and re-scan.');
            }
        } else if (connection === 'open') {
            isReady = true;
            console.log('\n✅ SUCCESS: Homexpertz Bot is Linked & Active!\n');
        }
    });
}

/**
 * Clean & Format Mobile Number for WhatsApp
 */
export const sendWhatsAppMessage = async (phone: string, message: string) => {
    if (!isReady) return console.error("❌ Bot not connected.");
    
    try {
        let cleanNumber = phone.replace(/\D/g, '');
        if (cleanNumber.length === 10) cleanNumber = `91${cleanNumber}`;
        
        const jid = `${cleanNumber}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        console.log(`✉️ Message sent to: ${cleanNumber}`);
    } catch (err) {
        console.error("❌ Failed to send:", err);
    }
};