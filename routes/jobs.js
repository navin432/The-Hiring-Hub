const express = require("express");
const { Job, validate } = require("../models/job");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const job = new Job({
    title: req.body.title,
    location: req.body.location,
    jobDetails: req.body.jobDetails,
  });

  try {
    await job.save();
    res.send(job);
  } catch (err) {
    res.status(500).send("Something failed: " + err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (err) {
    res.status(500).send("Something failed: " + err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.send(job);
  } catch (err) {
    res.status(500).send("Something failed: " + err.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        location: req.body.location,
        jobDetails: req.body.jobDetails,
      },
      { new: true }
    );

    if (!job) return res.status(404).send("Job not found");

    res.send(job);
  } catch (err) {
    res.status(500).send("Something failed: " + err.message);
  }
});

// DELETE: Remove a specific job by ID
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.send(job);
  } catch (err) {
    res.status(500).send("Something failed: " + err.message);
  }
});

module.exports = router;
