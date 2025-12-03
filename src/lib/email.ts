import axios from "axios";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailError {
  response?: {
    data?: unknown;
  };
  message: string;
}

interface TicketEmailData {
  customerName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  quantity: number;
  totalPrice: number;
  reference: string;
  phone: string;
  // optional fields to better match receipt UI
  image?: string;
  paidAt?: string;
}

// Send ticket confirmation email to customer via Brevo
export const sendTicketConfirmationEmail = async (
  to: string,
  data: TicketEmailData
): Promise<boolean> => {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      console.error("Brevo API key or sender email is not configured.");
      return false;
    }

    const formattedPaidAt = data.paidAt
      ? new Date(data.paidAt).toLocaleString("en-NG", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "Africa/Lagos",
        })
      : "";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Receipt</title>
  </head>

  <body style="margin:0;padding:0;background:#faf9f7;font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf9f7;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #eee;">

            <!-- Header -->
            <tr>
              <td style="text-align:center;padding-bottom:24px;">
                <div style="font-size:32px;font-weight:700;color:#2c2c2c;">NYE Bash</div>
                <div style="font-size:14px;color:#777;margin-top:4px;">Luxury • Elegance • Craft</div>
              </td>
            </tr>

            <!-- Success Icon -->
            <tr>
              <td style="text-align:center;font-size:48px;padding-bottom:12px;">🧾</td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="text-align:center;font-size:24px;font-weight:600;color:#2c2c2c;padding-bottom:8px;">
                Payment Receipt
              </td>
            </tr>

            <!-- Subtitle -->
            <tr>
              <td style="text-align:center;font-size:15px;color:#555;padding-bottom:24px;">
                Thank you for your purchase. Your payment has been successfully processed.
              </td>
            </tr>

            <!-- Receipt Box -->
            <tr>
              <td style="background:#fafafa;border:1px solid #eee;border-radius:12px;padding:24px 15px 24px 15px;">
                
                <!-- Date -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  📅 <strong>Date:</strong> ${data.eventDate}
                </div>

                <!-- Time -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  🕐 <strong>Time:</strong> ${data.eventTime}
                </div>

                <!-- Reference -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  🧾 <strong>Reference:</strong> ${data.reference}
                </div>

                <!-- Email -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  📧 <strong>Email:</strong> ${to}
                </div>

                <!-- Name -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  👤 <strong>Name:</strong> ${data.customerName}
                </div>

                <!-- Phone -->
                <div style="font-size:14px;color:#333;margin-bottom:12px;">
                  📱 <strong>Phone:</strong> ${data.phone}
                </div>

                <!-- Amount -->
                <div style="font-size:16px;font-weight:600;color:#000;margin-top:20px;">
                  💰 Amount Paid: ₦${data.totalPrice.toLocaleString()}
                </div>

              </td>
            </tr>
            
           <!-- Important Info Box (added) -->
            <tr>
              <td style="padding-top:18px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff6db;border:1px solid #f1d48a;border-radius:10px;padding:16px;">
                  <tr>
                    <td style="font-size:17px;font-weight:600;color:#8a6b00;padding-bottom:8px;">
                      📌 Important Information
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:14px;color:#8a6b00;line-height:1.5;">
                      <ul style="margin:0;padding-left:18px;">
                        <li style="margin:6px 0;">Please bring this email or your reference number to the event</li>
                        <li style="margin:6px 0;">Check-in begins 30 minutes before the event start time</li>
                        <li style="margin:6px 0;">This receipt serves as proof of purchase</li>
                        <li style="margin:6px 0;">Click view full receipt and then download the full receipt </li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
  <td align="center" style="padding-top: 24px;">
    <a 
      href="${process.env.NEXT_PUBLIC_BASE_URL}/receipt/${data.reference}"
      style="
        display:inline-block;
        background:#8b6914;
        padding:12px 28px;
        border-radius:8px;
        color:#fff !important;
        text-decoration:none;
        font-size:14px;
        font-weight:600;
      "
    >
      view Full Receipt
    </a>
  </td>
