const mongoose = require("mongoose");
const { JobApplication } = require("./jobApplication");

const interviewSchema = new mongoose.Schema({
  applicant: {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: JobApplication,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
  },
  jobTitle: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  round: {
    type: Number,
    default: 1,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
