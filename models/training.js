const mongoose = require("mongoose");
const Profile = require("./userProfile");

// Schema for the Training Checklist
const trainingChecklistSchema = new mongoose.Schema({
  employee: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Profile,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
  },
  usingCompanyWebsite: {
    type: Boolean,
    default: false,
  },
  readingEmployeeHandbook: {
    type: Boolean,
    default: false,
  },
  basicFirstAidTraining: {
    type: Boolean,
    default: false,
  },
  workplaceSafety: {
    type: Boolean,
    default: false,
  },
  introductionToTeamMembers: {
    type: Boolean,
    default: false,
  },
  communicationToolsTraining: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Training = mongoose.model("Training", trainingChecklistSchema);

module.exports = Training;
