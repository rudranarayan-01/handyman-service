import { sendWhatsAppMessage } from "./whatsapp_setup";

export const triggerBookingSuccess = async (order: any) => {
    const phone = order.customerDetails.phone; // Ensure it has '91' prefix
    
    const message = `
*HANDYMAN SERVICE PRO* 🛠️
--------------------------
✅ *BOOKING CONFIRMED*

Hi *${order.customerDetails.name}*, we've received your request!

📌 *Service:* ${order.items[0].name}
🔢 *Order ID:* #${order._id.toString().slice(-6).toUpperCase()}
⏰ *Scheduled:* ${new Date(order.bookingDate).toLocaleString()}
💰 *Total:* ₹${order.totalAmount}

_Our professional will call you 30 mins before arrival._
    `.trim();

    await sendWhatsAppMessage(phone, message);
};