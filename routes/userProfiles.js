const Profile = require("../models/userProfile");
const app = require("express");
const router = app.Router();

// GET request to fetch profile by email
router.get("/:email", async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST request to create a new profile
router.post("/", async (req, res) => {
  const {
    email,
    name=req.body.employeeName,
    phone,
    permanentAddress,
    mailingAddress,
    emergencyContact,
    dateOfBirth,
    description,
    department,
    linkedIn,
    github,
    sinNumber,
    bankInfo,
  } = req.body;

  try {
    // Check if a profile with the same email already exists
    let profile = await Profile.findOne({ email });
    if (profile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Create a new profile
    const newProfile = new Profile({
      email,
      name,
      phone,
      permanentAddress,
      mailingAddress,
      emergencyContact,
      dateOfBirth,
      description,
      department,
      linkedIn,
      github,
      sinNumber,
      bankInfo,
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Error creating profile", error });
  }
});

// PUT request to update an existing profile by email
router.put("/:email", async (req, res) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    // Find the profile by email and update it
    const profile = await Profile.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});

// DELETE request to delete a profile by email
router.delete("/:email", async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile", error });
  }
});

module.exports = router;