const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	contentId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

// likeSchema.statics.hasLiked = async function (contentId, userId) {
// 	return (await this.exists({
// 		contentId: contentId,
// 		userId: userId,
// 	}))
// 		? true
// 		: false;
// };

// likeSchema.statics.likeCount = async function (contentId) {
// 	return await this.count({ contentId });
// };

const likeModel = mongoose.model("Like", likeSchema);
module.exports = likeModel;