</tr>


            <!-- Footer -->
            <tr>
              <td style="text-align:center;font-size:13px;color:#999;padding-top:24px;">
                If you have any questions, contact us anytime.
              </td>
            </tr>

            <tr>
              <td style="text-align:center;font-size:13px;color:#555;padding-top:6px;">
                © NYE Bash. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

        `;

    const textContent = `
Ticket Confirmed!

Dear ${data.customerName},

Thank you for purchasing tickets for ${data.eventTitle}.

Event Details:
- Event: ${data.eventTitle}
- Date: ${data.eventDate}
- Time: ${data.eventTime}
- Venue: ${data.eventVenue}
- Tickets: ${data.quantity}
- Total Paid: ₦${data.totalPrice.toLocaleString()}

Reference Number: ${data.reference}

Please save this reference number and bring it to the event for check-in.

See you at the event!

NYE Bash Team
        `;
    // Append phone and paidAt to plain text version if available
    const extraLines = [] as string[];
    if (data.phone) extraLines.push(`Phone: ${data.phone}`);
    if (formattedPaidAt) extraLines.push(`Paid At: ${formattedPaidAt}`);
    let finalTextContent = textContent;
    if (extraLines.length) {
      // insert before closing message
      const insertIndex = textContent.lastIndexOf("\n\nNYE Bash Team");
      const newText =
        textContent.slice(0, insertIndex) +
        "\n" +
        extraLines.join("\n") +
        textContent.slice(insertIndex);
      finalTextContent = newText;
    }

    const response = await axios({
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      data: {
        sender: {
          name: "NYE Bash",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: to,
            name: data.customerName,
          },
        ],
        subject: `Your Tickets for ${data.eventTitle} - ${data.reference}`,
        htmlContent: htmlContent,
        textContent: finalTextContent,
      },
    });

    console.log("Ticket confirmation email sent successfully:", response.data);
    return true;
  } catch (error) {
    const emailError = error as EmailError;
    console.error(
      "Error sending ticket email:",
      emailError.response?.data || emailError.message
    );
    return false;
  }
};

// Send admin notification via Resend
export const sendAdminNotification = async (
  eventTitle: string,
  customerName: string,
  customerEmail: string,
  quantity: number,
  totalPrice: number,
  reference: string
): Promise<boolean> => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.error("Admin email is not configured.");
      return false;
    }

    const adminEmails = [process.env.ADMIN_EMAIL];
    // if (process.env.ADMIN_EMAIL2) {
    //     adminEmails.push(process.env.ADMIN_EMAIL2)
    // }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .alert { background: #8b6914; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .details { background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; gap: 5px; align-items: center; }
        .row:last-child { border-bottom: none; }
        .label { color: #6b7280; }
        .value { font-weight: 600; }
        .total { font-size: 20px; color: #10b981; font-weight: 700; text-align: right; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert">
            <h1 style="margin: 0;">🎉 New Ticket Sale!</h1>
        </div>
        <div class="details">
            <h2 style="margin-top: 0;">Purchase Details</h2>
            <div class="row">
                <span class="label">Event:  &nbsp;</span>
                <span class="value">${eventTitle}</span>
            </div>
            <div class="row">
                <span class="label">Customer: &nbsp;</span>
                <span class="value">${customerName}</span>
            </div>
            <div class="row">
                <span class="label">Email: &nbsp;</span>
                <span class="value">${customerEmail}</span>
            </div>
            <div class="row">
                <span class="label">Tickets: &nbsp;</span>
                <span class="value">${quantity}</span>
            </div>
            <div class="row">
                <span class="label">Reference: &nbsp;</span>
                <span class="value" style="font-family: monospace;">${reference}</span>
            </div>
            <div class="total">
                Total: ₦${totalPrice.toLocaleString()}
            </div>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Notification sent at ${new Date().toLocaleString("en-NG", {
              timeZone: "Africa/Lagos",
            })}
        </p>
    </div>
</body>
</html>
        `;

    const { error } = await resend.emails.send({
      from: "NYE Bash <ticket@resend.dev>",
      to: adminEmails,
      subject: `🎟️ New Ticket Purchase - ${eventTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending admin notification:", error);
      return false;
    }

    console.log(
      "Admin notification sent successfully to:",
      adminEmails.join(", ")
    );
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
};
