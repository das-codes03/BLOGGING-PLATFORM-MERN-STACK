const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const PasswordValidator = require("password-validator");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		displayName: {
			type: String,
		},
		profilePic: {
			type: String,
		},
		bio: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		passwordVersion: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

//check user password and username and return the user if valid or return false if invalid
// userSchema.statics.validateUser = async function (username, password) {
// 	const foundUser = await this.findOne({ username });
// 	if (!foundUser) return false;
// 	const isValid = await bcrypt.compare(password, foundUser.password);
// 	return isValid ? foundUser : false;
// };

//check user password and email and return the user if valid or return false if invalid
// userSchema.statics.validateUserThroughEmail = async function (email, password) {
// 	const foundUser = await this.findOne({ email });
// 	if (!foundUser) return false;
// 	const isValid = await bcrypt.compare(password, foundUser.password);
// 	return isValid ? foundUser : false;
// };

// //when registering new user or updating user, hash the password if modified
// userSchema.pre("save", async function (next) {
// 	console.log(this);
// 	//password validation
// 	if (!validatePassword(this.password)) {
// 		throw new mongoose.Error("Password not valid");
// 	}
// 	if (!this.isModified("password")) return next();
// 	else this.password = await bcrypt.hash(this.password, 12);
// 	next();
// });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
