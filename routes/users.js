const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const app = require("express");
const router = app.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registred");
  user = new User(_.pick(req.body, ["name", "email", "password", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    "jwtPrivateKey"
  );
  try {
    await user.save();
    res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
  } catch (e) {
    res.status(500).send("Something Failed: " + e.message);
  }
});

// Verify reset code and update password
router.put("/", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send("All fields are required.");
  }

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found.");

  // Check if the OTP matches the stored reset code
  if (user.resetCode !== parseInt(otp)) {
    return res.status(400).send("Invalid reset code.");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetCode = null; // Clear the reset code once used

  try {
    await user.save();
    return res.status(200).send("Password updated successfully.");
  } catch (error) {
    return res.status(500).send("Error updating password.");
  }
});

module.exports = router;
