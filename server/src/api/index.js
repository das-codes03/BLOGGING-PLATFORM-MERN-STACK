const express = require("express");

const router = express.Router();

const auth = require("./posts/authRoutes");
const user = require("./posts/userRoutes");
const post = require("./posts/blogRoutes");
router.use("/auth", auth);
router.use("/users", user);
router.use("/blogs", post);

module.exports = router;
