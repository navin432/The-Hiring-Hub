const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, default: 'applicant' }, // 'applicant', 'hired', 'employee'
  contact: { type: String },
  emergencyContact: { type: String },
  onboardingToken: { type: String }, // For secure onboarding link
  onboardingProgress: { type: Boolean, default: false }, // Tracks if onboarding is complete
  documents: {
    idProof: { type: String }, // File path or URL
    resume: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
