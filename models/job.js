const mongoose = require("mongoose");
const Joi = require("joi");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  location: {
    type: String,
    default: "740 Bathrust Street",
    minlength: 4,
    maxlength: 20,
  },
  jobDetails: {
    type: {
      positionSummary: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 500,
      },
      keyResponsibilities: {
        type: [String],
        required: true,
      },
      requirements: {
        type: [String],
        required: true,
      },
      jobType: {
        type: String,
        enum: ["Full-time", "Part-time"],
        required: true,
      },
      expectedStartDate: {
        type: Date,
        required: true,
      },
      minExperience: {
        type: Number,
        default: 0,
        min: 0,
        max: 20,
      },
      requiredSkills: {
        type: [String],
        default: [],
      },
      educationLevel: {
        type: String,
        enum: ["High School", "Bachelor's", "Master's", "PhD"],
        required: true,
      },
    },
    required: true,
  },
  jobCategory: {
    type: String,
    enum: ["Internal", "External", "Both"],
    default: "Both",
  },
});

const Job = mongoose.model("Job", jobSchema);
function validateJob(job) {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    location: Joi.string().min(4).max(254).required(),
    jobDetails: Joi.object({
      positionSummary: Joi.string().min(4).max(500).required(),
      keyResponsibilities: Joi.array().items(Joi.string()).required(),
      requirements: Joi.array().items(Joi.string()).required(),
      jobType: Joi.string().valid("Full-time", "Part-time").required(),
      expectedStartDate: Joi.date().required(),
      minExperience: Joi.number().min(0).max(20).optional(),
      requiredSkills: Joi.array().items(Joi.string()).optional(),
      educationLevel: Joi.string()
        .valid("High School", "Bachelor's", "Master's", "PhD")
        .required(),
      preferredQualifications: Joi.array().items(Joi.string()).optional(),
    }).required(),
    jobCategory: Joi.string().valid("Internal", "External", "Both").required(),
  });

  return schema.validate(job);
}

exports.Job = Job;
exports.validate = validateJob;
exports.jobSchema = jobSchema;
