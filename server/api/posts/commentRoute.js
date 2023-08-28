const express = require("express");
const router = express.Router();
const blogModel = require("../../schemas/BlogModel");
const CommentModel = require("../../schemas/CommentModel");
const { authenticateRequest } = require("../AuthHandler");
const commentModel = require("../../schemas/CommentModel");
const likeModel = require("../../schemas/LikeModel");
const UserModel = require("../../schemas/UserModel");

//get all comments in a post
router.get("/", async (req, res) => {
	//For hasLiked information, the user requesting data must be known
	await authenticateRequest(req);

	const excludeReplies = req.query.excludeReplies;
	CommentModel.find({
		$and: [{ blogId: req.blogId }, excludeReplies ? { repliedToId: null } : {}],
	})
		.then((comments) => {
			//preprocess comment data
			Promise.all(
				comments.map(async (c) => {
					return await commentModel.prepareData(c, req.userId);
				})
			).then((c) => {
				res.send(c);
			});
		})
		.catch((err) => {
			res.sendStatus(404);
		});
});

//get a specific comment
router.get("/:commentId", async (req, res) => {
	//For hasLiked information, the user requesting data must be known
	await authenticateRequest(req);

	CommentModel.findById(req.params.commentId)
		.then((comment) => {
			commentModel
				.prepareData(comment, req.userId)
				.then((c) => {
					return res.send(c);
				})
				.catch(() => {
					return res.sendStatus(500);
				});
		})
		.catch((err) => {
			res.sendStatus(404);
		});
});

//get all replies of a comment
router.get("/:commentId/replies", async (req, res) => {
	//For hasLiked information, the user requesting data must be known
	await authenticateRequest(req);

	CommentModel.find({ repliedToId: req.params.commentId })
		.then((comments) => {
			Promise.all(
				comments.map(async (c) => {
					return await commentModel.prepareData(c, req.userId);
				})
			).then((c) => {
				return res.send(c);
			});
		})
		.catch((err) => {
			return res.sendStatus(404);
		});
});

//post a comment
router.post("/", authenticateRequest, async (req, res) => {
	const body = req.body;
	body.content = body.content.trim();
	if (body.content.length == 0)
		return res.status(400).send("Comment cannot be empty");
	new CommentModel({
		userId: req.userId,
		blogId: req.blogId,
		content: body.content,
	})
		.save()
		.then(async (com) => {
			const temp = await commentModel.prepareData(com, req.userId);
			return res.status(201).json(temp);
		})
		.catch((e) => {
			return res.status(400).send("Couldn't post comment");
		});
});

//reply to a comment in a blog
router.post("/:commentId", authenticateRequest, async (req, res) => {
	const body = req.body;
	body.content = body.content.trim();
	if (body.content.length == 0)
		return res.status(400).send("Comment cannot be empty");
	try {
		const exists = await commentModel.findById(req.params.commentId).count();

		if (!exists)
			return res.status(404).send("Comment to reply to doesn't exist");

		new CommentModel({
			userId: req.userId,
			repliedToId: req.params.commentId,
			blogId: req.blogId,
			content: body.content,
		})
			.save()
			.then((c) => {
				res.status(201).json(c);
			})
			.catch((e) => {
				res.status(500).send(e);
			});
	} catch (e) {
		return res.sendStatus(500);
	}
});
//delete a comment
router.delete("/:commentId", authenticateRequest, async (req, res) => {
	try {
		const comment = await commentModel.findById(req.params.commentId);
		if (comment.userId != req.userId) return res.sendStatus(403);
		await comment.deleteOne();
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//like a comment
router.post("/:commentId/like", authenticateRequest, async (req, res) => {
	commentModel
		.findById(req.params.commentId)
		.then(() => {
			new likeModel({ contentId: req.params.commentId, userId: req.userId })
				.save()
				.then(() => {
					return res.sendStatus(200);
				})
				.catch(() => {
					res.sendStatus(500);
				});
		})
		.catch(() => {
			res.sendStatus(404);
		});
});

//unlike a comment
router.post("/:commentId/unlike", authenticateRequest, async (req, res) => {
	likeModel
		.findOneAndDelete({ contentId: req.params.commentId, userId: req.userId })
		.then(() => {
			res.sendStatus(200);
		})
		.catch(() => {
			res.sendStatus(404);
		});
});

module.exports = router;
