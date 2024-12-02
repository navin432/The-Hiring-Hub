const apiBaseUrl = "http://localhost:3000/training"; // Replace with your actual API base URL
const employeeEmail = "john.doe@example.com"; // Replace with actual dynamic email if available

let trainingUpdates = {}; // To store any changes made

// Fetch and populate training data
async function fetchTrainingData() {
  try {
    const response = await fetch(`${apiBaseUrl}/${employeeEmail}`);
    if (!response.ok) throw new Error("Failed to fetch training data");

    const data = await response.json();

    // Populate the values in the checklist
    document.querySelectorAll(".training-item").forEach((item) => {
      const key = item.querySelector(".status-label").dataset.key;

      if (data[key] === true) {
        // Update status label
        item.querySelector(".status-label").textContent = "Completed";
        item.querySelector(".status-label").classList.add("status-completed");
        item.querySelector(".action").textContent = ""; // No action needed for completed items
      } else {
        // Update status label and add action button
        item.querySelector(".status-label").textContent = "Pending";
        item.querySelector(".status-label").classList.add("status-pending");
        item.querySelector(
          ".action"
        ).innerHTML = `<button class="btn btn--mark-completed" data-key="${key}">Mark Completed</button>`;
      }
    });
  } catch (error) {
    console.error(error);
    alert("Could not load training data.");
  }
}

// Handle marking a training item as completed
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn--mark-completed")) {
    const key = event.target.dataset.key;
    const parent = event.target.closest(".training-item");

    // Update status label to "Completed"
    parent.querySelector(".status-label").textContent = "Completed";
    parent.querySelector(".status-label").classList.remove("status-pending");
    parent.querySelector(".status-label").classList.add("status-completed");

    // Remove action button
    parent.querySelector(".action").textContent = "";

    // Track the update
    trainingUpdates[key] = true;
  }
});

// Save the updates to the server
async function saveTrainingUpdates() {
  if (Object.keys(trainingUpdates).length === 0) {
    alert("No changes to save.");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/${employeeEmail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trainingUpdates),
    });

    if (!response.ok) throw new Error("Failed to save training updates");

    alert("Training data successfully updated!");
    trainingUpdates = {}; // Reset updates
  } catch (error) {
    console.error(error);
    alert("Could not save training data.");
  }
}

// Attach event listener to Save button
document
  .getElementById("save-training")
  .addEventListener("click", saveTrainingUpdates);

// Fetch the training data when the page loads
fetchTrainingData();
