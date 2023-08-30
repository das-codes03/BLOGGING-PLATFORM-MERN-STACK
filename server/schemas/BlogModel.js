const mongoose = require("mongoose");

const likeModel = require("./LikeModel");
const commentModel = require("./CommentModel");
const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		content: {
			type: Array,
			required: true,
		},
		readingTime: {
			type: Number,
		},
	},
	{ timestamps: true }
);

blogSchema.statics.prepareData = async function (blog) {};

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
