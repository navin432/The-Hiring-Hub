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
        average: curr.average,
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
  updateChart(employeeId);
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
  const employee = employees[currentEmployee];
  employee.remarks = document.getElementById("remarks").value;
  const avgRating =
    (employee.ratings.productivity +
      employee.ratings.teamwork +
      employee.ratings.punctuality +
      employee.ratings.innovation) /
    4;

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
        average: {
          value: avgRating,
          date: new Date().toISOString().split("T")[0],
        },
      }),
    });

    if (response.ok) {
      // Show alert with submitted ratings and remarks after a successful response
      alert(`
        Ratings Submitted for ${employee.name}
      `);

      console.log("Employee ratings and remarks updated successfully.");
      const updatedEmployees = await fetch("/api/ratings");
      const updatedEmployeesArray = await updatedEmployees.json();
      employees = updatedEmployeesArray.reduce((acc, curr) => {
        const employeeKey = curr._id;
        acc[employeeKey] = {
          name: curr.employee.employeeName,
          role: "Unknown", // Update as needed
          ratings: curr.ratings,
          remarks: curr.remarks,
          _id: curr._id,
          average: curr.average,
        };
        return acc;
      }, {});
      updateChart(employee._id); // Update the chart after successfully updating the employee's data
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
    labels: ["2024 Jan 1"],
    datasets: [
      {
        label: "Performance Score",
        data: [null],
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
    scales: { y: { beginAtZero: true, max: 5 } },
  },
});

// Update Chart Data Dynamically (example logic; adjust as needed)
function updateChart(employeeId) {
  if (employeeId) {
    const employee = employees[employeeId];
    const averageRatings = employee.average;
    const chartData = performanceChart.data;
    chartData.labels = [];
    chartData.datasets[0].data = [];
    averageRatings.forEach((rating, index) => {
      // Add average rating to the chart data
      chartData.datasets[0].data.push(rating.value);

      // Add the corresponding date to the labels
      const date = new Date(rating.date);
      const formattedDate = `${date.getFullYear()} ${date.toLocaleString(
        "default",
        { month: "short" }
      )} ${date.getDate()}`;
      chartData.labels.push(formattedDate);
    });
    performanceChart.update();
  } else {
    console.log("Employee Id not found");
  }
}

// Initialize UI for the default selected employee
updateUIForEmployee(currentEmployee);
