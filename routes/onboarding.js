// routes/onboarding.js
const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

router.get('/', async (req, res) => {
  const { token } = req.query;

  try {
    // Validate token
    const candidate = await Candidate.findOne({ onboardingToken: token });

    if (!candidate) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Send onboarding details to front end (or render onboarding page if using server-side rendering)
    res.json({ candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error loading onboarding page', error });
  }
});

module.exports = router;
