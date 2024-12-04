const express = require("express");
const Rating = require("../models/rating"); // Mongoose model
const router = express.Router();

// Fetch all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.send(ratings);
  } catch (err) {
    res.status(500).send({
      error: "Failed to fetch ratings.",
      details: err.message,
    });
  }
});

// GET /api/ratings/:employeeId - Get ratings for a specific employee
router.get("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const rating = await Rating.findOne({ "employee._id": employeeId });
    if (!rating) {
      return res.status(404).send("Ratings for the employee not found.");
    }

    res.send(rating);
  } catch (err) {
    res.status(500).send({
      error: "Failed to fetch ratings.",
      details: err.message,
    });
  }
});

// PUT /api/ratings/:employeeId - Update ratings and remarks for a specific employee
router.put("/:employeeId", async (req, res) => {
  // Modified to use only employeeId, not month
  const { employeeId } = req.params; // Extract employeeId from the URL
  const { ratings, remarks } = req.body;

  try {
    // Find the rating for the employee
    const rating = await Rating.findOne({ _id: employeeId });
    if (!rating) {
      return res.status(404).send("Ratings for the employee not found.");
    }

    // Update the ratings and remarks
    rating.ratings = ratings;
    rating.remarks = remarks;

    await rating.save();
    res.send(rating);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to update ratings.", details: err.message });
  }
});
// DELETE /api/ratings/:employeeId - Delete all ratings for an employee
router.delete("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const result = await Rating.findOneAndDelete({
      "employee._id": employeeId,
    });
    if (!result) {
      return res.status(404).send("Ratings for the employee not found.");
    }

    res.send({
      message: "All ratings for the employee deleted successfully.",
    });
  } catch (err) {
    res.status(500).send({
      error: "Failed to delete all ratings.",
      details: err.message,
    });
  }
});

module.exports = router;
