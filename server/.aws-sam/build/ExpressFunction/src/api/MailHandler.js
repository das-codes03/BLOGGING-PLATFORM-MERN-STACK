const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-south-1.amazonaws.com",
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = async function sendMail(message, subject, toEmail) {
  console.log("Sending to: " + toEmail);
  const mailOptions = {
    from: "insightink@arghadeepdas.com",
    to: toEmail,
    subject: subject,
    html: message,
  };
  return await transporter.sendMail(mailOptions);
};
