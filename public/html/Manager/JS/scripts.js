// Employee Ratings Data Structure
const employees = {
  emp1: {
    name: "John Doe",
    role: "Software Engineer",
    ratings: { productivity: 0, teamwork: 0, punctuality: 0, innovation: 0 },
    remarks: "",
  },
  emp2: {
    name: "Jane Smith",
    role: "Marketing Specialist",
    ratings: { productivity: 0, teamwork: 0, punctuality: 0, innovation: 0 },
    remarks: "",
  },
  emp3: {
    name: "Alice Brown",
    role: "HR Manager",
    ratings: { productivity: 0, teamwork: 0, punctuality: 0, innovation: 0 },
    remarks: "",
  },
  emp4: {
    name: "Chris Evans",
    role: "Data Analyst",
    ratings: { productivity: 0, teamwork: 0, punctuality: 0, innovation: 0 },
    remarks: "",
  },
  emp5: {
    name: "Emily Davis",
    role: "Product Manager",
    ratings: { productivity: 0, teamwork: 0, punctuality: 0, innovation: 0 },
    remarks: "",
  },
};

// Current Selected Employee
let currentEmployee = "emp1";

// Star Rating System
const categories = ["productivity", "teamwork", "punctuality", "innovation"];

// Populate stars for each category
categories.forEach((category) => {
  const starContainer = document.querySelector(
    `.stars[data-category="${category}"]`
  );

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa", "fa-star");
    star.setAttribute("data-value", i);

    // Star click event
    star.addEventListener("click", () => {
      employees[currentEmployee].ratings[category] = i;
      updateStars(starContainer, i);
    });

    starContainer.appendChild(star);
  }
});

// Update star colors based on rating
function updateStars(container, value) {
  const stars = container.querySelectorAll("i");
  stars.forEach((star, index) => {
    star.classList.toggle("selected", index < value);
  });
}

// Update the UI for the selected employee
function updateUIForEmployee(employeeId) {
  const employee = employees[employeeId];
  currentEmployee = employeeId;

  // Update stars for each category
  categories.forEach((category) => {
    const starContainer = document.querySelector(
      `.stars[data-category="${category}"]`
    );
    const rating = employee.ratings[category];
    updateStars(starContainer, rating);
  });

  // Update remarks
  document.getElementById("remarks").value = employee.remarks;
}

// Handle Employee Selection Change
document
  .getElementById("employeeSelector")
  .addEventListener("change", (event) => {
    const selectedEmployee = event.target.value;

    // Save current employee remarks
    employees[currentEmployee].remarks =
      document.getElementById("remarks").value;

    // Update UI for the newly selected employee
    updateUIForEmployee(selectedEmployee);
  });

// Submit Button Functionality
document.querySelector(".btn-submit").addEventListener("click", () => {
  const employee = employees[currentEmployee];
  employee.remarks = document.getElementById("remarks").value;

  alert(`
      Ratings Submitted for ${employee.name} (${employee.role}):
      Productivity: ${employee.ratings.productivity}
      Teamwork: ${employee.ratings.teamwork}
      Punctuality: ${employee.ratings.punctuality}
      Innovation: ${employee.ratings.innovation}
      Remarks: ${employee.remarks}
    `);

  updateChart();
});

// Performance Chart
const ctx = document.getElementById("performanceChart").getContext("2d");
let performanceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Performance Score",
        data: [3, 4, 4, 5, 4],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0.3,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  },
});

// Update Chart Data Dynamically (example logic; adjust as needed)
function updateChart() {
  const avgRating =
    (employees[currentEmployee].ratings.productivity +
      employees[currentEmployee].ratings.teamwork +
      employees[currentEmployee].ratings.punctuality +
      employees[currentEmployee].ratings.innovation) /
    4;

  performanceChart.data.datasets[0].data.push(avgRating);
  performanceChart.data.labels.push(
    `Update ${performanceChart.data.labels.length + 1}`
  );
  performanceChart.update();
}

// Initialize UI for the default selected employee
updateUIForEmployee(currentEmployee);
