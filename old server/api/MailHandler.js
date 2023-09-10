const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	port: 587,
	auth: {
		user: "dasarghadeep2003@gmail.com",
		pass: "xpodrrxspqejoely",
	},
});

module.exports = async function sendMail(message, subject, toEmail) {
	const mailOptions = {
		from: "dasarghadeep2003@gmail.com",
		to: toEmail,
		subject: subject,
		html: message,
	};
	return await transporter.sendMail(mailOptions);
};
