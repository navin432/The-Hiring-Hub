const { User, validate } = require("../models/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const app = require("express");
const nodemailer = require("nodemailer");
const config = require("config");

const router = app.Router();

// Mail
const hhhMail = config.get("thhEmail");
const hhhPass = config.get("password");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: hhhMail,
    pass: hhhPass,
  },
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registred");
  user = new User(_.pick(req.body, ["name", "email", "password", "role"]));
  user.email = user.email.toLowerCase();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    "jwtPrivateKey"
  );
  try {
    await user.save();

    // Email options
    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: user.email,
      subject: "Welcome to, The Hiring Hub",
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
              <h2>Welcome to The Hiring Hub!</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${user.name}</strong>,</p>
              <p>Thank you for registering at The Hiring Hub! We are excited to have you onboard and look forward to helping you in your job search journey.</p>
              <p>Good luck with your job hunt! We’re confident that you’ll find great opportunities with us.</p>
              <p>If you need any help, feel free to reach out at any time. We’re here to assist you.</p>
              <p>Looking forward to working with you!</p>
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
    res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
  } catch (e) {
    res.status(500).send("Something Failed: " + e.message);
  }
});

// Verify reset code and update password
router.put("/", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send("All fields are required.");
  }

  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found.");

  // Check if the OTP matches the stored reset code
  if (user.resetCode !== parseInt(otp)) {
    return res.status(400).send("Invalid reset code.");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetCode = null; // Clear the reset code once used

  try {
    await user.save();
    // Email options for password reset confirmation
    const mailOptions = {
      from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
      to: user.email,
      subject: "Your Password Has Been Successfully Reset",
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
          background-color: #28a745;
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
          <h2>Password Reset Successful!</h2>
        </div>
        <div class="content">
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your password has been successfully reset. You can now log in using your new password.</p>
          <p>If you did not request this change, please contact our support team immediately.</p>
          <p>Thank you for being a part of The Hiring Hub!</p>
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

    // Send the email after updating the password
    await transporter.sendMail(mailOptions);
    return res.status(200).send("Password updated successfully.");
  } catch (error) {
    return res.status(500).send("Error updating password.");
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error retrieving users: " + error.message);
  }
});

router.put("/it/:id", async (req, res) => {
  const { name, email, role } = req.body;
  const userId = req.params.id;

  // Validate the input
  if (!name || !email || !role) {
    return res.status(400).send("Name, email, and role are required.");
  }

  try {
    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    // Return the updated user object as the response
    res.status(200).send(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
