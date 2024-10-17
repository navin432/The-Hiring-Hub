document.addEventListener("DOMContentLoaded", function () {
  // Function to make profile fields editable
  const editButton = document.getElementById("edit-button");
  const profileName = document.getElementById("employee-name");
  const userName = localStorage.getItem("userName");
  profileName.innerText = userName;
  const saveButton = document.getElementById("save-button");
  const formFields = document.querySelectorAll(
    ".profile-update-form input, .profile-update-form textarea"
  );

  editButton.addEventListener("click", function () {
    // Make all fields editable except name and email
    formFields.forEach((field) => {
      if (field.id !== "employee-name-input" && field.id !== "employee-email") {
        field.disabled = false;
      }
    });

    // Show the save button and hide the edit button
    editButton.style.display = "none";
    saveButton.style.display = "block";
  });

  function updateDate() {
    const dateElement = document.getElementById("current-date");
    const currentDate = new Date();

    // Format the date to a more readable format (e.g., "October 13, 2024")
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);

    // Update the inner HTML of the date element
    dateElement.innerHTML = formattedDate;
  }

  // Call the function to set the date when the page loads
  updateDate();

  // Fetch profile data on page load

  const getProfileData = async () => {
    try {
      const response = await fetch("/api/profiles/neupanesabin143@gmail.com");
      if (!response.ok) throw new Error("Failed to fetch profile", error[0]);
      const data = await response.json();

      // Populate the fields with the fetched data
      document.getElementById("employee-name-input").value = data.name;
      document.getElementById("employee-email").value = data.email;
      document.getElementById("employee-phone").value = data.phone;
      document.getElementById("employee-address").value = data.permanentAddress;
      document.getElementById("mailing-address").value = data.mailingAddress;
      document.getElementById("emergency-contact").value =
        data.emergencyContact;
      document.getElementById("date-of-birth").value = data.dateOfBirth;
      document.getElementById("employee-description").value = data.description;
      document.getElementById("department").value = data.department;
      document.getElementById("linkedin").value = data.linkedIn;
      document.getElementById("github").value = data.github;
    } catch (error) {
      console.error(error);
    }
  };

  // Call the function when the page loads
  getProfileData();

  const profileForm = document.getElementById("profileForm");

  if (profileForm) {
    profileForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the form from submitting normally

      const profileData = {
        email: document.getElementById("employee-email").value,
        name: document.getElementById("employee-name-input").value,
        phone: document.getElementById("employee-phone").value,
        permanentAddress: document.getElementById("employee-address").value,
        mailingAddress: document.getElementById("mailing-address").value,
        emergencyContact: document.getElementById("emergency-contact").value,
        dateOfBirth: document.getElementById("date-of-birth").value,
        description: document.getElementById("employee-description").value,
        department: document.getElementById("department").value,
        linkedIn: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
      };

      try {
        const response = await fetch("/api/profiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          alert("Profile updated successfully");
          saveButton.style.display = "none";
          editButton.style.display = "block";
          formFields.forEach((field) => (field.disabled = true));
        } else {
          throw new Error("Profile update failed");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
      }
    });
  } else {
    console.error("Form with ID 'profileForm' not found.");
  }
});
