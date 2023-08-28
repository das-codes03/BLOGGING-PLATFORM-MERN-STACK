const express = require("express");
const router = express.Router();
const regModel = require("../../schemas/RegisterConfirmationModel");
const {
	getToken,
	activateUser,
	getEmailToken,
	authenticateRequest,
} = require("../AuthHandler");
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

const userModel = require("../../schemas/UserModel");

router.delete("/:userId", authenticateRequest, async (req, res) => {
	if (req.userId !== req.params.userId) return res.sendStatus(403);
	try {
		userModel
			.findById(req.userId)
			.then((user) => {
				user
					.deleteOne()
					.then(() => {
						return res.sendStatus(200);
					})
					.catch((e) => {
						console.log(e);
						return res.sendStatus(500);
					});
			})
			.catch(() => {
				return res.sendStatus(404);
			});
	} catch (e) {
		res.sendStatus(500);
	}
});
router.get("/activate/:token", async (req, res) => {
	const token = req.params.token;
	activateUser(token);
	res.redirect("http://localhost:5173/login");
});

router.post("/register", async (req, res) => {
	let { username, password, email, name } = req.body;
	email = email.trim();
	email = email.toLowerCase();

	username = username.trim();
	username = username.toLowerCase();
	//first check if email is already used
	if (
		(await regModel.exists({ email: email })) ||
		(await userModel.exists({ email: email }))
	) {
		return res
			.status(409)
			.send("Oh no! That email is already taken. Please use a different one.");
	}
	//check if username is already taken
	if (
		(await regModel.exists({ username: username })) ||
		(await userModel.exists({ username: username }))
	) {
		return res
			.status(409)
			.send(
				"Oops! Someone's already using that username. Please choose another."
			);
	}
	const token = await getEmailToken(username, password, email, name);

	const mailOptions = {
		from: "dasarghadeep2003@gmail.com",
		to: email,
		subject: "[Activation Link]",
		html: `<p>Click <a href="http://localhost:3000/api/auth/activate/${token}">here</a> to activate your account</p>`,
	};
	//now put in database
	new regModel({ username, email })
		.save()
		.then(() => {
			transporter.sendMail(mailOptions, (error, info) => {
				error &&
					(() => {
						return res.sendStatus(500);
					})();
				info &&
					(() => {
						return res.sendStatus(200);
					})();
			});
		})
		.catch(() => {
			res.sendStatus(500);
		});
});

module.exports = router;
