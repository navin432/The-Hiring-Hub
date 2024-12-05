const express = require("express");
const Equipment = require("../models/equipment");
const Profile = require("../models/userProfile");
const router = express.Router();

// Route to add equipment for an employee (no check for existing equipment)
router.post("/", async (req, res) => {
  const {
    employeeEmail,
    laptop = {},
    smartphone = {},
    vehicle = {},
    transportationFacility = {},
    other = {},
  } = req.body;

  // Validate the request body
  if (!employeeEmail) {
    return res.status(400).json({ error: "Employee email is required" });
  }

  try {
    // Find the employee profile by email
    let profile = await Profile.findOne({ email: employeeEmail });
    if (!profile) {
      return res.status(400).json({ message: "Profile doesn't exist" });
    }

    // Create a new equipment entry
    const equipment = new Equipment({
      employee: {
        _id: profile._id,
        employeeName: profile.name,
        employeeEmail: profile.email,
      },
      laptop,
      smartphone,
      vehicle,
      transportationFacility,
      other,
    });

    // Save the equipment details
    await equipment.save();

    // Respond with the saved equipment details
    res.status(200).json({
      message: "Equipment details saved successfully",
      equipment,
    });
  } catch (error) {
    console.error("Error saving equipment details:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

// Route to get all equipment details
router.get("/", async (req, res) => {
  try {
    // Fetch all equipment details from the database
    const equipmentList = await Equipment.find().populate("employee");
    if (equipmentList.length === 0) {
      return res.status(404).json({ message: "No equipment found" });
    }

    // Respond with the equipment list
    res.status(200).json({
      message: "Equipment details fetched successfully",
      equipmentList,
    });
  } catch (error) {
    console.error("Error fetching equipment details:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

module.exports = router;
