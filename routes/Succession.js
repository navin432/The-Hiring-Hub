//Add a Successor to a Role
router.post("/succession/add", async (req, res) => {
    const { roleId, successorId, readiness, developmentPlan } = req.body;
  
    try {
      const role = await Role.findById(roleId);
      const successor = await Employee.findById(successorId);
  
      if (!role || !successor) {
        return res.status(404).json({ message: "Role or Employee not found" });
      }
  
      const successorEntry = {
        successorId,
        name: successor.name,
        readiness,
        developmentPlan,
        dateAdded: new Date(),
      };
  
      role.successors.push(successorEntry);
      await role.save();
  
      res.status(200).json({ message: "Successor added successfully", role });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  //Get All Key Roles and Successors
  router.get("/succession", async (req, res) => {
    try {
      const roles = await Role.find().populate("currentHolder").populate("successors.successorId");
      res.status(200).json(roles);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  


  //Remove a Successor
  router.delete("/succession/remove", async (req, res) => {
    const { roleId, successorId } = req.body;
  
    try {
      const role = await Role.findById(roleId);
  
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
  
      role.successors = role.successors.filter(s => s.successorId.toString() !== successorId);
      await role.save();
  
      res.status(200).json({ message: "Successor removed successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  