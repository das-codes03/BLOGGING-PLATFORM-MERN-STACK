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
		},
	},
	{ timestamps: true }
);

//check user password and username and return the user if valid or return false if invalid
userSchema.statics.validateUser = async function (username, password) {
	const foundUser = await this.findOne({ username });
	if (!foundUser) return false;
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
};

//check user password and email and return the user if valid or return false if invalid
userSchema.statics.validateUserThroughEmail = async function (email, password) {
	const foundUser = await this.findOne({ email });
	if (!foundUser) return false;
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
};

// //get username from userId
// userSchema.statics.getUsername = async function (userId) {
// 	const user = await this.findById(userId);
// 	if (user) return user.username;
// 	else return null;
// };

// //does user exist?
// userSchema.statics.doesUserExist = async function (username) {
// 	const user = await this.find({ username: username });
// 	if (user.length) return true;
// 	else return false;
// };

var validator = new PasswordValidator();
validator.min(8).max(100);

function validatePassword(password) {
	return validator.validate(password);
}

//when registering new user or updating user, hash the password if modified
userSchema.pre("save", async function (next) {
	console.log(this);
	//password validation
	if (!validatePassword(this.password)) {
		throw new mongoose.Error("Password not valid");
	}
	if (!this.isModified("password")) return next();
	else this.password = await bcrypt.hash(this.password, 12);
	next();
});

// userSchema.statics.getPublicInfo = async function (user) {
// 	let { username, profilePic, displayName, bio, _id } = user;
// 	let userId = _id;
// 	//now get url from public id
// 	profilePic = cloudinary.url(profilePic);
// 	return { username, profilePic, displayName, bio, userId };
// };

// userSchema.statics.getPersonalInfo = async function (user) {
// 	let { username, profilePic, displayName, bio, email, _id } = user;
// 	let userId = _id;
// 	profilePic = cloudinary.url(profilePic);
// 	return { username, profilePic, displayName, bio, email, userId };
// };

/// to be moved
// userSchema.post(
// 	"deleteOne",
// 	{ document: true, query: false },
// 	async function () {
// 		const blogs = await blogModel.find({ userId: this._id });
// 		Promise.all(
// 			blogs.forEach((b) => {
// 				b.deleteOne();
// 			})
// 		);
// 	}
// );
//************************************** */

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
