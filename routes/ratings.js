const express = require("express");
const Rating = require("../models/rating");
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
    const rating = await Rating.findOne({ _id: employeeId });
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
  const { ratings, remarks, average } = req.body;

  try {
    // Find the rating for the employee
    const rating = await Rating.findOne({ _id: employeeId });
    if (!rating) {
      return res.status(404).send("Ratings for the employee not found.");
    }

    // Update the ratings and remarks
    rating.ratings = ratings;
    rating.remarks = remarks;
    if (average.value && average.date) {
      rating.average.push({
        value: average.value,
        date: average.date,
      });
    }
    await rating.save();
    res.send(rating);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to update ratings.", details: err.message });
  }
});

// Promotions
router.put("/:employeeId/promotions", async (req, res) => {
  const { employeeId } = req.params; // Extract employeeId from the URL
  const { newPosition, previousPosition, justification } = req.body;

  try {
    // Find the rating for the employee
    const rating = await Rating.findOne({ _id: employeeId });
    if (!rating) {
      return res.status(404).send("Employee not found.");
    }

    // Add a new promotion entry to the promotions array
    if (newPosition && previousPosition && justification) {
      // Reset ratings to zero
      rating.ratings.productivity = 0;
      rating.ratings.teamwork = 0;
      rating.ratings.punctuality = 0;
      rating.ratings.innovation = 0;

      // Clear the past averages and reset to zero
      rating.average = [
        {
          value: 0,
          date: new Date().toISOString().split("T")[0], // Use the current date for the reset
        },
      ];

      // Add the promotion to the promotions array
      rating.promotions.push({
        newPosition,
        previousPosition,
        justification,
        date: new Date(), // Add the current date for the promotion
      });

      await rating.save();
      res.send(rating);
    } else {
      res.status(400).send("Missing required fields for the promotion.");
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "Failed to update promotions.", details: err.message });
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
