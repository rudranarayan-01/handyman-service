import nodemailer from 'nodemailer';

// This only contains Booking confirmation


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASS,
    },
});

export const sendOrderEmail = async (userEmail: string, orderDetails: any) => {
    try {
        const { _id, items, totalAmount, bookingDate } = orderDetails;

        const fullOrderId = _id?.toString() || "PENDING";
        const displayId = fullOrderId.slice(-6).toUpperCase();

        const formattedDate = new Date(bookingDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 2. Define Mail Options
        const mailOptions = {
            from: `"Homexpertz Service Pro" <${process.env.GMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed! Order #${displayId}`,
            html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f9; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                
                <div style="background-color: #0f172a; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">Homexpertz Service Pro</h1>
                </div>

                <div style="background-color: #2563eb; padding: 40px 30px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">✓</span>
                    </div>
                    <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Booking Confirmed!</h2>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">We've received your request and are on it.</p>
                </div>
                
                <div style="padding: 40px; color: #1e293b;">
                    <div style="margin-bottom: 30px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px;">
                        <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Order Reference</p>
                        <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 18px; font-weight: 700; color: #0f172a;">#${fullOrderId}</p>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; color: #94a3b8; font-size: 11px; text-transform: uppercase; padding-bottom: 15px;">Selected Service</th>
                                <th style="text-align: right; color: #94a3b8; font-size: 11px; text-transform: uppercase; padding-bottom: 15px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((item: any) => `
                                <tr>
                                    <td style="padding: 15px 0; border-top: 1px solid #f1f5f9; font-size: 15px; font-weight: 600; color: #334155;">${item.name}</td>
                                    <td style="padding: 15px 0; border-top: 1px solid #f1f5f9; text-align: right; font-size: 15px; font-weight: 700; color: #0f172a;">₹${item.price}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding-top: 25px; font-size: 16px; font-weight: 800; color: #0f172a;">Total Payable</td>
                                <td style="padding-top: 25px; text-align: right; font-size: 24px; font-weight: 900; color: #2563eb;">₹${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 25px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px;">Booking Date & Time</p>
                        <p style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a;">${formattedDate}</p>
                    </div>
                </div>
                
                <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                    <p style="color: #475569; font-size: 11px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                        Homexpertz Service Pro • Quality Guaranteed
                    </p>
                </div>
            </div>
        </div>
      `
        };

        // 3. Send the Email
        await transporter.sendMail(mailOptions);
        console.log(`Nodemailer: Email successfully sent for Order: ${fullOrderId}`);
    } catch (error) {
        console.error("Nodemailer CRITICAL Error:", error);
    }
};