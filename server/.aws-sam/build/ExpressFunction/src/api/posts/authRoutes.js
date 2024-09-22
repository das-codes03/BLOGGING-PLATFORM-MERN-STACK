const express = require("express");
const router = express.Router();
const sendMail = require("../MailHandler");
const {
  getToken,
  activateUser,
  getEmailToken,
  authenticateRequest,
  getResetPasswordToken,
  updatePassword,
  validatePassword,
} = require("../AuthHandler");

const {
  deleteUser,
  isEmailTaken,
  isUsernameTaken,
  putInRegistration,
  isEmailActive,
} = require("../../schemas/Controller");

const { verify } = require("jsonwebtoken");

//login using credentials (username/email and password)
router.post("/login", async (req, res) => {
  console.log("login route");
  try {
    console.log(JSON.stringify(req.body));
    let { username, password } = req.body;
    username = username.trim();
    username = username.toLowerCase();
    const token = await getToken(username, password);
    return res.json(token);
  } catch (e) {
    return res.status(401).send(e.message);
  }
});

//delete the user. Not yet implemented in app
router.delete("/delete", authenticateRequest, async (req, res) => {
  try {
    await deleteUser(req.userId);
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
});

//Put user in registration
router.post("/register", async (req, res) => {
  console.log("Register route");
  try {
    let { username, password, email, name } = req.body;
    email = email.trim();
    email = email.toLowerCase();
    username = username.trim();
    username = username.toLowerCase();
    if (username.length == 0)
      return res.status(400).send("Username cannot be blank");
    //first check if email is already used
    if (await isEmailTaken(email)) {
      return res
        .status(409)
        .send(
          "Oh no! That email is already in use. Please use a different one."
        );
    }
    //check if username is already taken
    if (await isUsernameTaken(username)) {
      return res
        .status(409)
        .send(
          "Oops! Someone's already using that username. Please choose another."
        );
    }
    //now validate password
    if (!validatePassword(password))
      return res.status(400).send("Password not accepted");

    //get email token. Password is already hashed in this token
    const token = await getEmailToken(username, password, email, name);
    await sendMail(
      `<p>Click <a href="${process.env.CLIENT_DOMAIN}/activate?token=${token}">here</a> to activate your account</p>`,
      "[Activation Link]",
      email
    );
    //now put in the database
    await putInRegistration(username, email);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

//activate the user
router.post("/activate/", async (req, res) => {
  try {
    const token = req.body.token;
    const accessToken = await activateUser(token);
    if (!accessToken) return res.sendStatus(400);
    return res.status(200).send(accessToken);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

//mail password reset link
router.post("/getresetpasswordlink/", async (req, res) => {
  //check if email is valid
  try {
    let email = req.body.email;
    if (!email) return res.sendStatus(400);
    email = email.toLowerCase().trim();

    //checks if email is actually someone's mail id
    if (!(await isEmailActive(email)))
      return res
        .status(404)
        .send(
          "Oops! It seems like we couldn't find an account with that email. Double-check and try again, or feel free to sign up if you're new here!"
        );

    //generate a new pwd reset token. It includes email and current password version of user
    const pwdResetToken = await getResetPasswordToken(email);

    //send the mail with pwdreset token.
    await sendMail(
      `<p>Click <a href="http://localhost:5173/resetpassword?token=${pwdResetToken}">here</a> to reset your password</p>`,
      "[Password Reset Link]",
      email
    );
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(500);
  }
});

//reset the password by first verifying reset token
router.post("/resetpassword", async (req, res) => {
  const { password, token } = req.body;
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    if (decoded) {
      let email = decoded.email.toLowerCase().trim();
      let pwdVersion = decoded.passwordVersion;
      await updatePassword(email, password, pwdVersion);
      return res.sendStatus(200);
    } else return res.sendStatus(400);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

module.exports = router;
