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
const usersendOTP=async(email,otp)=>{
  await transporter.sendMail({
    from:`"shopping cart" <${process.env.EMAIL_USER}>`,
    to:email,
    subject:"OTP Verification",
    text:`your otp is: ${otp}`,
  });
}

module.exports = { sendOTP,usersendOTP }; 
