import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@propelusai.com';
const EMAIL_TO = process.env.EMAIL_TO || 'support@propelusai.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions, retries = 2): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('Email not sent - SendGrid not configured');
    return false;
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await sgMail.send({
        from: EMAIL_FROM,
        to: recipients,
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      });

      return true;
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : JSON.stringify(err);
      console.error(`Email attempt ${attempt + 1} failed: ${errMsg}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  return false;
}

export async function sendContactNotification(data: {
  full_name: string;
  email: string;
  company_name?: string;
  country: string;
  scheduled_time: string;
  description?: string;
}): Promise<boolean> {
  await sendEmail({
    to: EMAIL_TO,
    subject: `New Contact - ${data.full_name}`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
    <tr><td style="background:#0d0d1a;padding:24px 32px"><h2 style="margin:0;color:#fff;font-size:20px">New Contact Submission</h2></td></tr>
    <tr><td style="padding:28px 32px">
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#1a1a2e">
        <tr><td style="color:#6b6b7b;width:140px">Name</td><td><strong>${data.full_name}</strong></td></tr>
        <tr><td style="color:#6b6b7b">Email</td><td><a href="mailto:${data.email}" style="color:#635bff">${data.email}</a></td></tr>
        ${data.company_name ? `<tr><td style="color:#6b6b7b">Company</td><td>${data.company_name}</td></tr>` : ''}
        <tr><td style="color:#6b6b7b">Country</td><td>${data.country}</td></tr>
        <tr><td style="color:#6b6b7b">Scheduled</td><td>${new Date(data.scheduled_time).toLocaleString()}</td></tr>
        ${data.description ? `<tr><td style="color:#6b6b7b;vertical-align:top">Description</td><td>${data.description}</td></tr>` : ''}
      </table>
    </td></tr>
  </table>
</body></html>`,
  });

  return sendEmail({
    to: data.email,
    subject: `Thanks for reaching out, ${data.full_name}! - PropelusAI`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
        <tr>
          <td style="background:linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 50%,#222240 100%);padding:36px 40px;text-align:center">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600">We've Received Your Request!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px">
            <p style="margin:0 0 18px;color:#1a1a2e;font-size:16px;line-height:1.7">Hi <strong>${data.full_name}</strong>,</p>
            <p style="margin:0 0 18px;color:#4a4a5a;font-size:15px;line-height:1.7">
              Thank you for getting in touch. Our team has received your inquiry and we'll respond within <strong>24 hours</strong> (enterprise clients within 4 hours).
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7ff;border-radius:10px;padding:20px;margin-bottom:24px">
              <tr><td style="padding:16px 20px">
                <p style="margin:0 0 8px;font-size:13px;color:#6b6b7b;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Your Details</p>
                <p style="margin:0 0 4px;font-size:14px;color:#1a1a2e">Preferred time: <strong>${new Date(data.scheduled_time).toLocaleString()}</strong></p>
                ${data.company_name ? `<p style="margin:0 0 4px;font-size:14px;color:#1a1a2e">Company: ${data.company_name}</p>` : ''}
                <p style="margin:0;font-size:14px;color:#1a1a2e">Country: ${data.country}</p>
              </td></tr>
            </table>
            <p style="margin:0;color:#6b6b7b;font-size:14px;line-height:1.6">
              In the meantime, feel free to explore our <a href="https://propelusai.com/services" style="color:#635bff;text-decoration:none;font-weight:500">services</a> or <a href="https://propelusai.com/products" style="color:#635bff;text-decoration:none;font-weight:500">products</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#fafafa;border-top:1px solid #e8e8ed;text-align:center">
            <p style="margin:0 0 4px;color:#6b6b7b;font-size:12px">PropelusAI - AI Powered Growth</p>
            <p style="margin:0;color:#9ca3af;font-size:11px">support@propelusai.com - propelusai.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    text: `Hi ${data.full_name}, thanks for reaching out! We've received your inquiry and will respond within 24 hours. - PropelusAI Team`,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to PropelusAI Insights!',
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
        <tr>
          <td style="background:linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 50%,#222240 100%);padding:40px 40px 32px;text-align:center">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;letter-spacing:-0.02em">You're In!</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.6);font-size:15px;line-height:1.5">Welcome to PropelusAI Insights</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px">
            <p style="margin:0 0 20px;color:#1a1a2e;font-size:16px;line-height:1.7">
              Thanks for subscribing! You've just joined a community of forward-thinking businesses leveraging AI to grow smarter.
            </p>
            <p style="margin:0 0 24px;color:#4a4a5a;font-size:15px;line-height:1.7">Here's what you'll receive:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
              <tr><td style="padding:12px 16px;background:#f8f7ff;border-left:3px solid #635bff;border-radius:0 8px 8px 0;margin-bottom:8px"><p style="margin:0;color:#1a1a2e;font-size:14px"><strong>AI Growth Strategies</strong> - Actionable insights to scale your business</p></td></tr>
              <tr><td style="height:8px"></td></tr>
              <tr><td style="padding:12px 16px;background:#f8f7ff;border-left:3px solid #635bff;border-radius:0 8px 8px 0"><p style="margin:0;color:#1a1a2e;font-size:14px"><strong>Product Updates</strong> - New features and AI-powered tools</p></td></tr>
              <tr><td style="height:8px"></td></tr>
              <tr><td style="padding:12px 16px;background:#f8f7ff;border-left:3px solid #635bff;border-radius:0 8px 8px 0"><p style="margin:0;color:#1a1a2e;font-size:14px"><strong>Industry Trends</strong> - Stay ahead of the AI-marketing curve</p></td></tr>
              <tr><td style="height:8px"></td></tr>
              <tr><td style="padding:12px 16px;background:#f8f7ff;border-left:3px solid #635bff;border-radius:0 8px 8px 0"><p style="margin:0;color:#1a1a2e;font-size:14px"><strong>Exclusive Offers</strong> - Early access and subscriber-only perks</p></td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:8px 0 28px">
                <a href="https://propelusai.com/services" style="display:inline-block;padding:14px 32px;background:#635bff;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.01em">Explore Our Services</a>
              </td></tr>
            </table>
            <p style="margin:0;color:#6b6b7b;font-size:14px;line-height:1.6">
              Have a question? Reply to this email or reach out at <a href="mailto:support@propelusai.com" style="color:#635bff;text-decoration:none">support@propelusai.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#fafafa;border-top:1px solid #e8e8ed;text-align:center">
            <p style="margin:0 0 4px;color:#6b6b7b;font-size:12px">PropelusAI - AI Powered Growth</p>
            <p style="margin:0;color:#9ca3af;font-size:11px">Phoenix, AZ (US) - Surat and Kolkata (India)</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    text: 'Welcome to PropelusAI Insights! Thanks for subscribing. You will receive AI growth strategies, product updates, industry trends, and exclusive offers. Visit https://propelusai.com/services to explore our services.',
  });
}

