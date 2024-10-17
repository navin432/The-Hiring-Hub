const Profile = require("../models/userProfile");
const app = require("express");
const router = app.Router();

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

// POST or UPDATE profile data
router.post("/", async (req, res) => {
  const {
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
  } = req.body;

  try {
    // Ensure email is provided
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to update profile" });
    }

    // Find the profile by email
    let profile = await Profile.findOne({ email });

    if (profile) {
      // Update the profile if it exists
      profile.name = name || profile.name;
      profile.phone = phone || profile.phone;
      profile.permanentAddress = permanentAddress || profile.permanentAddress;
      profile.mailingAddress = mailingAddress || profile.mailingAddress;
      profile.emergencyContact = emergencyContact || profile.emergencyContact;
      profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
      profile.description = description || profile.description;
      profile.department = department || profile.department;
      profile.linkedIn = linkedIn || profile.linkedIn;
      profile.github = github || profile.github;

      await profile.save();
      return res
        .status(200)
        .json({ message: "Profile updated successfully", profile });
    } else {
      // Create a new profile if it doesn't exist
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
      });

      await newProfile.save();
      return res
        .status(201)
        .json({ message: "Profile created successfully", profile: newProfile });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
});
module.exports = router;
