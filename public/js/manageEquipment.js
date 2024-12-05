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
    const data = {
      employeeEmail: formData.get("employeeEmail"),
      laptop: {
        isProvided: formData.get("laptop") ? true : false,
        brand: formData.get("laptop") || "",
      },
      smartphone: {
        isProvided: formData.get("smartphone") ? true : false,
        brand: formData.get("smartphone") || "",
      },
      vehicle: {
        isProvided: formData.get("vehicle") ? true : false,
        brand: formData.get("vehicle") || "",
      },
      transportationFacility: {
        isProvided: formData.get("transportation") ? true : false,
        brand: formData.get("transportation") || "",
      },
      other: {
        isProvided: formData.get("other") ? true : false,
        brand: formData.get("other") || "",
      },
    };

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
        loadEquipmentData();
      } else {
        throw new Error("Failed to assign equipment");
      }
    } catch (error) {
      console.error("Error assigning equipment:", error);
    }
  });

  // Function to load equipment data into the table
  async function loadEquipmentData() {
    try {
      const response = await fetch("/api/equipments");
      if (!response.ok) throw new Error("Failed to fetch equipment data");
      const responseData = await response.json();
      const equipmentData = responseData.equipmentList;
      console.log(equipmentData);

      // Clear the existing rows in the table
      equipmentTable.innerHTML = "";

      // Populate the equipment table with the latest data
      equipmentData.forEach((equipment) => {
        const row = equipmentTable.insertRow();
        row.innerHTML = `
          <td>${equipment.employee.employeeName}</td>
          <td>${equipment.employee.employeeEmail}</td>
          <td>${
            equipment.laptop.isProvided
              ? equipment.laptop.brand
              : "Not Provided"
          }</td>
          <td>${
            equipment.smartphone.isProvided
              ? equipment.smartphone.brand
              : "Not Provided"
          }</td>
          <td>${
            equipment.vehicle.isProvided
              ? equipment.vehicle.brand
              : "Not Provided"
          }</td>
          <td>${
            equipment.transportationFacility.isProvided
              ? equipment.transportationFacility.brand
              : "Not Provided"
          }</td>
          <td>${
            equipment.other.isProvided ? equipment.other.brand : "Not Provided"
          }</td>
        `;
      });
    } catch (error) {
      console.error("Error loading equipment data:", error);
    }
  }

  // Load the equipment data when the page is ready
  loadEquipmentData();
});
