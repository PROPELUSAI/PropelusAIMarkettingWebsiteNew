import { resend, emailFrom } from '../config/resend';
import env from '../config/env';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email via Resend with retry
 */
async function sendEmail(options: EmailOptions, retries = 2): Promise<boolean> {
  if (!resend) {
    logger.warn('Email not sent — Resend not configured');
    return false;
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { error } = await resend.emails.send({
        from: emailFrom,
        to: recipients,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info(`Email sent: "${options.subject}" → ${options.to}`);
      return true;
    } catch (err: any) {
      const errMsg = err?.message || err?.statusCode || JSON.stringify(err, Object.getOwnPropertyNames(err));
      logger.error(`Email attempt ${attempt + 1} failed: ${errMsg}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  return false;
}

// ─── Pre-built email templates ───────────────────────

export async function sendContactNotification(data: {
  full_name: string;
  email: string;
  company_name?: string;
  country: string;
  scheduled_time: string;
  description?: string;
}): Promise<boolean> {
  return sendEmail({
    to: env.EMAIL_TO,
    subject: `New Contact Submission from ${data.full_name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.full_name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.company_name ? `<p><strong>Company:</strong> ${data.company_name}</p>` : ''}
      <p><strong>Country:</strong> ${data.country}</p>
      <p><strong>Scheduled Time:</strong> ${new Date(data.scheduled_time).toLocaleString()}</p>
      ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
    `,
  });
}

export async function sendTestimonialApprovalEmail(
  email: string,
  name: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Your Testimonial Has Been Approved — PropelusAI',
    html: `
      <h2>Thank You, ${name}!</h2>
      <p>Your testimonial has been approved and is now live on our website.</p>
      <p>We truly appreciate your feedback and support.</p>
      <p>— The PropelusAI Team</p>
    `,
  });
}

export async function sendAffiliateApprovalEmail(
  email: string,
  affiliateCode: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to PropelusAI Affiliate Program!',
    html: `
      <h2>Congratulations!</h2>
      <p>Your affiliate application has been approved.</p>
      <p><strong>Your Affiliate Code:</strong> ${affiliateCode}</p>
      <p>Share this code with potential clients. You'll earn a commission on every successful referral.</p>
      <p>— The PropelusAI Team</p>
    `,
  });
}

export async function sendNewsletterWelcome(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to PropelusAI Insights!',
    html: `
      <h2>You're In!</h2>
      <p>Thanks for subscribing to PropelusAI Insights.</p>
      <p>You'll receive the latest on AI-powered growth, automation strategies, and industry trends.</p>
      <p>— The PropelusAI Team</p>
    `,
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

  // Send in batches of 50
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
  sendTestimonialApprovalEmail,
  sendAffiliateApprovalEmail,
  sendNewsletterWelcome,
  sendCampaignEmail,
};
