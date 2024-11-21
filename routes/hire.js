const nodemailer = require("nodemailer");
const { User } = require("../models/user");
const { JobApplication } = require("../models/jobApplication");
const config = require("config");
const app = require("express");
const router = app.Router();
const fs = require("fs");
const path = require("path");

router.post("/", async (req, res) => {
  const email = req.body.email;
  const jobApplication = await JobApplication.findOne({
    _id: req.body.applicationId,
  });
  if (!jobApplication) return res.status(404).send("Application not found");

  // Fetch user
  let user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

  // Update user's role
  user.role = "employee";
  try {
    // Save updated user
    await user.save();

    // Prepare for sending email
    const hhhMail = config.get("thhEmail");
    const hhhPass = config.get("password");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: hhhMail, pass: hhhPass },
    });

    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: email,
      subject: "Congratulations, You’re Hired! Start Your Onboarding Process",
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
              <h2>Application Status Update</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${user.name}</strong>,</p>
              <p>We are delighted to inform you that you have been selected for the <strong>${jobApplication.job.title}</strong> position at The Hiring Hub!</p>
              <p>We were impressed by your skills and qualifications, and we are excited to have you join our team. Please click the link below to begin your onboarding process:</p>
              <p><a href="http://localhost:3000/html/HR/OnboardingPage.html">Start Onboarding</a></p>
              <p>Also, your role has been updated to <strong>employee</strong>. Next time you log in, please select "employee" as your role, as you are no longer a guest.</p>
              <p>We look forward to working with you and supporting your success in this new role.</p>
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

    // Send email
    await transporter.sendMail(mailOptions);

    // Handle file deletion
    const filesToDelete = [
      jobApplication.resume,
      jobApplication.coverLetter,
      ...(jobApplication.additionalDocs || []),
    ];

    filesToDelete.forEach((filePath) => {
      if (filePath) {
        const file = path.join(__dirname, "../", filePath); //Join to get the full file path
        if (fs.existsSync(file)) {
          fs.unlinkSync(file); // Delete the file
        }
      }
    });
    
    await JobApplication.findByIdAndDelete(req.body.applicationId);
    res.send(
      "Candidate successfully hired and associated files and job application deleted"
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

module.exports = router;
