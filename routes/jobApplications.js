const jwt = require("jsonwebtoken");
const upload = require("../middleware/fileUpload");
const express = require("express");
const { JobApplication, validate } = require("../models/jobApplication");
const { Job } = require("../models/job");
const { User } = require("../models/user");
const Rejection = require("../models/rejection");
const fs = require("fs");
const path = require("path");
const config = require("config");
const nodemailer = require("nodemailer");

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

async function sendRejectionEmail(userEmail, jobTitle, userName) {
  const hhhMail = config.get("thhEmail");
  const hhhPass = config.get("password");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: hhhMail,
      pass: hhhPass,
    },
  });

  const mailOptions = {
    from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
    to: userEmail,
    subject: `Application Rejection for ${jobTitle}`,
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f4f4f4;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            background-color: #dc3545; /* Bootstrap danger color */
            color: white;
            padding: 10px;
            border-radius: 5px;
          }
          .content {
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Application Status Update</h2>
          </div>
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at The Hiring Hub.</p>
            <p>We appreciate the time and effort you invested in your application. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
            <p>This decision was not easy, and it reflects the competitive nature of the hiring process. We encourage you to apply for future openings that match your qualifications and experience.</p>
            <p>Thank you for your understanding, and we wish you all the best in your job search.</p>
            <p>Best regards,</p>
            <p>The Hiring Hub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 The Hiring Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

const educationLevelMap = {
  "High School": 1,
  "Bachelor's": 2,
  "Master's": 3,
  PhD: 4,
};

function meetsJobCriteria(job, applicant) {
  const experienceMatch = applicant.experience >= job.jobDetails.minExperience;
  const jobEducationLevel = educationLevelMap[job.jobDetails.educationLevel];
  const applicantEducationLevel = educationLevelMap[applicant.educationLevel];
  const educationMatch = applicantEducationLevel >= jobEducationLevel;
  const skillsMatch = job.jobDetails.requiredSkills.every((skill) =>
    applicant.skills.includes(skill)
  );
  return experienceMatch && educationMatch && skillsMatch;
}

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

      const user = await User.findById(req.user._id);

      // Check if the user has already applied for this job
      const existingApplication = await JobApplication.findOne({
        "user._id": req.user._id,
        "job._id": req.body.jobId,
      });
      if (existingApplication) {
        return res.status(400).send({
          message: "You have already applied for this job.",
        });
      }

      const rejectionStatus = await Rejection.findOne({
        userId: req.user._id,
        jobId: req.body.jobId,
        status: "rejected",
      });

      if (rejectionStatus) {
        const rejectionDate = rejectionStatus.date;
        const currentDate = new Date();
        const diffTime = currentDate - rejectionDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
          return res.status(400).json({
            role: user.role,
            message: `You cannot apply for this job again for 30 days after rejection.
              Try again after ${30 - diffDays} days`,
            redirect: true,
          });
        }
      }

      const applicantDetails = {
        experience: req.body.experience,
        educationLevel: req.body.educationLevel,
        skills: req.body.skills,
      };

      if (!meetsJobCriteria(job, applicantDetails)) {
        const rejection = new Rejection({
          userId: req.user._id,
          jobId: req.body.jobId,
        });
        await rejection.save();
        await sendRejectionEmail(user.email, job.title, user.name);
        return res.status(400).send({
          role: user.role,
          message:
            "Your application has been rejected as it did not meet the job criteria.",
          redirect: true,
        });
      }

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
        educationLevel: req.body.educationLevel,
        skills: req.body.skills,
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
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send("Job not found.");
    }
    const jobApplications = await JobApplication.find({
      "job._id": req.params.id,
    }).exec();
    res.send({ job, jobApplications });
  } catch (err) {
    res
      .status(500)
      .send("Error while retrieving job applications: " + err.message);
  }
});

// DELETE: Delete a job application by ID and its associated files
router.delete("/:id", authMiddleware, async (req, res) => {
  const applicationId = req.params.id;

  try {
    const jobApplication = await JobApplication.findOne({
      _id: applicationId,
    });
    if (!jobApplication) {
      return res.status(404).send({ message: "Job application not found." });
    }
    if (req.user.role === "hR") {
      const { applicantEmail, applicantName } = jobApplication.user;
      const jobTitle = jobApplication.job.title;

      await sendRejectionEmail(applicantEmail, jobTitle, applicantName);
      console.log("Rejection email sent.");
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
