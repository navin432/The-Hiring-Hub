const profileName = document.getElementById("employee-name");
const userName = localStorage.getItem("userName");
profileName.innerText = userName;

let employees = {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/ratings");
    const employeesArray = await response.json();

    const employeeSelector = document.getElementById("employeeSelector");

    // Map the employeesArray to the employees object using _id as the key
    employees = employeesArray.reduce((acc, curr) => {
      const employeeKey = curr._id; // Use _id as the key for the employee

      acc[employeeKey] = {
        name: curr.employee.employeeName,
        role: "Unknown", // You can update this if you have a role field
        ratings: curr.ratings,
        remarks: curr.remarks,
        _id: curr._id,
      };

      return acc;
    }, {});

    // Loop over the employees object and create option elements
    Object.values(employees).forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee._id; // Ensure _id is the value
      option.textContent = employee.name; // Display employee name
      employeeSelector.appendChild(option);
    });

    // Initialize UI with the first employee
    updateUIForEmployee(Object.keys(employees)[0]); // Use the first employee's _id
  } catch (error) {
    console.error("Error fetching employee names:", error);
  }
});

// Current Selected Employee
let currentEmployee = null;

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
      if (currentEmployee) {
        employees[currentEmployee].ratings[category] = i;
        updateStars(starContainer, i);
      }
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
  if (employeeId && employees[employeeId]) {
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
  } else {
    console.log("Data is still being fetched or invalid employeeId");
  }
}

// Handle Employee Selection Change
document
  .getElementById("employeeSelector")
  .addEventListener("change", (event) => {
    const selectedEmployeeId = event.target.value;

    // Save current employee remarks before switching
    if (currentEmployee) {
      employees[currentEmployee].remarks =
        document.getElementById("remarks").value;
    }

    // Check if the selected employee exists
    if (selectedEmployeeId && employees[selectedEmployeeId]) {
      // Update UI for the newly selected employee
      updateUIForEmployee(selectedEmployeeId);
    } else {
      console.error("Selected employee not found:", selectedEmployeeId);
    }
  });
// Submit Button Functionality
document.querySelector(".btn-submit").addEventListener("click", async () => {
  // Ensure currentEmployee is an index or an object with necessary details
  const employee = employees[currentEmployee]; // Assuming currentEmployee is the index in the employees array
  employee.remarks = document.getElementById("remarks").value;

  // Send the PUT request to update the employee's data in the database
  try {
    const response = await fetch(`/api/ratings/${employee._id}`, {
      // Use employee._id directly
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratings: employee.ratings,
        remarks: employee.remarks,
      }),
    });

    if (response.ok) {
      // Show alert with submitted ratings and remarks after a successful response
      alert(`
        Ratings Submitted for ${employee.name}
        Productivity: ${employee.ratings.productivity}
        Teamwork: ${employee.ratings.teamwork}
        Punctuality: ${employee.ratings.punctuality}
        Innovation: ${employee.ratings.innovation}
        Remarks: ${employee.remarks}
      `);

      console.log("Employee ratings and remarks updated successfully.");
      updateChart(); // Update the chart after successfully updating the employee's data
    } else {
      console.error("Failed to update employee data:", await response.text());
    }
  } catch (error) {
    console.error("Error sending PUT request:", error);
  }
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
