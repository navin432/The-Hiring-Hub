const express = require('express');
const AvailableTime = require('../models/availability');
const nodemailer=require("nodemailer");
const config = require("config");
const router = express.Router();

const hhhMail = config.get("thhEmail");
const hhhPass = config.get("password");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: hhhMail,
        pass: hhhPass
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});
// Create (POST) - Add a new available time
router.post('/', async (req, res) => {
    const { availableTime, clientEmail, message } = req.body;

    if (!availableTime || !clientEmail) {
        return res.status(400).send('Available time and client email are required');
    }
    const availabletime = new AvailableTime(req.body);
    availabletime.save();

    const mailOptions = {
        from: '"The Hiring Hub" <thehiringhubx@gmail.com>',
        to: clientEmail,
        subject: 'Interview Time-slots', 
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
              <h2>Congrats !! Interview is Scheduled</h2>
            </div>
            <div class="content">
              
              <p>Thank you for your interest at The Hiring Hub! We are excited to meet you and get familiar with your knowledge and skills.</p>
              <p>We hereby schedule you on our one-on-one in-person interview on ${availableTime} at office building. We’re confident that you’ll prove yourself as the best candidate.</p>
              <p>If you need further help on modifying or rescheduling, feel free to reach out at any time. We’re here to assist you.</p>
              <p>Looking forward to working with you!</p>
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

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send the email');
    }
});

// Read (GET) - Get all available times
router.get('/', async (req, res) => {
    try {
        const availableTimes = await AvailableTime.find();
        res.status(200).json(availableTimes);
    } catch (err) {
        console.error('Error fetching available times:', err);
        res.status(500).send('Server error');
    }
});

// Read (GET) - Get a specific available time by ID
router.get('/:id', async (req, res) => {
    try {
        const availableTime = await AvailableTime.findById(req.params.id);
        if (!availableTime) {
            return res.status(404).send('Available time not found');
        }
        res.status(200).json(availableTime);
    } catch (err) {
        console.error('Error fetching available time:', err);
        res.status(500).send('Server error');
    }
});

// Update (PUT) - Update an available time by ID
router.put('/:id', async (req, res) => {
    const { availableTime, clientEmail,  message} = req.body;

    try {
        const updatedAvailableTime = await AvailableTime.findByIdAndUpdate(
            req.params.id,
            { availableTime, clientEmail, senderName, message, status },
            { new: true, runValidators: true }
        );

        if (!updatedAvailableTime) {
            return res.status(404).send('Available time not found');
        }

        res.status(200).json(updatedAvailableTime);
    } catch (err) {
        console.error('Error updating available time:', err);
        res.status(500).send('Server error');
    }
});

// Delete (DELETE) - Delete an available time by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAvailableTime = await AvailableTime.findByIdAndDelete(req.params.id);
        if (!deletedAvailableTime) {
            return res.status(404).send('Available time not found');
        }

        res.status(200).json({ message: 'Available time deleted successfully' });
    } catch (err) {
        console.error('Error deleting available time:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;