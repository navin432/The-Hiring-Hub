const express = require("express");
const router = express.Router();
const { Employee } = require("../models/employee");
const { Profile } = require("../models/userProfile");

// GET route to fetch all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Server error");
  }
});

// POST route for adding or updating employee performance data
router.post("/", async (req, res) => {
  const { employeeId, performance, remarks } = req.body;

  try {
    // Check if the employee already exists
    let employee = await Employee.findOne({ "employee._id": employeeId });
    let profile = await Profile.findOne({ _id: employeeId });

    // If the employee exists, update the data
    if (employee) {
      employee.performance = performance || employee.performance;
      employee.remarks = remarks || employee.remarks;
      await employee.save();
      return res
        .status(200)
        .json({ message: "Employee performance updated", employee });
    }

    // If the employee doesn't exist, create a new one
    employee = new Employee({
      employee: {
        _id: employeeId,
        employeeName: profile.name,
        employeeDepartment: profile.department,
      },
      performance,
      remarks,
    });

    await employee.save();
    res
      .status(201)
      .json({ message: "New employee performance created", employee });
  } catch (err) {
    console.error("Error saving employee data:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
