import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async (userEmail: string, orderDetails: any) => {
  try {
    await resend.emails.send({
      from: 'Acme <delivered@resend.dev>', // Use your verified domain here later
      to: userEmail,
      subject: 'Booking Confirmed!',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Booking Successfully Placed!</h2>
          <p>Order ID: <strong>${orderDetails._id}</strong></p>
          <hr />
          <h3>Items Booked:</h3>
          <ul>
            ${orderDetails.items.map((item: any) => `<li>${item.name} - ₹${item.price}</li>`).join('')}
          </ul>
          <p><strong>Total Amount: ₹${orderDetails.totalAmount}</strong></p>
          <p>Date: ${new Date(orderDetails.bookingDate).toLocaleString()}</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Email failed to send:", error);
  }
};