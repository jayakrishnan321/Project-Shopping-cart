const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:"smtp.mailgun.org",
  port:587,
  secure:false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // helps in some cloud setups
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
const sendSuccesmessage=async(email)=>{
  await transporter.sendMail({
    from:`"shopping cart" <${process.env.EMAIL_USER}>`,
    to:email,
    subject:'Delever message',
    text:'your order is deleverd succesfully'
  })
}
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


const sendOTPorder= async (to, otp, orderId = null) => {
  try {
    console.log("enterd sent otp order page")
    const subject = orderId
      ? `Your Delivery OTP for Order #${orderId}`
      : `Your Verification OTP`;
    console.log(subject)
    const message = orderId
      ? `Dear Customer,\n\nYour delivery OTP for order #${orderId} is: ${otp}.\n\nPlease share this OTP with the delivery agent to confirm delivery.\n\nThank you for shopping with us!`
      : `Your OTP code is: ${otp}`;
console.log(message)
console.log(to)
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)

    await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });
    console.log('email sended')

  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTP };


module.exports = { sendOTP, usersendOTP, sendsupplierOTP, sendAdminApprovalEmail ,sendEmailToAdmin,sendOTPorder,sendSuccesmessage};
