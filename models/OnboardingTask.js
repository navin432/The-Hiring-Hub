const mongoose = require('mongoose');

const onboardingTaskSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  taskName: { type: String, required: true },
  status: { type: String, default: 'incomplete' }, // 'incomplete', 'complete'
});

module.exports = mongoose.model('OnboardingTask', onboardingTaskSchema);
