const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).send("User not found");

    // Send user details as JSON
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
