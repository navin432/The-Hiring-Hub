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
    },
    required: true,
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
    }).required(),
  });

  return schema.validate(job);
}

exports.Job = Job;
exports.validate = validateJob;
exports.jobSchema = jobSchema;