export async function sendAffiliateConfirmation(
  email: string,
  fullName: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Affiliate Application Received - PropelusAI',
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
    <tr><td style="background:#0d0d1a;padding:24px 32px"><h2 style="margin:0;color:#fff;font-size:20px">Affiliate Application Received</h2></td></tr>
    <tr><td style="padding:28px 32px">
      <p style="margin:0 0 16px;color:#1a1a2e;font-size:16px;line-height:1.7">Hi <strong>${fullName}</strong>,</p>
      <p style="margin:0 0 16px;color:#4a4a5a;font-size:15px;line-height:1.7">
        Thank you for applying to the PropelusAI Affiliate Program! We've received your application and our team will review it shortly.
      </p>
      <p style="margin:0;color:#4a4a5a;font-size:15px;line-height:1.7">
        You'll receive an update within 48 hours. If approved, you'll get your unique affiliate code and commission details.
      </p>
    </td></tr>
    <tr>
      <td style="padding:24px 32px;background:#fafafa;border-top:1px solid #e8e8ed;text-align:center">
        <p style="margin:0;color:#6b6b7b;font-size:12px">PropelusAI - AI Powered Growth</p>
      </td>
    </tr>
  </table>
</body></html>`,
    text: `Hi ${fullName}, thank you for applying to the PropelusAI Affiliate Program! We'll review your application and get back to you within 48 hours. - PropelusAI Team`,
  });
}

export async function sendCampaignEmail(
  recipients: string[],
  subject: string,
  htmlBody: string,
  textBody?: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += 50) {
    const batch = recipients.slice(i, i + 50);
    const result = await sendEmail({
      to: batch,
      subject,
      html: htmlBody,
      text: textBody,
    });
    if (result) {
      sent += batch.length;
    } else {
      failed += batch.length;
    }
  }

  return { sent, failed };
}

export const emailService = {
  sendContactNotification,
  sendNewsletterWelcome,
  sendAffiliateConfirmation,
  sendCampaignEmail,
};
