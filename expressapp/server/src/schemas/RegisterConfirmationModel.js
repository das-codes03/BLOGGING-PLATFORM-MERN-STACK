const mongoose = require("mongoose");

const regSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
regSchema.index({ createdAt: 1 }, { expires: "1d" });

const registrationModel = mongoose.model("RegistrationPending", regSchema);
module.exports = registrationModel;
