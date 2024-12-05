document.addEventListener("DOMContentLoaded", async () => {
  const employeeTable = document
    .getElementById("employeeTable")
    .getElementsByTagName("tbody")[0];
  const equipmentTable = document
    .getElementById("equipmentTable")
    .getElementsByTagName("tbody")[0];
  const assignEquipmentModal = document.getElementById("assignEquipmentModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const assignEquipmentForm = document.getElementById("assignEquipmentForm");

  // Fetch employee data
  try {
    const response = await fetch("/api/profiles");
    if (!response.ok) throw new Error("Failed to fetch employee data");
    let employeeData = await response.json();
    console.log(employeeData);

    // Populate the employee table
    employeeData.forEach((employee) => {
      const row = employeeTable.insertRow();
      row.innerHTML = `
          <td>${employee.name}</td>
          <td>${employee.email}</td>
          <td>
            <button class="btn-add-equipment" data-email="${employee.email}">
              Provide Equipment
            </button>
          </td>
        `;
    });

    // Add event listeners to "Provide Equipment" buttons
    document.querySelectorAll(".btn-add-equipment").forEach((button) => {
      button.addEventListener("click", function () {
        const employeeEmail = this.dataset.email;
        openModal(employeeEmail); // Show the form modal
      });
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
  }

  // Function to open the modal
  function openModal(email) {
    assignEquipmentModal.style.display = "block";
    // You can set the email of the employee in the form if needed
    // For example, to send the employee email along with the equipment details
    const emailField = document.createElement("input");
    emailField.type = "hidden";
    emailField.name = "employeeEmail";
    emailField.value = email;
    assignEquipmentForm.appendChild(emailField);
  }

  // Close modal button functionality
  closeModalBtn.addEventListener("click", () => {
    assignEquipmentModal.style.display = "none";
  });

  // Handle the form submission for assigning equipment
  assignEquipmentForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(assignEquipmentForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // POST request to create equipment assignment
    try {
      const response = await fetch("/api/equipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Equipment assigned successfully!");
        // Optionally, close the modal after success
        assignEquipmentModal.style.display = "none";
        // Refresh the equipment table to reflect changes
        location.reload();
      } else {
        throw new Error("Failed to assign equipment");
      }
    } catch (error) {
      console.error("Error assigning equipment:", error);
    }
  });
});
