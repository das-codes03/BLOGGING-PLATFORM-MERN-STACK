const express = require("express");
const { authenticateRequest } = require("../AuthHandler");

const {
	getPersonalUserInfo,
	getPublicUserInfo,
	getPublicInfoByUsername,
	updateUserProfile,
} = require("../../schemas/Controller");
const router = express.Router();

//returns personal info
router.get("/me", authenticateRequest, async (req, res) => {
	try {
		const info = await getPersonalUserInfo(req.userId);
		return res.status(200).send(info);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//returns publicly available user information
router.get("/id/:userId", async (req, res) => {
	try {
		const info = await getPublicUserInfo(req.params.userId);
		return res.status(200).send(info);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//return user by username
router.get("/:username", async (req, res) => {
	try {
		const info = await getPublicInfoByUsername(req.params.username);
		return res.status(200).send(info);
	} catch (e) {
		return res.sendStatus(404);
	}
});

//update profile...
router.patch("/", authenticateRequest, async (req, res) => {
	try {
		const data = req.body;
		await updateUserProfile(req.userId, data);
		return res.sendStatus(200);
	} catch (e) {
		return res.sendStatus(404);
	}
});

module.exports = router;
