// Install SendGrid: npm install @sendgrid/mail
const sgMail = require("@sendgrid/mail");

// Set your SendGrid API Key in .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generic sender function
const sender = async ({ fromName = "Ecommerce App", to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL, // e.g., no-reply@yourdomain.com
        name: fromName,
      },
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
    throw error;
  }
};

// OTP functions
const sendOTP = (email, otp) => {
  return sender({
    fromName: "Ecommerce App",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const usersendOTP = (email, otp) => {
  return sender({
    fromName: "Shopping Cart",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const sendsupplierOTP = (email, otp) => {
  return sender({
    fromName: "Ecommerce App",
    to: email,
    subject: "OTP Verification for Supplier Registration",
    text: `Your OTP is: ${otp}`,
  });
};

// Order OTP
const sendOTPorder = (email, otp, orderId = null) => {
  const subject = orderId
    ? `Your Delivery OTP for Order #${orderId}`
    : `Your Verification OTP`;
    
  const message = orderId
    ? `Dear Customer,\n\nYour delivery OTP for order #${orderId} is: ${otp}.\n\nPlease share this OTP with the delivery agent to confirm delivery.\n\nThank you for shopping with us!`
    : `Your OTP code is: ${otp}`;

  return sender({
    fromName: "Ecommerce App",
    to: email,
    subject,
    text: message,
  });
};

// Delivery success message
const sendSuccesmessage = (email) => {
  return sender({
    fromName: "Shopping Cart",
    to: email,
    subject: "Delivery message",
    text: "Your order is delivered successfully",
  });
};

// Admin emails
const sendEmailToAdmin = ({ to, subject, text }) => {
  return sender({
    fromName: "Ecommerce App",
    to,
    subject,
    text,
  });
};

const sendAdminApprovalEmail = (adminEmails, supplierName, supplierEmail) => {
  if (!adminEmails || adminEmails.length === 0) return;

  const htmlContent = `
    <h3>New Supplier Registration</h3>
    <p>Name: ${supplierName}</p>
    <p>Email: ${supplierEmail}</p>
    <p>Please review and approve or reject this supplier.</p>
    <a href="${process.env.FRONTEND_URL}/admin/approve-supplier?email=${supplierEmail}">Approve</a> |
    <a href="${process.env.FRONTEND_URL}/admin/reject-supplier?email=${supplierEmail}">Reject</a>
  `;

  return sender({
    fromName: "Ecommerce App",
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
