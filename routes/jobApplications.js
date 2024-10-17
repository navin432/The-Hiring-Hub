const jwt = require("jsonwebtoken");
const upload = require("../middleware/fileUpload");
const express = require("express");
const { JobApplication, validate } = require("../models/jobApplication");
const { Job } = require("../models/job");
const { User } = require("../models/user");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

// POST: Create a new job application
router.post(
  "/",
  [
    authMiddleware,
    upload.fields([
      { name: "resume", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
      { name: "additionalDocs", maxCount: 5 },
    ]),
  ],
  async (req, res) => {
    try {
      const { error } = validate(req.body);
      if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send(error.details[0].message);
      }

      const job = await Job.findById(req.body.jobId);
      if (!job) {
        console.log("Job not found for ID:", req.body.jobId);
        return res.status(400).send("Job not found.");
      }

      // Check if the user has already applied for this job
      const existingApplication = await JobApplication.findOne({
        "user._id": req.user._id,
        "job._id": req.body.jobId,
      });
      if (existingApplication) {
        return res
          .status(400)
          .send({ message: "You have already applied for this job." });
      }

      const user = await User.findById(req.user._id);

      const jobApplication = new JobApplication({
        user: {
          _id: user._id,
          applicantName: user.name,
          applicantEmail: user.email,
        },
        job: {
          _id: job._id,
          title: job.title,
        },
        experience: req.body.experience,
        resume: req.files["resume"]
          ? `/uploads/${req.files["resume"][0].filename}`
          : undefined,
        coverLetter: req.files["coverLetter"]
          ? `/uploads/${req.files["coverLetter"][0].filename}`
          : undefined,
        additionalDocs: req.files["additionalDocs"]
          ? req.files["additionalDocs"].map(
              (file) => `/uploads/${file.filename}`
            )
          : undefined,
        comments: req.body.comments,
      });

      // Save to the database
      await jobApplication.save();
      res.status(201).send({ jobApplication: jobApplication, role: user.role });
    } catch (err) {
      console.log("Server error:", err.message);
      res
        .status(500)
        .send("Error while saving job application: " + err.message);
    }
  }
);

// GET: Retrieve all job applications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobApplications = await JobApplication.find({
      "user._id": req.user._id,
    });
    res.send(jobApplications);
  } catch (err) {
    res.status(500).send({
      message: "Error while retrieving job applications: " + err.message,
    });
  }
});

// GET: Retrieve a specific job application by ID
router.get("/:id", async (req, res) => {
  try {
    const jobApplication = await JobApplication.findById(req.params.id);
    if (!jobApplication)
      return res.status(404).send("Job application not found.");

    res.send(jobApplication);
  } catch (err) {
    res
      .status(500)
      .send("Error while retrieving job application: " + err.message);
  }
});

// DELETE: Delete a job application by ID and its associated files
router.delete("/:id", authMiddleware, async (req, res) => {
  const applicationId = req.params.id;

  try {
    const jobApplication = await JobApplication.findOne({
      _id: applicationId,
      "user._id": req.user._id,
    });
    if (!jobApplication) {
      return res.status(404).send({ message: "Job application not found." });
    }

    // Delete the associated files (if any)
    const filesToDelete = [
      jobApplication.resume,
      jobApplication.coverLetter,
      ...(jobApplication.additionalDocs || []),
    ];

    // Delete each file from the filesystem
    filesToDelete.forEach((filePath) => {
      if (filePath) {
        const file = path.join(__dirname, "../", filePath); //Join to get the full file path
        if (fs.existsSync(file)) {
          fs.unlinkSync(file); // Delete the file
        }
      }
    });

    await JobApplication.findByIdAndDelete(applicationId);

    res.send("Job application and associated files deleted successfully.");
  } catch (err) {
    console.error("Error while deleting job application:", err);
    res
      .status(500)
      .send("Error while deleting job application: " + err.message);
  }
});

module.exports = router;
