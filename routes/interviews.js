const express = require("express");
const Interview = require("../models/interview");
const { JobApplication } = require("../models/jobApplication");
const nodemailer = require("nodemailer");
const config = require("config");
const router = express.Router();

const hhhMail = config.get("thhEmail");
const hhhPass = config.get("password");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: hhhMail,
    pass: hhhPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Create (POST) - Add a new interview
router.post("/", async (req, res) => {
  const { applicantEmail, interviewDate } = req.body;

  try {
    const existingInterview = await Interview.findOne({
      "applicant.applicantEmail": applicantEmail,
    });

    if (existingInterview) {
      return res
        .status(400)
        .send("An interview has already been scheduled for this applicant.");
    }
    // Find the job application based on applicantEmail
    const jobApplication = await JobApplication.findOne({
      "user.applicantEmail": applicantEmail,
    });

    if (!jobApplication) {
      return res
        .status(404)
        .send("Job application not found for the provided email");
    }

    // Create a new interview
    const interview = new Interview({
      applicant: {
        application_id: jobApplication._id,
        applicantName: jobApplication.user.applicantName,
        applicantEmail: jobApplication.user.applicantEmail,
      },
      jobTitle: jobApplication.job.title,
      interviewDate,
    });

    // Save the interview
    await interview.save();

    // Send email notification
    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: applicantEmail,
      subject: "Interview Scheduled",
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
              background-color: #007bff;
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
              <h2>Congrats !! Interview is Scheduled for ${jobApplication.job.title}</h2>
            </div>
            <div class="content">
              <p>Thank you for your interest at The Hiring Hub! We are excited to meet you and get familiar with your knowledge and skills.</p>
              <p>We have scheduled your interview for the position of <strong>${jobApplication.job.title}</strong> on ${interviewDate}.</p>
              <p>If you need further help with modifying or rescheduling, feel free to reach out at any time. We’re here to assist you.</p>
              <p>Looking forward to meeting you!</p>
              <p>Best regards,</p>
              <p>HR</p>
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

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Interview scheduled and email sent successfully");
  } catch (error) {
    console.error("Error saving interview or sending email:", error);
    res.status(500).send("Failed to schedule the interview or send the email");
  }
});

// Read (GET) - Get all scheduled interviews
router.get("/", async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    res.status(500).send("Server error");
  }
});

// Read (GET) - Get a specific interview by ID
router.get("/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    res.status(200).json(interview);
  } catch (err) {
    console.error("Error fetching interview:", err);
    res.status(500).send("Server error");
  }
});

// Delete (DELETE) - Delete an interview by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedInterview = await Interview.findByIdAndDelete(req.params.id);
    if (!deletedInterview) {
      return res.status(404).send("Interview not found");
    }
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (err) {
    console.error("Error deleting interview:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
