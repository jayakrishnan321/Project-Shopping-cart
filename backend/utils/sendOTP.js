const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const usersendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Shopping Cart" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};

const sendsupplierOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification for Supplier Registration",
    text: `Your OTP is: ${otp}`,
  });
};
const sendEmailToAdmin = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to admin: ${to}`);
  } catch (error) {
    console.error("Error sending email to admin:", error);
  }
};

async function sendAdminApprovalEmail(adminEmails, supplierName, supplierEmail) {
  if (!adminEmails || adminEmails.length === 0) {
    console.error("No admin emails found");
    return;
  }

  const mailOptions = {
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: adminEmails.join(","), // ✅ convert array to string
    subject: "New Supplier Approval Required",
    html: `
      <h3>New Supplier Registration</h3>
      <p>Name: ${supplierName}</p>
      <p>Email: ${supplierEmail}</p>
      <p>Please review and approve or reject this supplier.</p>
      <a href="${process.env.FRONTEND_URL}/admin/approve-supplier?email=${supplierEmail}">Approve</a>
      |
      <a href="${process.env.FRONTEND_URL}/admin/reject-supplier?email=${supplierEmail}">Reject</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending admin approval email:", error);
  }
}

module.exports = { sendOTP, usersendOTP, sendsupplierOTP, sendAdminApprovalEmail ,sendEmailToAdmin};
