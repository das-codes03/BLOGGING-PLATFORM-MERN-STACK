const { verify, decode, sign } = require("jsonwebtoken");
const { isEmail } = require("validator");
const userModel = require("../schemas/UserModel");
const { deleteOne } = require("../schemas/RegisterConfirmationModel");
const registrationModel = require("../schemas/RegisterConfirmationModel");
const { isEmailActive } = require("../schemas/Controller");
const { hash, compare } = require("bcrypt");
const PasswordValidator = require("password-validator");

const authenticateRequest = async (req, res, next) => {
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
		const decoded = verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			if (res) return res.sendStatus(400);
			else return false;
		} else {
			if (
				decoded.passwordVersion !=
				(await userModel.findById(decoded.userId).select("passwordVersion"))
					.passwordVersion
			) {
				return res.sendStatus(400);
			}
			req.userId = decoded.userId;
			next && next();
			return;
		}
	} catch (e) {
		if (res) return res.sendStatus(400);
		else return false;
	}
};

//validate password

//******Properties******* */
var validator = new PasswordValidator();
validator.min(8);
//****************************** */

function validatePassword(password) {
	return validator.validate(password);
}

async function hashPassword(password) {
	return await hash(password, 12);
}

const activateUser = async (token) => {
	try {
		const data = verify(token, process.env.JWT_SECRET);
		if (!data) {
			return false;
		}
		//password is already hashed!
		const u = await new userModel({
			username: data.username,
			password: data.password,
			email: data.email,
			displayName: data.name,
		}).save();
		//REGISTRATION REMOVE
		await registrationModel.deleteOne({ username: data.username }).exec();
		return generateToken(u._id);
	} catch (e) {
		console.error(e);
		return null;
	}
};
const updatePassword = async function (email, newPassword, passwordVersion) {
	const user = await userModel.findOne({ email });

	//check if user exists
	if (!user) throw new Error("User with email doesn't exist");

	//current passwordVersion of user should match that of the token
	if (passwordVersion != user.passwordVersion)
		throw new Error("Password versions do not match");

	newPassword = await hashPassword(newPassword);
	await user.updateOne({
		password: newPassword,
		passwordVersion: user.passwordVersion + 1,
	});
	return true;
};
const getEmailToken = async (username, password, email, name) => {
	password = await hashPassword(password);
	const emailToken = sign(
		{ username, password, email, name },
		process.env.JWT_SECRET,
		{
			expiresIn: "1d",
		}
	);
	return emailToken;
};
const getResetPasswordToken = async (email) => {
	//get the current password version
	const passwordVersion = (
		await userModel.findOne({ email }).select("passwordVersion")
	).passwordVersion;

	const accessToken = sign(
		{ email: email, passwordVersion },
		process.env.JWT_SECRET,
		{
			expiresIn: "10m",
		}
	);
	return accessToken;
};

const generateToken = function (userId, pwdVersion = 0) {
	return {
		token: sign(
			{ userId: userId, passwordVersion: pwdVersion },
			process.env.JWT_SECRET,
			{
				expiresIn: "365d",
			}
		),
		userId,
	};
};
const validateUserThroughUsername = async function (username, password) {
	const foundUser = await userModel.findOne({ username });
	if (!foundUser) return null;
	const isValid = await compare(password, foundUser.password);
	return isValid ? foundUser : false;
};
const validateUserThroughEmail = async function (email, password) {
	const foundUser = await userModel.findOne({ email });
	if (!foundUser) return null;
	const isValid = await compare(password, foundUser.password);
	return isValid ? foundUser : false;
};

const getToken = async (usernameOrEmail, password) => {
	let user;
	if (isEmail(usernameOrEmail)) {
		user = await validateUserThroughEmail(usernameOrEmail, password);
	} else {
		user = await validateUserThroughUsername(usernameOrEmail, password);
	}
	if (!user) {
		throw new Error("Invalid credentials");
	} else {
		const accessToken = generateToken(user._id, user.passwordVersion);
		return accessToken;
	}
};

module.exports = {
	validatePassword,
	updatePassword,
	getResetPasswordToken,
	authenticateRequest,
	getToken,
	activateUser,
	getEmailToken,
};
