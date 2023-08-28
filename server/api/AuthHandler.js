const jwt = require("jsonwebtoken");
const validator = require("validator");
const userModel = require("../schemas/UserModel");
const regModel = require("../schemas/RegisterConfirmationModel");
const authenticateRequest = (req, res, next) => {
	const authHeader = req.headers.authorization;
	let token = "";
	try {
		token = authHeader && JSON.parse(authHeader).token;
	} catch (e) {
		if (res) return res.sendStatus(400);
		else return false;
	}
	if (!token) {
		if (res) return res.sendStatus(401);
		else return false;
	}
	try {
		const decoded = jwt.verify(token, "jwtsecret");
		if (!decoded) {
			if (res) return res.sendStatus(400);
			else return false;
		} else {
			req.userId = decoded.userId;
			next && next();
			return;
		}
	} catch (e) {
		if (res) return res.sendStatus(500);
		else return false;
	}
};

const activateUser = async (token) => {
	const data = jwt.decode(token);
	if (!data) {
		return false;
	}
	try {
		await new userModel({
			username: data.username,
			password: data.password,
			email: data.email,
			displayName: data.name,
		}).save();
		regModel.deleteOne({ username: data.username }).exec();
		return true;
	} catch (e) {
		return false;
	}
};
const getEmailToken = async (username, password, email, name) => {
	const emailToken = jwt.sign(
		{ username, password, email, name },
		"jwtsecret",
		{
			expiresIn: "1d",
		}
	);
	return emailToken;
};
const getToken = async (usernameOrEmail, password) => {
	let user;
	if (validator.isEmail(usernameOrEmail)) {
		user = await userModel.validateUserThroughEmail(usernameOrEmail, password);
	} else {
		user = await userModel.validateUser(usernameOrEmail, password);
	}
	if (!user) {
		throw new Error("Invalid credentials");
	} else {
		const accessToken = jwt.sign({ userId: user._id }, "jwtsecret", {
			expiresIn: "365d",
		});
		return { token: accessToken, userId: user._id };
	}
};

module.exports = { authenticateRequest, getToken, activateUser, getEmailToken };
