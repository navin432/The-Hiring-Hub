const express = require("express");
const { User } = require("../models/user");
const nodemailer = require("nodemailer");
const router = express.Router();
const config = require("config");

// Generate and send the reset code
router.put("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send("Email is required.");

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found.");

    // Generate 6-digit random reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000);

    // Update the user's resetCode in the database
    user.resetCode = resetCode;
    await user.save();

    // Configure the email transporter
    const hhhMail = config.get("thhEmail");
    const hhhPass = config.get("password");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: hhhMail,
        pass: hhhPass,
      },
    });

    // Email options
    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: user.email,
      subject: "The Hiring Hub Password Reset Code",
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
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
              color: #111;
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
            .btn {
              display: inline-block;
              background-color: #28a745;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Code</h2>
            </div>
            <div class="content">
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>We received a request to reset your password for your account at The Hiring Hub.</p>
              <p>Your password reset code is: <strong>${resetCode}</strong></p>
              <p>Please use this code to reset your password.</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The Hiring Hub Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 The Hiring Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success if no error occurs
    return res.status(200).send("Reset code sent to your email.");
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).send("Error sending reset code.");
  }
});

module.exports = router;
