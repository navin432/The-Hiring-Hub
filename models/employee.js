const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  performance: {
    productivity: { type: Number, default: 0 },
    teamwork: { type: Number, default: 0 },
    punctuality: { type: Number, default: 0 },
    innovation: { type: Number, default: 0 },
  },
  remarks: { type: String, default: "" },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
