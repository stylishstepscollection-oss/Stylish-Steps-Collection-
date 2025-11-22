// lib/emailjs.ts
import emailjs from '@emailjs/nodejs';

const ensureString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (value?.toString) return value.toString();
  return String(value);
};

// Use environment variables
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || ''; // You'll need this
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';

export const sendEmail = async (templateParams: Record<string, any>) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};


// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
};

// Helper functions for specific emails
export const emailService = {
  sendOrderConfirmation: async (order: any, userEmail: string) => {
    const orderId = ensureString(order._id);
    
    const contentHTML = `
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px; font-size: 18px; color: #212529; font-weight: 600;">Order Details</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Order Number:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; font-weight: 600; text-align: right;">#${orderId.slice(-8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Items:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">${order.products.map((p: any) => p.product.name).join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0 0; font-size: 16px; color: #212529; font-weight: 600; border-top: 2px solid #dee2e6; padding-top: 12px;">Total:</td>
            <td style="padding: 8px 0 0; font-size: 18px; color: #667eea; font-weight: 700; text-align: right; border-top: 2px solid #dee2e6; padding-top: 12px;">${formatCurrency(order.total)}</td>
          </tr>
        </table>
      </div>
      <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea; border-radius: 8px; padding: 20px;">
        <h4 style="margin: 0 0 12px; font-size: 16px; color: #212529; font-weight: 600;">What's Next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #495057; line-height: 1.8;">
          <li>We'll send you another email when your order ships</li>
          <li>You can track your order status in your account</li>
          <li>Contact us anytime if you have questions</li>
        </ul>
      </div>
    `;

    return sendEmail({
      to_email: userEmail,
      email_subject: `Order Confirmation #${orderId.slice(-8)}`,
      badge_bg_color: '#d4edda',
      badge_text_color: '#155724',
      badge_text: '✓ Order Confirmed',
      email_title: `Hi ${order.user?.name || 'Customer'}!`,
      email_message: "Thank you for your order! We've received it and will begin processing shortly.",
      email_content_html: contentHTML,
      cta_button_text: 'Track Your Order',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
      footer_note: '',
    });
  },

  sendOrderStatusUpdate: async (
    order: any,
    userEmail: string,
    status: string,
    note?: string
  ) => {
    const orderId = ensureString(order._id);
    
    const contentHTML = `
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px; font-size: 18px; color: #212529; font-weight: 600;">Current Status</h3>
        <p style="margin: 0; font-size: 18px; color: #667eea; font-weight: 600;">${status}</p>
        ${note ? `<p style="margin: 12px 0 0; font-size: 14px; color: #6c757d; font-style: italic;">"${note}"</p>` : ''}
      </div>
      ${order.trackingNumber ? `
      <div style="background: linear-gradient(135deg, #d4edda15 0%, #28a74515 100%); border-left: 4px solid #28a745; border-radius: 8px; padding: 20px;">
        <h4 style="margin: 0 0 8px; font-size: 16px; color: #212529; font-weight: 600;">Tracking Information</h4>
        <p style="margin: 0; font-size: 14px; color: #495057;">
          Tracking Number: <strong style="color: #212529; font-family: monospace; font-size: 15px;">${order.trackingNumber}</strong>
        </p>
      </div>
      ` : ''}
    `;

    return sendEmail({
      to_email: userEmail,
      email_subject: `Order #${orderId.slice(-8)} Status Update`,
      badge_bg_color: '#cfe2ff',
      badge_text_color: '#084298',
      badge_text: `📦 ${status.toUpperCase()}`,
      email_title: 'Order Update',
      email_message: `Hi ${order.user?.name || 'Customer'}, your order #${orderId.slice(-8)} has been updated.`,
      email_content_html: contentHTML,
      cta_button_text: 'View Order Details',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
      footer_note: '',
    });
  },

  sendDisputeCreated: async (dispute: any, userEmail: string, adminEmail: string) => {
    const disputeId = ensureString(dispute._id);
    const orderId = ensureString(dispute.order._id || dispute.order);

    // Send to admin
    const adminContentHTML = `
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px;">
        <h3 style="margin: 0 0 16px; font-size: 18px; color: #212529; font-weight: 600;">Dispute Details</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Dispute ID:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; font-weight: 600; text-align: right;">#${disputeId.slice(-8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Customer:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">${dispute.user?.name || 'Customer'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Type:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">${dispute.type}</td>
          </tr>
        </table>
      </div>
    `;

    await sendEmail({
      to_email: adminEmail,
      email_subject: `New Dispute #${disputeId.slice(-8)}`,
      badge_bg_color: '#fff3cd',
      badge_text_color: '#856404',
      badge_text: '⚠️ New Dispute',
      email_title: 'Dispute Received',
      email_message: `A customer has submitted a dispute for Order #${orderId.slice(-8)}.`,
      email_content_html: adminContentHTML,
      cta_button_text: 'Review Dispute',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/disputes/${disputeId}`,
      footer_note: '',
    });

    // Confirmation to user
    const userContentHTML = `
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px; font-size: 18px; color: #212529; font-weight: 600;">Dispute Details</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Dispute ID:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; font-weight: 600; text-align: right;">#${disputeId.slice(-8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Issue Type:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">${dispute.type}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #6c757d;">Order:</td>
            <td style="padding: 8px 0; font-size: 14px; color: #212529; text-align: right;">#${orderId.slice(-8)}</td>
          </tr>
        </table>
      </div>
      <div style="background: linear-gradient(135deg, #cfe2ff15 0%, #08429815 100%); border-left: 4px solid #0d6efd; border-radius: 8px; padding: 20px;">
        <h4 style="margin: 0 0 12px; font-size: 16px; color: #212529; font-weight: 600;">What Happens Next?</h4>
        <ul style="margin: 0; padding-left: 20px; color: #495057; line-height: 1.8;">
          <li>Our support team will review your case within <strong>24 hours</strong></li>
          <li>You'll receive updates via email</li>
          <li>You can add more details or photos through your account</li>
          <li>We're committed to resolving this fairly and quickly</li>
        </ul>
      </div>
    `;

    return sendEmail({
      to_email: userEmail,
      email_subject: `Dispute #${disputeId.slice(-8)} Received`,
      badge_bg_color: '#fff3cd',
      badge_text_color: '#856404',
      badge_text: '⚠️ Dispute Received',
      email_title: "We're Here to Help",
      email_message: `Hi ${dispute.user?.name || 'Customer'}, we've received your dispute regarding Order #${orderId.slice(-8)}.`,
      email_content_html: userContentHTML,
      cta_button_text: 'View Dispute Details',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/disputes/${disputeId}`,
      footer_note: '',
    });
  },

  sendDisputeMessage: async (
    dispute: any,
    recipientEmail: string,
    senderName: string,
    message: string
  ) => {
    const disputeId = ensureString(dispute._id);

    const contentHTML = `
      <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 12px; padding: 24px;">
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            ${senderName}
          </span>
        </div>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #495057; white-space: pre-wrap;">${message}</p>
      </div>
    `;

    return sendEmail({
      to_email: recipientEmail,
      email_subject: `New Message on Dispute #${disputeId.slice(-8)}`,
      badge_bg_color: '#cfe2ff',
      badge_text_color: '#084298',
      badge_text: '💬 New Message',
      email_title: 'You Have a New Message',
      email_message: `${senderName} has sent you a message regarding Dispute #${disputeId.slice(-8)}.`,
      email_content_html: contentHTML,
      cta_button_text: 'Reply to Message',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/disputes/${disputeId}`,
      footer_note: '💡 Tip: Respond quickly to help us resolve your issue faster',
    });
  },

  sendDisputeResolved: async (
    dispute: any,
    userEmail: string,
    resolution: string
  ) => {
    const disputeId = ensureString(dispute._id);
    const orderId = ensureString(dispute.order._id || dispute.order);

    const contentHTML = `
      <div style="background: linear-gradient(135deg, #d4edda15 0%, #28a74515 100%); border-left: 4px solid #28a745; border-radius: 12px; padding: 24px;">
        <h3 style="margin: 0 0 12px; font-size: 18px; color: #212529; font-weight: 600;">Resolution</h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #495057; white-space: pre-wrap;">${resolution}</p>
      </div>
    `;

    return sendEmail({
      to_email: userEmail,
      email_subject: `Dispute #${disputeId.slice(-8)} Resolved`,
      badge_bg_color: '#d4edda',
      badge_text_color: '#155724',
      badge_text: '✓ Dispute Resolved',
      email_title: 'Issue Resolved',
      email_message: `Hi ${dispute.user?.name || 'Customer'}, we're happy to inform you that your dispute for Order #${orderId.slice(-8)} has been resolved.`,
      email_content_html: contentHTML,
      cta_button_text: 'View Details',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/disputes/${disputeId}`,
      footer_note: 'If you have any other questions, please don\'t hesitate to contact us.',
    });
  },

  sendReviewReminder: async (order: any, userEmail: string) => {
    const orderId = ensureString(order._id);
    const contentHTML = `
      <div style="background: linear-gradient(135deg, #fff3cd15 0%, #ffc10715 100%); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px; font-size: 20px; color: #212529; font-weight: 600;">We'd Love to Hear From You!</h3>
        <p style="margin: 0 0 24px; font-size: 15px; color: #495057; line-height: 1.6;">
          Your review helps other customers make informed decisions and helps us improve our products and service.
        </p>
        <div style="margin-bottom: 16px;">
          <span style="font-size: 48px;">⭐⭐⭐⭐⭐</span>
        </div>
      </div>
      <div style="background-color: #f8f9fa; border-radius: 12px; padding: 24px;">
        <h4 style="margin: 0 0 16px; font-size: 16px; color: #212529; font-weight: 600; text-align: center;">Why Review?</h4>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px; font-size: 14px; color: #495057; vertical-align: top;">
              <span style="font-size: 20px;">💬</span>
            </td>
            <td style="padding: 8px; font-size: 14px; color: #495057;">
              <strong>Help Others:</strong> Your experience helps shoppers choose the right products
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px; color: #495057; vertical-align: top;">
              <span style="font-size: 20px;">📈</span>
            </td>
            <td style="padding: 8px; font-size: 14px; color: #495057;">
              <strong>Improve Quality:</strong> Your feedback helps us serve you better
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 14px; color: #495057; vertical-align: top;">
              <span style="font-size: 20px;">⚡</span>
            </td>
            <td style="padding: 8px; font-size: 14px; color: #495057;">
              <strong>Quick & Easy:</strong> Takes less than 2 minutes
            </td>
          </tr>
        </table>
      </div>
    `;

    return sendEmail({
      to_email: userEmail,
      email_subject: 'How was your order?',
      badge_bg_color: '#fff3cd',
      badge_text_color: '#856404',
      badge_text: '⭐ Share Your Experience',
      email_title: 'How Was Your Order?',
      email_message: `Hi ${order.user?.name || 'Customer'}, we hope you're enjoying your recent purchase from Order #${order._id.slice(-8)}!`,
      email_content_html: contentHTML,
      cta_button_text: 'Write Your Review',
      cta_button_link: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
      footer_note: 'Thank you for being a valued customer! 🙏',
    });
  },

  sendPasswordReset: async (email: string, resetToken: string, userName: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const contentHTML = `
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
          <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email or contact support if you're concerned about your account security.
        </p>
      </div>
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="margin: 0; font-size: 12px; color: #667eea; word-break: break-all; font-family: monospace;">
          ${resetLink}
        </p>
      </div>
    `;

    return sendEmail({
      to_email: email,
      email_subject: 'Reset Your Password',
      badge_bg_color: '#fff3cd',
      badge_text_color: '#856404',
      badge_text: '🔐 Password Reset',
      email_title: 'Reset Your Password',
      email_message: `Hi ${userName}, we received a request to reset your password for your Stylish Steps Collection account.`,
      email_content_html: contentHTML,
      cta_button_text: 'Reset My Password',
      cta_button_link: resetLink,
      footer_note: 'This link can only be used once and will expire soon for security reasons.',
    });
  },
};