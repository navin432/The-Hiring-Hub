const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const access = ["admin", "manager", "hR", "employee"];

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const role = user.role;
  const userName = user.name;
  const userEmail= user.email;
  if (req.body.role === "employee" && access.includes(role)) {
    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role },
      "jwtPrivateKey"
    );
    res.send({ role, token ,userName,userEmail});
  } else if (req.body.role === "guest" && role === "guest") {
    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role },
      "jwtPrivateKey"
    );
    res.send({ role, token, userName, userEmail});
  } else {
    return res.status(400).send("Authorization Failed, Invalid Role");
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(254).required().email(),
    password: Joi.string().min(6).max(254).required(),
    role: Joi.string().required(),
  });
  return schema.validate(req);
}

module.exports = router;
