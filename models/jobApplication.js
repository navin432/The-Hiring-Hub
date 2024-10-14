const mongoose = require("mongoose");
const Joi = require("joi");
const { Job } = require("./job");

const jobApplicationSchema = new mongoose.Schema({
  job: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    max: 20,
  },
  resume: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  additionalDocs: {
    type: [String],
    default: [],
  },
  comments: {
    type: String,
    maxlength: 500,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  applicationStatus: {
    type: String,
    default: "Pending",
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

function validateJobApplication(application) {
  const schema = Joi.object({
    jobId: Joi.objectId().required(),
    experience: Joi.number().required().min(0).max(20),
    comments: Joi.string().max(500).allow("").optional(),
  });

  return schema.validate(application);
}

exports.JobApplication = JobApplication;
exports.validate = validateJobApplication;
