// Fetch Users
async function fetchUsers() {
  const response = await fetch("/api/users");
  const users = await response.json();
  const userTableBody = document.querySelector("#userTable tbody");
  userTableBody.innerHTML = "";

  users.forEach((user) => {
    const row = `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button 
              class="btn btn-edit" 
              data-id="${user._id}" 
              data-name="${user.name}" 
              data-email="${user.email}" 
              data-role="${user.role}"
              onclick="editUser(this)"
            >
              Edit
            </button>
          </td>
        </tr>`;
    userTableBody.innerHTML += row;
  });
}

// Edit User
function editUser(button) {
  // Retrieve data attributes from the button
  const userId = button.getAttribute("data-id");
  const userName = button.getAttribute("data-name");
  const userEmail = button.getAttribute("data-email");
  const userRole = button.getAttribute("data-role");

  // Populate form fields
  document.querySelector("#userName").value = userName;
  document.querySelector("#userEmail").value = userEmail;
  document.querySelector("#userRole").value = userRole;

  // Attach userId to the form's dataset for later use
  const form = document.querySelector("#userUpdateForm");
  form.dataset.userId = userId;

  // Display the modal
  const modal = document.querySelector("#updateUserModal");
  modal.style.display = "block";

  // Scroll to modal for better UX
  modal.scrollIntoView({ behavior: "smooth" });
}

// Close the modal when cancel button is clicked
document.querySelector("#cancelUpdate").addEventListener("click", () => {
  const modal = document.querySelector("#updateUserModal");
  modal.style.display = "none";
});

// Update User
document
  .querySelector("#userUpdateForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = e.target.dataset.userId;
    const updatedUser = {
      name: document.querySelector("#userName").value,
      email: document.querySelector("#userEmail").value,
      role: document.querySelector("#userRole").value,
    };

    try {
      // Send the PUT request to update the user
      const response = await fetch(`/api/users/it/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      // Check if the response is successful
      if (response.ok) {
        alert("User updated successfully!");
        const form = document.querySelector("#userUpdateForm");
        form.reset(); // Reset the form fields
        form.dataset.userId = "";
        fetchUsers();

        // Close the modal
        const modal = document.querySelector("#updateUserModal");
        modal.style.display = "none";
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "An error occurred"}`);
      }
    } catch (error) {
      alert("Failed to update user. Please try again later.");
      console.error("Error updating user:", error);
    }
  });

// Initial Fetch
fetchUsers();
