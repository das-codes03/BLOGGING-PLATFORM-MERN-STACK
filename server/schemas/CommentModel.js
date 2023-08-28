const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		blogId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Blog",
			required: true,
		},
		repliedToId: {
			type: mongoose.Schema.ObjectId,
			ref: "Comment",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		content: {
			type: String,
			maxLength: 10000,
			minLength: 1,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
