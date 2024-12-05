document.addEventListener("DOMContentLoaded", async () => {
  const promotionForm = document.getElementById("promotionForm");
  const employeeSelect = document.getElementById("employee");
  const previousPositionInput = document.getElementById("previousPosition");
  const promotionHistoryTableBody = document.getElementById("promotionHistory");

  // Fetch employee data and populate the employee dropdown
  async function fetchEmployees() {
    try {
      const response = await fetch("/api/ratings"); // Modify this if the endpoint differs
      const employees = await response.json();

      employees.forEach((employee) => {
        const option = document.createElement("option");
        option.value = employee._id;
        option.textContent = `${employee.employee.employeeName} (${employee.employee.employeeEmail})`; // Corrected employee name path
        employeeSelect.appendChild(option);
      });

      // Add event listener to update previous position when employee is selected
      employeeSelect.addEventListener("change", async (event) => {
        const employeeId = event.target.value;
        if (employeeId) {
          await loadPreviousPosition(employeeId);
          loadPromotionHistory();
        }
        document.getElementById("newPosition").value = "";
        document.getElementById("justification").value = "";
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  // Fetch and set the previous position of the selected employee
  async function loadPreviousPosition(employeeId) {
    try {
      const response = await fetch(`/api/ratings/${employeeId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Parse the response as JSON
      const employeeRating = await response.json();

      // Check if promotions exist and set the previous position accordingly
      if (
        employeeRating &&
        employeeRating.promotions &&
        employeeRating.promotions.length > 0
      ) {
        const lastPromotion =
          employeeRating.promotions[employeeRating.promotions.length - 1];
        previousPositionInput.value = lastPromotion.newPosition || "Unknown";
      } else {
        previousPositionInput.value = "Unknown"; // Default when no promotions exist
      }
    } catch (error) {
      console.error("Error fetching previous position:", error);
      previousPositionInput.value = "Unknown"; // Fallback value in case of error
    }
  }

  // Handle the promotion form submission
  promotionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const employeeId = employeeSelect.value;
    const newPosition = document.getElementById("newPosition").value;
    const justification = document.getElementById("justification").value;

    if (!employeeId || !newPosition || !justification) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`/api/ratings/${employeeId}/promotions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPosition,
          previousPosition: previousPositionInput.value, // Send the previous position
          justification,
        }),
      });

      if (response.ok) {
        alert("Promotion submitted successfully!");
        loadPromotionHistory(); // Reload promotion history after submitting
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting promotion:", error);
      alert("Failed to submit promotion. Please try again.");
    }
  });

  // Load promotion history for the selected employee
  async function loadPromotionHistory() {
    const employeeId = employeeSelect.value;

    if (!employeeId) {
      return; // Exit if no employee is selected
    }

    try {
      const response = await fetch(`/api/ratings/${employeeId}`);
      const employeeRating = await response.json();

      // Clear existing promotion history
      promotionHistoryTableBody.innerHTML = "";

      if (
        employeeRating &&
        employeeRating.promotions &&
        employeeRating.promotions.length > 0
      ) {
        employeeRating.promotions.forEach((promotion) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${
              employeeRating.employee.employeeName
            }</td> <!-- Corrected employee name path -->
            <td>${
              promotion.previousPosition || "Unknown"
            }</td> <!-- Handle empty previous position -->
            <td>${
              promotion.newPosition || "Unknown"
            }</td> <!-- Handle empty new position -->
            <td>${
              promotion.justification || "No justification"
            }</td> <!-- Handle missing justification -->
            <td>${
              promotion.date
                ? new Date(promotion.date).toLocaleDateString()
                : "Unknown"
            }</td> <!-- Format the date -->
          `;
          promotionHistoryTableBody.appendChild(row);
        });
      } else {
        // Display a message if no promotion history exists
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="5">No promotion history available.</td>`;
        promotionHistoryTableBody.appendChild(row);
      }
    } catch (error) {
      console.error("Error loading promotion history:", error);
      // Display an error message in the table if fetching history fails
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5">Failed to load promotion history.</td>`;
      promotionHistoryTableBody.appendChild(row);
    }
  }

  // Fetch employee data when the page loads
  fetchEmployees();
});
