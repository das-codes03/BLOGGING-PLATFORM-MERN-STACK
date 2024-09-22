const express = require("express");
const router = express.Router();

const {
	getBlog,
	sendLike,
	unlike,
	postBlog,
	deleteBlog,
	getBlogs,
	updateBlog,
} = require("../../schemas/Controller");

const comments = require("../../api/posts/commentRoute");
const { authenticateRequest } = require("../AuthHandler");

// Prepare Request to enter comment Route
// Attach blogId to request object
router.use("/:blogId/comments", async (req, res, next) => {
	try {
		const blog = await getBlog(req.params.blogId, null, false);
		req.blogId = blog.blogId;
		comments(req, res, next);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//Send like to blog
router.post("/:blogId/like", authenticateRequest, async (req, res) => {
	try {
		await sendLike(req.params.blogId, req.userId);
		return res.sendStatus(200);
	} catch (e) {
		return res.sendStatus(400);
	}
});

//Unlike a blog
router.post("/:blogId/unlike", authenticateRequest, async (req, res) => {
	try {
		await unlike(req.params.blogId, req.userId);
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(400);
	}
});

//Post a blog
router.post("/", authenticateRequest, async (req, res) => {
	try {
		const post = req.body;
		const b = await postBlog(req.userId, post);
		return res.status(200).send(b);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});

//Edit a blog
router.put("/:blogId/edit", authenticateRequest, async (req, res) => {
	try {
		const post = req.body;
		const b = await updateBlog(req.userId, req.params.blogId, post);
		return res.status(200).send(b);
	} catch (e) {
		console.log(e);
		return res.sendStatus(400);
	}
});

//Delete a blog
router.delete("/:blogId", authenticateRequest, async (req, res) => {
	try {
		await deleteBlog(req.params.blogId, req.userId);
		return res.sendStatus(200);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

//Get a specific blog
router.get("/:blogId", async (req, res) => {
	//Just to check who is requesting. Needed for hasLiked parameter
	try {
		await authenticateRequest(req);
		const blog = await getBlog(req.params.blogId, req.userId);
		return res.status(200).send(blog);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//get all blogs
router.get("/", async (req, res) => {
	try {
		await authenticateRequest(req);
		const pageno = req.query.pageno || 0;
		const filterbyuserid = req.query.filterbyuserid || null;
		const perpage = Math.min(req.query.perpage || 10, 100);

		const blogs = await getBlogs(req.userId, pageno, perpage, filterbyuserid);

		return res.status(200).send(blogs);
	} catch (e) {
		console.log(e);
		return res.sendStatus(404);
	}
});

module.exports = router;
