const mongoose = require("mongoose");
const Profile = require("./userProfile");

const ratingSchema = new mongoose.Schema({
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
  ratings: {
    productivity: { type: Number, default: 0 },
    teamwork: { type: Number, default: 0 },
    punctuality: { type: Number, default: 0 },
    innovation: { type: Number, default: 0 },
  },
  remarks: { type: String, default: "" },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
