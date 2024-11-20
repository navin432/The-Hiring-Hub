const mongoose = require("mongoose");
const Joi = require("joi");
const { Job } = require("./job");
const { User } = require("./user");

const jobApplicationSchema = new mongoose.Schema({
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
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
  educationLevel: {
    type: String,
    enum: ["High School", "Bachelor's", "Master's", "PhD"],
    required: true,
  },
  skills: {
    type: [String],
    default: [],
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
    enum: ["Pending", "Rejected", "Shortlisted"],
    default: "Pending",
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

function validateJobApplication(application) {
  const schema = Joi.object({
    jobId: Joi.objectId().required(),
    experience: Joi.number().required().min(0).max(20),
    educationLevel: Joi.string()
      .valid("High School", "Associate's", "Bachelor's", "Master's", "PhD")
      .required(),
    skills: Joi.array().items(Joi.string()).optional(),
    comments: Joi.string().max(500).allow("").optional(),
  });

  return schema.validate(application);
}

exports.JobApplication = JobApplication;
exports.validate = validateJobApplication;
