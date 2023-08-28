const express = require("express");
const router = express.Router();
const blogModel = require("../../schemas/BlogModel");

const likeModel = require("../../schemas/LikeModel");
const comments = require("../../api/posts/commentRoute");
const { authenticateRequest } = require("../AuthHandler");

// Prepare Request to enter comment Route
// Attach blogId to request object
router.use("/:blogId/comments", async (req, res, next) => {
	blogModel
		.findById(req.params.blogId)
		.then((blog) => {
			req.blogId = blog._id;
			comments(req, res, next);
		})
		.catch((err) => {
			res.sendStatus(404);
		});
});

//Send like to blog
router.post("/:blogId/like", authenticateRequest, async (req, res) => {
	blogModel
		.findById(req.params.blogId)
		.then(() => {
			new likeModel({ contentId: req.params.blogId, userId: req.userId })
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

//Unlike a blog
router.post("/:blogId/unlike", authenticateRequest, async (req, res) => {
	likeModel
		.findOneAndDelete({ contentId: req.params.blogId, userId: req.userId })
		.then(() => {
			res.sendStatus(200);
		})
		.catch(() => {
			res.sendStatus(404);
		});
});

//Post a blog
router.post("/", authenticateRequest, async (req, res) => {
	const post = req.body;
	new blogModel({
		title: post.title,
		userId: req.userId,
		content: post.content,
	})
		.save()
		.then((ok) => {
			res.status(201).send({ _id: ok._id });
		})
		.catch((err) => {
			res.sendStatus(500);
		});
});

//Delete a blog
router.delete("/:blogId", authenticateRequest, async (req, res) => {
	//Find the blog by ID
	blogModel
		.findById(req.params.blogId)
		.then((blog) => {
			//If blog creator is not delete requester then deny deletion request
			if (blog.userId != req.userId) return res.sendStatus(403);

			//All fine then delete the blog
			blog
				.deleteOne()
				.then(() => res.sendStatus(200))
				.catch(() => {
					res.sendStatus(500);
				});
		})
		.catch(() => {
			res.sendStatus(404);
		});
});

const userModel = require("../../schemas/UserModel");
//Get a specific blog
router.get("/:blogId", async (req, res) => {
	//Just to check who is requesting. Needed for hasLiked parameter
	await authenticateRequest(req);

	//find blog
	blogModel
		.findById(req.params.blogId)
		.then(async (c) => {
			let { _id, userId, title, createdAt, content } = c;
			//get user
			const userData = await userModel.getPublicInfo(
				await userModel.findById(c.userId)
			);

			//get like count
			const likeCount = await likeModel.likeCount(req.params.blogId);

			let hasLiked = false;
			//incase user has liked set hasLiked = true
			if (req.userId) {
				hasLiked = await likeModel.hasLiked(req.params.blogId, req.userId);
			}

			res
				.send({
					blogId: _id,
					title,
					content,
					createdAt,
					hasLiked,
					likeCount,
					...userData,
				})
				.status(200);
		})
		.catch((e) => {
			res.sendStatus(404);
		});
});

//get all blogs
router.get("/", async (req, res) => {
	await authenticateRequest(req);

	const pageno = req.query.pageno || 0;
	const filterbyuserid = req.query.filterbyuserid || null;

	const docLen = await blogModel.count(
		filterbyuserid ? { userId: filterbyuserid } : {}
	);

	const sortby = req.query.sortby || "newest";

	//default fetch 50 blogs at a time
	const perpage = Math.min(req.query.perpage || 10, 100);
	let skip = Math.min(pageno * perpage, docLen);
	switch (sortby) {
		case "top":
			break;

		default:
		case "newest":
			let remaining = 0;
			const blogs = await (filterbyuserid
				? blogModel.find({ userId: filterbyuserid }, { content: 0 })
				: blogModel.find({}, { content: 0 })
			)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(perpage);
			remaining = docLen - skip - blogs.length;
			//check if it has more
			let hasMore = true;

			if (!remaining) {
				hasMore = false;
			}

			await Promise.all(
				blogs.map(async (b) => {
					const { _id, userId, title, createdAt } = b;
					//get user
					const userData = await userModel.getPublicInfo(
						await userModel.findById(b.userId)
					);
					const likeCount = await likeModel.likeCount(_id);
					let hasLiked = false;
					if (req.userId) {
						hasLiked = await likeModel.hasLiked(_id, req.userId);
					}

					return {
						blogId: _id,
						title,
						createdAt,
						likeCount,
						hasLiked,
						...userData,
					};
				})
			)
				.then((b) => res.json({ blogs: b, hasMore }))
				.catch((e) => {
					console.log(e);
					res.sendStatus(404);
				});
			break;
	}
});

module.exports = router;
