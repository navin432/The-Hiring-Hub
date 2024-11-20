const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  mailingAddress: { type: String },
  emergencyContact: { type: String },
  dateOfBirth: { type: Date, required: true },
  description: { type: String },
  department: { type: String, required: true },
  linkedIn: { type: String },
  github: { type: String },
  sinNumber: { type: String, required: true },
  bankInfo: {
      institutionNumber: { type: String, required: true },
      transitNumber: { type: String, required: true },
      accountNumber: { type: String, required: true },
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
