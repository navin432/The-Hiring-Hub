// Handle Employee Promotion
router.post("/promotions", async (req, res) => {
    const { employeeId, newPosition, justification } = req.body;
  
    try {
      const employee = await Employee.findById(employeeId);
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const promotionDetails = {
        previousPosition: employee.position,
        newPosition,
        justification,
        date: new Date(),
      };
  
      // Update the employee position
      employee.position = newPosition;
  
      // Add promotion record
      if (!employee.promotionHistory) {
        employee.promotionHistory = [];
      }
      employee.promotionHistory.push(promotionDetails);
  
      await employee.save();
  
      res.status(200).json({ message: "Promotion successful", promotionDetails });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  