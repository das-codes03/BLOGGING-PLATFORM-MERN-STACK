const express = require("express");
const router = express.Router();

const { authenticateRequest } = require("../AuthHandler");

const {
	getComments,
	getComment,
	getRepliesRecursively,
	postComment,
	deleteComment,
	sendLike,
	unlike,
} = require("../../schemas/Controller");

//get all comments in a post
router.get("/", async (req, res) => {
	try {
		await authenticateRequest(req);
		const comments = await getComments(req.blogId, req.userId);
		return res.status(200).send(comments);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//get a specific comment
router.get("/:commentId", async (req, res) => {
	//For hasLiked information, the user requesting data must be known
	try {
		await authenticateRequest(req);
		const comment = await getComment(req.params.commentId, req.userId);
		return res.status(200).send(comment);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//get all replies of a comment
router.get("/:commentId/replies", async (req, res) => {
	//For hasLiked information, the user requesting data must be known
	try {
		await authenticateRequest(req);
		const replies = await getRepliesRecursively(
			req.params.commentId,
			req.userId
		);

		return res.status(200).send(replies);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//post a comment
router.post("/", authenticateRequest, async (req, res) => {
	try {
		const c_id = await postComment(req.userId, req.blogId, req.body);
		return res.status(200).send(c_id);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});

//reply to a comment in a blog
router.post("/:commentId", authenticateRequest, async (req, res) => {
	try {
		const c_id = await postComment(
			req.userId,
			req.blogId,
			req.body,
			req.params.commentId
		);
		return res.status(200).send(c_id);
	} catch (e) {
		return res.sendStatus(404);
	}
});
//delete a comment
router.delete("/:commentId", authenticateRequest, async (req, res) => {
	try {
		await deleteComment(req.params.commentId, req.userId);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//like a comment
router.post("/:commentId/like", authenticateRequest, async (req, res) => {
	try {
		await sendLike(req.params.commentId, req.userId);
		return res.sendStatus(200);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//unlike a comment
router.post("/:commentId/unlike", authenticateRequest, async (req, res) => {
	try {
		await unlike(req.params.commentId, req.userId);
		return res.sendStatus(200);
	} catch (e) {
		return res.sendStatus(404);
	}
});

module.exports = router;
