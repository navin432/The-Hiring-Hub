const mongoose = require("mongoose");
const Profile = require("./userProfile");

const equipmentSchema = new mongoose.Schema({
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
  laptop: {
    isProvided: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  smartphone: {
    isProvided: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  vehicle: {
    isProvided: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  transportationFacility: {
    isProvided: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  other: {
    isProvided: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      trim: true,
    },
  },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
