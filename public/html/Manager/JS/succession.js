document.addEventListener("DOMContentLoaded", async () => {
  const keyRolesTable = document.getElementById("keyRolesTable");
  const roleSelector = document.getElementById("role");
  const successorSelector = document.getElementById("successor");

  // Fetch roles and populate dropdowns and table
  async function fetchRoles() {
    const response = await fetch("http://localhost:5000/api/succession");
    const roles = await response.json();

    // Populate role dropdown
    roles.forEach(role => {
      const option = document.createElement("option");
      option.value = role._id;
      option.textContent = role.name;
      roleSelector.appendChild(option);
    });

    // Populate key roles table
    roles.forEach(role => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${role.name}</td>
        <td>${role.currentHolder?.name || "Vacant"}</td>
        <td>
          ${role.successors.map(s => `${s.name} (${s.readiness})`).join(", ") || "None"}
        </td>
        <td><button data-role-id="${role._id}" class="btn-remove">Remove</button></td>
      `;
      keyRolesTable.appendChild(row);
    });
  }

  // Fetch employees and populate successors dropdown
  async function fetchEmployees() {
    const response = await fetch("http://localhost:5000/api/employees");
    const employees = await response.json();

    employees.forEach(employee => {
      const option = document.createElement("option");
      option.value = employee._id;
      option.textContent = employee.name;
      successorSelector.appendChild(option);
    });
  }

  // Add successor
  document.getElementById("addSuccessorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const roleId = roleSelector.value;
    const successorId = successorSelector.value;
    const readiness = document.getElementById("readiness").value;
    const developmentPlan = document.getElementById("developmentPlan").value;

    const response = await fetch("http://localhost:5000/api/succession/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId, successorId, readiness, developmentPlan }),
    });

    const data = await response.json();
    alert(data.message);
    location.reload(); // Refresh to reflect changes
  });

  await fetchRoles();
  await fetchEmployees();
});

  