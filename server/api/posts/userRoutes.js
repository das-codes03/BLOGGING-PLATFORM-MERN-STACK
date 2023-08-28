const express = require("express");
const UserModel = require("../../schemas/UserModel");
const RegistrationModel = require("../../schemas/RegisterConfirmationModel");
const { authenticateRequest } = require("../AuthHandler");
const { cloudinary } = require("../../utils/cloudinary");
const FileType = require("file-type/browser");
const router = express.Router();

//returns availibility
router.get("/available/:username", async (req, res) => {
	try {
		const user = await UserModel.exists({ username: req.params.username });
		const booked = await RegistrationModel.exists({
			username: req.params.username,
		});
		if (booked.length) {
			return res.send(false);
		} else if (user.length) {
			return res.send(false);
		} else {
			return res.send(true);
		}
	} catch (e) {
		res.sendStatus(503);
	}
});

//returns personal info
router.get("/me/getInfo", authenticateRequest, async (req, res) => {
	try {
		let user = await UserModel.findById(req.userId);
		if (user) {
			user = await UserModel.getPersonalInfo(user);

			return res.json(user);
		} else {
			if (checkExists) return res.send(false);
			else return res.sendStatus(404);
		}
	} catch (e) {
		res.sendStatus(404);
	}
});

//returns publicly available user information
router.get("/id/:userId", async (req, res) => {
	try {
		let user = await UserModel.findById(req.params.userId);
		if (user) {
			user = await UserModel.getPublicInfo(user);
			return res.json(user);
		} else {
			return res.sendStatus(404);
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(404);
	}
});

//return user by username
router.get("/:username", async (req, res) => {
	try {
		let user = await UserModel.findOne({ username: req.params.username });
		if (user) {
			user = await UserModel.getPublicInfo(user);
			return res.json(user);
		} else {
			return res.sendStatus(404);
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(404);
	}
});

//update profile
router.patch("/id/:userId", authenticateRequest, async (req, res) => {
	//if user id not same as requesting user then forbidden!
	if (req.userId != req.params.userId) return res.send(403);

	//only allow profile pic base64encoded, bio, displayname to be changed
	let { profilePic, bio, displayName } = req.body;

	UserModel.findById(req.params.userId)
		.then(async (user) => {
			//upload image to cloudinary
			if (profilePic) {
				//TODO validate file type
				try {
					const uploadResponse = await cloudinary.uploader.upload(profilePic, {
						upload_preset: "ml_default",
					});

					if (user.profilePic)
						try {
							//now get old image id and remove from cloudinary
							const deleteResonse = await cloudinary.uploader.destroy(
								user.profilePic
							);
							console.log("Done: ", deleteResonse);
						} catch (e) {
							console.error(e);
						}
					profilePic = uploadResponse.public_id;
				} catch (e) {
					console.log(e);
					res.sendStatus(500);
				}
			}
			console.log(profilePic);

			const data = { profilePic, bio, displayName };

			const newData = { ...user._doc, ...data };
			UserModel.findByIdAndUpdate(req.params.userId, newData)
				.then(() => {
					return res.sendStatus(200);
				})
				.catch(() => {
					return res.sendStatus(400);
				});
		})
		.catch((e) => {
			console.log(e);
			return res.sendStatus(404);
		});
});

module.exports = router;
