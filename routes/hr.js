// routes/hr.js
const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const sendOnboardingEmail = require('../utils/sendOnboardingEmail'); // Your email function
const crypto = require('crypto');

router.post('/hire', async (req, res) => {
  const { email } = req.body;

  try {
    // Find candidate by email
    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Update candidate status and generate token
    candidate.status = 'hired';
    candidate.onboardingToken = crypto.randomBytes(32).toString('hex'); // Secure token
    await candidate.save();

    // Send onboarding email with link
    const onboardingLink = `http://localhost:3000/html/HR/OnboardingPage.html?token=${candidate.onboardingToken}`;
    await sendOnboardingEmail(candidate.email, onboardingLink);

    res.json({ message: 'Candidate hired and email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error hiring candidate', error });
  }
});

module.exports = router;
