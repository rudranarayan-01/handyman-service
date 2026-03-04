import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal'; // Ensure this is imported correctly
import pino from 'pino';

// Using 'any' for the socket to avoid complex type casting issues during setup
let sock: any = null;

export async function connectToWhatsApp() {
    // 1. Setup Auth State (saves login info in 'auth_info' folder)
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    // 2. Fetch latest WA version to prevent "Outdated" errors
    const { version } = await fetchLatestBaileysVersion();

    // 3. Initialize Socket
    sock = makeWASocket({
        version,
        auth: state,
        // logger: pino({ level: 'silent' }), // Hide messy internal logs
        logger: pino({ level: 'error' }), // ONLY log errors in production
        browser: ["Handyman Service", "Chrome", "1.0.0"] // Shows up in your "Linked Devices" on phone
        // printQRInTerminal: true, // REMOVED as per deprecation warning
    });

    // 4. Listen for Credentials Update (crucial for staying logged in)
    sock.ev.on('creds.update', saveCreds);

    // 5. THE FIX: Handle the QR code and Connection manually
    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        // If a QR code is generated, display it manually
        if (qr) {
            console.log('\n┌──────────────────────────────────────────────┐');
            console.log('│  HANDYMAN PRO: SCAN THIS QR WITH WHATSAPP    │');
            console.log('└──────────────────────────────────────────────┘\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            // console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('\n✅ SUCCESS: Handyman WhatsApp Bot is Live!\n');
        }
    });
}

/**
 * Call this function from your order controller
 */
export const sendWhatsAppMessage = async (phone: string, message: string) => {
    if (!sock) return console.error("WhatsApp not connected");

    try {
        const jid = `${phone.replace(/\D/g, '')}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        // console.log(`✓ Message sent to ${phone}`);
    } catch (err) {
        console.error("Failed to send message:", err);
    }
};