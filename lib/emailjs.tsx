// lib/emailjs.ts
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');

export const sendEmail = async (
  templateId: string,
  templateParams: Record<string, any>
) => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      templateId,
      templateParams
    );
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};

// Email Templates
export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'template_order_confirmation',
  ORDER_STATUS_UPDATE: 'template_order_status',
  DISPUTE_CREATED: 'template_dispute_created',
  DISPUTE_MESSAGE: 'template_dispute_message',
  DISPUTE_RESOLVED: 'template_dispute_resolved',
  REVIEW_REMINDER: 'template_review_reminder',
};

// Helper functions for specific emails
export const emailService = {
  sendOrderConfirmation: async (order: any, userEmail: string) => {
    return sendEmail(EMAIL_TEMPLATES.ORDER_CONFIRMATION, {
      to_email: userEmail,
      order_id: order._id.slice(-8),
      order_total: order.total,
      order_items: order.products.map((p: any) => p.product.name).join(', '),
      customer_name: order.user?.name || 'Customer',
    });
  },

  sendOrderStatusUpdate: async (
    order: any,
    userEmail: string,
    status: string,
    note?: string
  ) => {
    return sendEmail(EMAIL_TEMPLATES.ORDER_STATUS_UPDATE, {
      to_email: userEmail,
      order_id: order._id.slice(-8),
      status: status,
      status_note: note || '',
      tracking_number: order.trackingNumber || 'Not available yet',
      customer_name: order.user?.name || 'Customer',
    });
  },

  sendDisputeCreated: async (dispute: any, userEmail: string, adminEmail: string) => {
    // Send to admin
    await sendEmail(EMAIL_TEMPLATES.DISPUTE_CREATED, {
      to_email: adminEmail,
      dispute_id: dispute._id.slice(-8),
      order_id: dispute.order._id.slice(-8),
      dispute_type: dispute.type,
      customer_name: dispute.user?.name || 'Customer',
      customer_email: userEmail,
    });

    // Confirmation to user
    return sendEmail(EMAIL_TEMPLATES.DISPUTE_CREATED, {
      to_email: userEmail,
      dispute_id: dispute._id.slice(-8),
      order_id: dispute.order._id.slice(-8),
      dispute_type: dispute.type,
      customer_name: dispute.user?.name || 'Customer',
    });
  },

  sendDisputeMessage: async (
    dispute: any,
    recipientEmail: string,
    senderName: string,
    message: string
  ) => {
    return sendEmail(EMAIL_TEMPLATES.DISPUTE_MESSAGE, {
      to_email: recipientEmail,
      dispute_id: dispute._id.slice(-8),
      sender_name: senderName,
      message: message,
      dispute_link: `${process.env.NEXT_PUBLIC_APP_URL}/disputes/${dispute._id}`,
    });
  },

  sendDisputeResolved: async (
    dispute: any,
    userEmail: string,
    resolution: string
  ) => {
    return sendEmail(EMAIL_TEMPLATES.DISPUTE_RESOLVED, {
      to_email: userEmail,
      dispute_id: dispute._id.slice(-8),
      order_id: dispute.order._id.slice(-8),
      resolution: resolution,
      customer_name: dispute.user?.name || 'Customer',
    });
  },

  sendReviewReminder: async (order: any, userEmail: string) => {
    return sendEmail(EMAIL_TEMPLATES.REVIEW_REMINDER, {
      to_email: userEmail,
      order_id: order._id.slice(-8),
      customer_name: order.user?.name || 'Customer',
      review_link: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}`,
    });
  },
};