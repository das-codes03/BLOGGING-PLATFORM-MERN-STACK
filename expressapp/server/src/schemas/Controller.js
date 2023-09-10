//
// This contains procedures for deletion of dependent documents
// aka CASCADE DELETE

const { cloudinary } = require("../utils/cloudinary");
const blogModel = require("./BlogModel");
const commentModel = require("./CommentModel");
const likeModel = require("./LikeModel");
const registrationModel = require("./RegisterConfirmationModel");
const userModel = require("./UserModel");

/**
 *
 * POST section
 *
 */
async function sendLike(contentId, reqUID) {
	//error if like already exists
	if (await likeModel.exists({ contentId, userId: reqUID })) {
		throw new Error("Like already exists");
	}
	//check if user is real
	if (!(await userModel.exists({ _id: reqUID }))) {
		throw new Error("User doesn't exist");
	}
	//check if content is real (either blog or comment)
	if (
		!(await commentModel.exists({ _id: contentId })) &&
		!(await blogModel.exists({ _id: contentId }))
	) {
		throw new Error("Content doesn't exist");
	}
	await new likeModel({ userId: reqUID, contentId: contentId }).save();
	return true;
}

async function updateUserProfile(userId, data) {
	let profilePic = data.profilePic || null;
	let bio = data.bio || null;
	let displayName = data.displayName || null;
	// let { profilePic, bio, displayName } = req.body;
	const user = await userModel.findById(userId);
	const updatedData = {};
	bio && (updatedData.bio = bio);
	displayName && (updatedData.displayName = displayName);
	//process new profile pic
	if (profilePic) {
		if (profilePic == "remove") {
			updatedData.profilePic = null;
			if (user.profilePic) {
				//now get old image id and remove from cloudinary
				await cloudinary.uploader.destroy(user.profilePic);
			}
		} else {
			const uploadResponse = await cloudinary.uploader.upload(profilePic, {
				upload_preset: "ml_default",
			});
			updatedData.profilePic = uploadResponse.public_id;
			if (user.profilePic) {
				//now get old image id and remove from cloudinary
				await cloudinary.uploader.destroy(user.profilePic);
			}
		}
	}

	//pack data
	await user.updateOne(updatedData);
	return user._id;
}

async function unlike(contentId, reqUID) {
	const like = await likeModel.findOne({ contentId, userId: reqUID });
	if (like) like.deleteOne();
	else throw new Error("Like doesn't exist");
}
async function postComment(userId, blogId, data, replyTo) {
	//check if user is real
	if (!(await userModel.exists({ _id: userId })))
		throw new Error("User doesn't exist");
	//check if blog exists
	if (!(await blogModel.exists({ _id: blogId })))
		throw new Error("Blog doesn't exist");

	//if repliedToId is present, check if reply comment exists
	if (replyTo)
		if (!(await commentModel.exists({ _id: replyTo })))
			throw new Error("Comment to reply to doesn't exist");

	//now cleanup the data
	data.content = `${data.content}`.trim();

	//if comment is empty send error
	if (data.content.length == 0) throw new Error("Comment cannot be empty");

	const c = await new commentModel({
		blogId: blogId,
		userId: userId,
		content: data.content,
		repliedToId: replyTo || null,
	}).save();
	return c._id;
}

async function postBlog(userId, data) {
	//check if user is real
	if (!(await userModel.exists({ _id: userId })))
		throw new Error("User doesn't exist");

	const b = await new blogModel({
		title: data.title,
		userId: userId,
		content: data.content,
	}).save();
	return b._id;
}
async function updateBlog(userId, blogId, data) {
	//check if user is real
	if (!(await userModel.exists({ _id: userId })))
		throw new Error("User doesn't exist");

	//find the existing blog
	const blog = await blogModel.findById(blogId);
	if (!blog) throw new Error("Blog doesn't exist");

	//check if user and blog author is same
	if (blog.userId != userId) throw new Error("Forbidden");

	const b = await blog.updateOne({
		title: data.title,
		userId: userId,
		content: data.content,
	});

	return blog._id;
}
async function putInRegistration(username, email) {
	await new registrationModel({ username, email }).save();
	return true;
}
/**
 *
 *  RETREIVE SECTION
 *
 */

/**
 *
 * @param {string} commentId _id of the comment to be retrieved
 * @param {string} reqUID (optional) _id of the user watching (to check if they have liked it)
 */

