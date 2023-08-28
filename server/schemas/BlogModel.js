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
	},
	{ timestamps: true }
);

blogSchema.post(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		const comments = await commentModel.find({ blogId: this._id });

		comments.forEach(async (c) => {
			return await c.deleteOne();
		});

		const likes = await likeModel.find({ contentId: this._id });

		likes.forEach(async (l) => {
			return await l.deleteOne();
		});
	}
);
const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
