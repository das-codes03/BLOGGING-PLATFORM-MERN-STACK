const express = require("express");
const router = express.Router();

const {
	getToken,
	activateUser,
	getEmailToken,
	authenticateRequest,
} = require("../AuthHandler");
const {
	deleteUser,
	isEmailTaken,
	isUsernameTaken,
	putInRegistration,
} = require("../../schemas/Controller");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	service: "gmail",
	port: 587,
	auth: {
		user: "dasarghadeep2003@gmail.com",
		pass: "xpodrrxspqejoely",
	},
});

router.post("/login", (req, res) => {
	let { username, password } = req.body;
	username = username.trim();
	username = username.toLowerCase();
	getToken(username, password)
		.then((token) => {
			res.json(token);
		})
		.catch((e) => {
			res.status(401).send(e.message);
		});
});

router.delete("/delete", authenticateRequest, async (req, res) => {
	try {
		await deleteUser(req.userId);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});
router.get("/activate/:token", async (req, res) => {
	const token = req.params.token;
	activateUser(token);
	res.redirect("http://localhost:5173/login");
});

router.post("/register", async (req, res) => {
	try {
		let { username, password, email, name } = req.body;
		email = email.trim();
		email = email.toLowerCase();

		username = username.trim();
		username = username.toLowerCase();
		//first check if email is already used
		if (await isEmailTaken(email)) {
			return res
				.status(409)
				.send(
					"Oh no! That email is already in use. Please use a different one."
				);
		}
		//check if username is already taken
		if (await isUsernameTaken(username)) {
			return res
				.status(409)
				.send(
					"Oops! Someone's already using that username. Please choose another."
				);
		}

		//get email token
		const token = await getEmailToken(username, password, email, name);

		//TODO: put in seperate function
		const mailOptions = {
			from: "dasarghadeep2003@gmail.com",
			to: email,
			subject: "[Activation Link]",
			html: `<p>Click <a href="http://localhost:3000/api/auth/activate/${token}">here</a> to activate your account</p>`,
		};
		//now put in database
		await putInRegistration(username, email);
		return transporter.sendMail(mailOptions, (error, info) => {
			error && res.sendStatus(500);
			info && res.sendStatus(200);
		});
	} catch (e) {
		return res.sendStatus(400);
	}
});

module.exports = router;
