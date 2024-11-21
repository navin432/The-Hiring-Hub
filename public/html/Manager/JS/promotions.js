document.addEventListener("DOMContentLoaded", async () => {
    const employeeSelector = document.getElementById("employee");
    const promotionHistory = document.getElementById("promotionHistory");
  
    // Fetch employees for dropdown
    async function fetchEmployees() {
      const response = await fetch("http://localhost:5000/api/employees");
      const data = await response.json();
  
      data.forEach((employee) => {
        const option = document.createElement("option");
        option.value = employee._id;
        option.textContent = `${employee.name} - ${employee.position}`;
        employeeSelector.appendChild(option);
      });
    }
  
    // Submit promotion form
    document.getElementById("promotionForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const employeeId = employeeSelector.value;
      const newPosition = document.getElementById("newPosition").value;
      const justification = document.getElementById("justification").value;
  
      const response = await fetch("http://localhost:5000/api/employees/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, newPosition, justification }),
      });
  
      const data = await response.json();
      alert(data.message);
      if (data.promotionDetails) {
        addPromotionToHistory(data.promotionDetails);
      }
    });
  
    // Add promotion record to history table
    function addPromotionToHistory(details) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${details.name}</td>
        <td>${details.previousPosition}</td>
        <td>${details.newPosition}</td>
        <td>${details.justification}</td>
        <td>${new Date(details.date).toLocaleDateString()}</td>
      `;
      promotionHistory.appendChild(row);
    }
  
    // Fetch existing promotions
    async function fetchPromotionHistory() {
      const response = await fetch("http://localhost:5000/api/employees/promotionHistory");
      const history = await response.json();
  
      history.forEach(addPromotionToHistory);
    }
  
    await fetchEmployees();
    await fetchPromotionHistory();
  });
  