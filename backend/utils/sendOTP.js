const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

// Generic send email function
const sendEmail = async ({ from, to, subject, text, html }) => {
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// OTP functions
const sendOTP = async (email, otp) => {
  return sendEmail({
    from: `"Ecommerce App" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const usersendOTP = async (email, otp) => {
  return sendEmail({
    from: `"Shopping Cart" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const sendsupplierOTP = async (email, otp) => {
  return sendEmail({
    from: `"Ecommerce App" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "OTP Verification for Supplier Registration",
    text: `Your OTP is: ${otp}`,
  });
};

const sendOTPorder = async (to, otp, orderId = null) => {
  const subject = orderId
    ? `Your Delivery OTP for Order #${orderId}`
    : `Your Verification OTP`;

  const message = orderId
    ? `Dear Customer,\n\nYour delivery OTP for order #${orderId} is: ${otp}.\n\nPlease share this OTP with the delivery agent to confirm delivery.\n\nThank you for shopping with us!`
    : `Your OTP code is: ${otp}`;

  return sendEmail({
    from: `"Ecommerce App" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    text: message,
  });
};

const sendSuccesmessage = async (email) => {
  return sendEmail({
    from: `"Shopping Cart" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "Delivery message",
    text: "Your order is delivered successfully",
  });
};

// Admin emails
const sendEmailToAdmin = async ({ to, subject, text }) => {
  return sendEmail({
    from: `"Ecommerce App" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    text,
  });
};

const sendAdminApprovalEmail = async (adminEmails, supplierName, supplierEmail) => {
  if (!adminEmails || adminEmails.length === 0) return;

  const htmlContent = `
    <h3>New Supplier Registration</h3>
    <p>Name: ${supplierName}</p>
    <p>Email: ${supplierEmail}</p>
    <p>Please review and approve or reject this supplier.</p>
    <a href="${process.env.FRONTEND_URL}/admin/approve-supplier?email=${supplierEmail}">Approve</a> |
    <a href="${process.env.FRONTEND_URL}/admin/reject-supplier?email=${supplierEmail}">Reject</a>
  `;

  return sendEmail({
    from: `"Ecommerce App" <no-reply@${process.env.MAILGUN_DOMAIN}>`,
    to: adminEmails.join(","),
    subject: "New Supplier Approval Required",
    html: htmlContent,
  });
};

// Export all functions
module.exports = {
  sendOTP,
  usersendOTP,
  sendsupplierOTP,
  sendOTPorder,
  sendSuccesmessage,
  sendEmailToAdmin,
  sendAdminApprovalEmail,
};
