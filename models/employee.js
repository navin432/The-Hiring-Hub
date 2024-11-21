const mongoose = require("mongoose");
const Employee = require("./userProfile");

const EmployeeSchema = new mongoose.Schema({
  employee: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeDepartment: {
      type: String,
      required: true,
    },
  },
  performance: {
    productivity: { type: Number, default: 0 },
    teamwork: { type: Number, default: 0 },
    punctuality: { type: Number, default: 0 },
    innovation: { type: Number, default: 0 },
  },
  remarks: { type: String, default: "" },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