async function getComment(commentId, reqUID) {
	//find the comment
	const comment = await commentModel.findById(commentId);

	//count the number of likes
	const likeCount = await likeModel.count({ contentId: commentId });

	//check if has liked (only if reqUID is provided)
	const hasLiked = reqUID ? await userHasLiked(reqUID, commentId) : false;

	//now need to get user information of the comment
	const user = await getPublicUserInfo(comment.userId);

	//pack the data
	const data = {
		commentId: comment._id,
		content: comment.content,
		blogId: comment.blogId,
		likeCount: likeCount,
		hasLiked: hasLiked,
		repliedToId: comment.repliedToId,
		...user,
	};
	return data;
}
async function userHasLiked(userId, contentId) {
	return (await likeModel.exists({ contentId, userId })) ? true : false;
}
//recursively get all replies of a comment
async function getRepliesRecursively(commentId, reqUID, onlyCount = false) {
	const query = commentModel.find({ repliedToId: commentId });
	if (onlyCount) query.select("");
	const replies = await query;
	const data = [];
	let cnt = replies.length;
	await Promise.all(
		replies.map(async (r) => {
			const rep = await getRepliesRecursively(r._id, reqUID, onlyCount);
			if (!onlyCount) {
				data.push(...rep);
				//count the number of likes
				const likeCount = await likeModel.count({ contentId: r._id });
				//check if has liked (only if reqUID is provided)
				const hasLiked = reqUID ? await userHasLiked(reqUID, r._id) : false;
				const user = await getPublicUserInfo(r.userId);
				data.push({
					commentId: r._id,
					content: r.content,
					blogId: r.blogId,
					likeCount,
					hasLiked,
					repliedToId: r.repliedToId,
					...user,
				});
			} else {
				cnt += rep;
			}
			return;
		})
	);
	return onlyCount ? cnt : data;
}
//get all comments in a blog. EXCLUDING REPLIES
async function getComments(blogId, reqUID) {
	//no need to check if blog exists as comment will return empty anyways in that case.
	//get all the comments
	const comments = await commentModel.find({
		blogId: blogId,
		repliedToId: null,
	});

	//process each comment
	let data = await Promise.all(
		comments.map(async (c) => {
			//count the number of likes
			const likeCount = await likeModel.count({ contentId: c._id });
			//count number of replies
			const replyCount = await getRepliesRecursively(c._id, reqUID, true);
			//check if has liked (only if reqUID is provided)
			const hasLiked = reqUID ? await userHasLiked(reqUID, c._id) : false;

			//get user information

			const user = await getPublicUserInfo(c.userId);

			//pack data
			return {
				commentId: c._id,
				userId: c.userId,
				content: c.content,
				blogId: c.blogId,
				createdAt: c.createdAt,
				likeCount,
				hasLiked,
				replyCount,
				...user,
			};
		})
	);
	data = data.filter((c) => !null);
	return data;
}
async function getPublicInfoByUsername(username) {
	//find the user
	const user = await userModel.findOne({ username });
	if (user) {
		return getPublicUserInfo(user._id);
	} else {
		throw new Error("User doesn't exist");
	}
}
async function getPublicUserInfo(userId) {
	//find the user

	const user = await userModel.findById(userId);
	if (!user) throw new Error("User doesn't exist.");
	//generate profile pic URL from cloudinary public_id
	const profilePicURL = user.profilePic
		? cloudinary.url(user.profilePic)
		: null;
	//pack the data
	const data = {
		userId: user._id,
		username: user.username,
		profilePic: profilePicURL,
		displayName: user.displayName,
		bio: user.bio,
	};
	return data;
}

async function getPersonalUserInfo(userId) {
	//find the user
	const user = await userModel.findById(userId);
	//generate profile pic URL from cloudinary public_id
	const profilePicURL = user.profilePic
		? cloudinary.url(user.profilePic)
		: null;
	//pack the data
	const data = {
		userId: user._id,
		username: user.username,
		profilePic: profilePicURL,
		displayName: user.displayName,
		bio: user.bio,
		email: user.email,
	};
	return data;
}

async function getBlog(blogId, reqUID, includeContent = true) {
	//get the blog
	const blog = await (includeContent
		? blogModel.findById(blogId)
		: blogModel.findById(blogId).select("-content"));
	//count the number of likes
	const likeCount = await likeModel.count({ contentId: blogId });

	//check if has liked (only if reqUID is provided)
	const hasLiked = reqUID ? await userHasLiked(reqUID, blogId) : false;

	//now get the user data
	const user = await getPublicUserInfo(blog.userId);

	//pack the data
	const data = {
		blogId: blog._id,
		title: blog.title,
		content: blog.content,
		createdAt: blog.createdAt,
		hasLiked,
		likeCount,
		...user,
	};
	return data;
}
//get multiple blogs. Doesn't return content
async function getBlogs(reqUID, pageNo, perpage, filterByUID) {
	const docLen = await blogModel.count(
		filterByUID ? { userId: filterByUID } : {}
	);
	let skip = Math.min(pageNo * perpage, docLen);
	const blogs = await blogModel
		.find(filterByUID ? { userId: filterByUID } : {})
		.select("-content")
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(perpage);
	const remaining = docLen - skip - blogs.length;
	const hasMore = remaining ? true : false;

	let data = await Promise.all(
		blogs.map(async (b) => {
			let user;
			try {
				user = await getPublicUserInfo(b.userId);
			} catch (e) {
				console.log(e);
				return null;
			}
			//count the number of likes
			const likeCount = await likeModel.count({ contentId: b._id });

			//check if has liked (only if reqUID is provided)
			const hasLiked = reqUID ? await userHasLiked(reqUID, b._id) : false;
			return {
				blogId: b._id,
				title: b.title,
				createdAt: b.createdAt,
				likeCount,
				hasLiked,
				...user,
			};
		})
	);
	data = data.filter((b) => !null);
	return { blogs: data, hasMore };
}
/**
 *
 *
 *  DELETE SECTION
 *  CASCADE DELETE OPERATIONS
 *
 *
 */

