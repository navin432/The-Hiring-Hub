const upload = require("../middleware/fileUpload");
const express = require("express");
const { JobApplication, validate } = require("../models/jobApplication");
const { Job } = require("../models/job");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// POST: Create a new job application
router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "additionalDocs", maxCount: 5 },
  ]),
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

      const jobApplication = new JobApplication({
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
      res.status(201).send(jobApplication);
    } catch (err) {
      console.log("Server error:", err.message);
      res
        .status(500)
        .send("Error while saving job application: " + err.message);
    }
  }
);

// PUT: Update an existing job application by ID
router.put(
  "/:id",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
    { name: "additionalDocs", maxCount: 5 },
  ]),
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const job = await Job.findById(req.body.jobId);
    if (!job) return res.status(400).send("Job not found.");

    try {
      const jobApplication = await JobApplication.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        { new: true }
      );

      if (!jobApplication)
        return res.status(404).send("Job application not found.");

      res.send(jobApplication);
    } catch (err) {
      res
        .status(500)
        .send("Error while updating job application: " + err.message);
    }
  }
);

// GET: Retrieve all job applications
router.get("/", async (req, res) => {
  try {
    const jobApplications = await JobApplication.find();
    res.send(jobApplications);
  } catch (err) {
    res
      .status(500)
      .send("Error while retrieving job applications: " + err.message);
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
router.delete("/:id", async (req, res) => {
  const applicationId = req.params.id;

  try {
    const jobApplication = await JobApplication.findById(applicationId);
    if (!jobApplication) {
      return res.status(404).send("Job application not found.");
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
