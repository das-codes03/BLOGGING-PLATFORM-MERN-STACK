const mongoose = require("mongoose");

const likeModel = require("./LikeModel");
const userModel = require("./UserModel");

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

commentSchema.pre(
	"save",
	{ document: true, query: true },
	async function (next) {
		//trim white spaces:
		this.content = this.content.trim();
		next();
	}
);

commentSchema.statics.prepareData = async function (c, requestingUID) {
	const { content, createdAt, repliedToId, userId, _id } = c;
	//get like count of comment
	const likeCount = await likeModel.likeCount(_id);

	//get has user liked comment
	let hasLiked = false;
	if (requestingUID) {
		hasLiked = await likeModel.hasLiked(_id, requestingUID);
	}

	//get user
	const user = await userModel.getPublicInfo(await userModel.findById(userId));
	return {
		_id,
		userId,
		content,
		createdAt,
		likeCount,
		repliedToId,
		hasLiked,
		...user,
	};
};

commentSchema.post(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		//delete all replies in this comment
		try {
			const replies = await commentModel.find({ repliedToId: this._id });

			replies.forEach(async (r) => {
				return await r.deleteOne();
			});

			const likes = await likeModel.find({ contentId: this._id });

			likes.forEach(async (l) => {
				return await l.deleteOne();
			});
		} catch (e) {
			console.log(e);
		}
	}
);

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