//delete user. Throws error if not found
async function deleteUser(userId) {
	//find the user
	const user = await userModel.findById(userId);
	//if found delete the user
	await user.deleteOne();

	//find all blogs by the user
	const blogs = await blogModel.find({ userId: userId });
	//now delete every blog
	await Promise.all(
		blogs.map(async (b) => {
			return await deleteBlog(b._id, userId);
		})
	);

	//find all comments by the user
	const comments = await commentModel.find({ userId: userId });
	//now delete every comment
	await Promise.all(
		comments.map(async (c) => {
			return await deleteComment(c._id, userId);
		})
	);

	//find all likes by the user
	const likes = await likeModel.find({ userId: userId });
	//now delete every comment
	await Promise.all(
		likes.map(async (l) => {
			return await deleteLike(l._id, userId);
		})
	);

	return true;
}

//delete blog. Throws error if not found
async function deleteBlog(blogId, reqUID) {
	//find the blog
	const blog = await blogModel.findById(blogId);

	//CHECK IF USER REQUESTING IS SAME AS AUTHOR OF BLOG!
	if (blog.userId != reqUID) throw new Error("Forbidden");

	//or else continue...

	//if found then delete
	blog.deleteOne();
	//now find all the comments associated with the blog
	const comments = await commentModel.find({ blogId: blogId });
	//now delete every comment found
	await Promise.all(
		comments.map(async (c) => {
			return await deleteComment(c._id, reqUID);
		})
	);
	//now find all the likes associated with the blog
	const likes = await likeModel.find({ contentId: blogId });
	//now delete every like found
	await Promise.all(
		likes.map(async (l) => {
			return await deleteLike(l._id, reqUID);
		})
	);

	return true;
}

//delete comment
async function deleteComment(commentId, reqUID) {
	//find the comment
	const comment = await commentModel.findById(commentId);
	if (!comment) return;
	//CHECK IF USER REQUESTING IS SAME AS AUTHOR OF COMMENT!
	if (comment.userId != reqUID) throw new Error("Forbidden");

	//if found then delete
	await comment.deleteOne();

	//find all replies of the comment
	const replies = await commentModel.find({ repliedToId: commentId });
	//now delete every reply found
	await Promise.all(
		replies.map(async (r) => {
			//note: this will recursively delete and sub replies of the comment
			return await deleteComment(r._id, reqUID);
		})
	);

	//now find all the likes associated with the comment
	const likes = await likeModel.find({ contentId: commentId });
	//now delete every like found
	await Promise.all(
		likes.map(async (l) => {
			return await deleteLike(l._id, reqUID);
		})
	);

	return true;
}

//delete like. Throws error if not found
async function deleteLike(likeId, reqUID) {
	//simple delete as no dependencies are there for likes
	const like = await likeModel.findById(likeId);

	//CHECK IF USER REQUESTING IS SAME AS SENDER OF LIKE!
	if (like.userId != reqUID) throw new Error("Forbidden");

	//if authorized then delete...
	await like.deleteOne();

	return true;
}

//checks if username is taken from both pending registrations and active users
async function isUsernameTaken(username) {
	return (
		(await registrationModel.exists({ username: username })) ||
		(await userModel.exists({ username: username }))
	);
}

//checks if email is taken from both pending registrations and active users
async function isEmailTaken(email) {
	return (await registrationModel.exists({ email: email })) ||
		(await userModel.exists({ email: email }))
		? true
		: false;
}

//check if email is used by active user
async function isEmailActive(email) {
	return (await userModel.exists({ email: email })) ? true : false;
}
module.exports = {
	isEmailActive,
	sendLike,
	putInRegistration,
	updateUserProfile,
	unlike,
	updateBlog,
	postComment,
	postBlog,
	isUsernameTaken,
	isEmailTaken,
	getComment,
	getRepliesRecursively,
	getComments,
	getPublicUserInfo,
	getPersonalUserInfo,
	getPublicInfoByUsername,
	getBlog,
	getBlogs,
	deleteUser,
	deleteBlog,
	deleteComment,
	deleteLike,
};
