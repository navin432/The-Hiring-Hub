document.addEventListener("DOMContentLoaded", () => {
  const readyForPromotionTable = document.getElementById(
    "readyForPromotionTable"
  );
  const employeeForm = document.getElementById("employeeForm");
  const employeeDetails = document.getElementById("employeeDetails");

  // Elements for displaying employee details
  const employeeName = document.getElementById("employeeName");
  const employeeEmail = document.getElementById("employeeEmail");
  const productivity = document.getElementById("productivity");
  const teamwork = document.getElementById("teamwork");
  const punctuality = document.getElementById("punctuality");
  const innovation = document.getElementById("innovation");
  const averageRating = document.getElementById("averageRating");

  // Hide employee details initially
  employeeDetails.style.display = "none";

  // Fetch all ratings and display employees ready for promotion
  async function fetchRatings() {
    try {
      const response = await fetch("/api/ratings");
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const ratings = await response.json();

      // Clear table before populating
      readyForPromotionTable.innerHTML = "";

      ratings.forEach((rating) => {
        const { employee, ratings: scores } = rating;
        const average =
          (scores.productivity +
            scores.teamwork +
            scores.punctuality +
            scores.innovation) /
          4;

        const row = document.createElement("tr");
        const status = average >= 4 ? "Ready" : "Not Ready";
        const statusClass = average >= 4 ? "ready" : "not-ready";

        row.innerHTML = `
          <td>${employee.employeeName}</td>
          <td>${employee.employeeEmail}</td>
          <td>${average.toFixed(2)}</td>
          <td class="${statusClass}">${status}</td>
        `;
        readyForPromotionTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching ratings:", error);
      readyForPromotionTable.innerHTML =
        "<tr><td colspan='4'>Failed to load data.</td></tr>";
    }
  }

  // Fetch specific employee details by ID or email
  async function fetchEmployeeDetails(identifier) {
    try {
      const response = await fetch(`/api/ratings`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const ratings = await response.json();

      // Find employee by ID or email
      const rating = ratings.find(
        (rating) =>
          rating.employee._id === identifier ||
          rating.employee.employeeEmail === identifier
      );

      if (!rating) {
        alert("No details found for the provided Employee ID or Email.");
        return;
      }

      const { employee, ratings: scores } = rating;
      const average =
        (scores.productivity +
          scores.teamwork +
          scores.punctuality +
          scores.innovation) /
        4;

      // Display employee details
      employeeName.textContent = employee.employeeName;
      employeeEmail.textContent = employee.employeeEmail;
      productivity.textContent = scores.productivity;
      teamwork.textContent = scores.teamwork;
      punctuality.textContent = scores.punctuality;
      innovation.textContent = scores.innovation;
      averageRating.textContent = average.toFixed(2);

      employeeDetails.style.display = "block";
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Failed to fetch employee details.");
    }
  }

  // Event listener for fetching specific employee details
  employeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const identifier = document
      .getElementById("employeeIdOrEmail")
      .value.trim();
    if (identifier) {
      fetchEmployeeDetails(identifier);
    } else {
      alert("Please enter a valid Employee ID or Email.");
    }
  });

  // Fetch ratings on page load
  fetchRatings();
});
