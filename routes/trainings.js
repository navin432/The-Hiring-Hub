const express = require("express");
const router = express.Router();
const Training = require("../models/training");

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const trainingChecklist = await Training.findOne({
      "employee.employeeEmail": email,
    });
    if (!trainingChecklist) {
      return res.status(404).json({ error: "Training checklist not found" });
    }

    res.status(200).json(trainingChecklist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve training checklist" });
  }
});

router.put("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Find and update the training checklist
    const trainingChecklist = await Training.findOneAndUpdate(
      { "employee.employeeEmail": email },
      updates,
      { new: true, runValidators: true } // Return the updated document and validate updates
    );

    if (!trainingChecklist) {
      return res.status(404).json({ error: "Training checklist not found" });
    }

    res.status(200).json(trainingChecklist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update training checklist" });
  }
});

module.exports = router;
