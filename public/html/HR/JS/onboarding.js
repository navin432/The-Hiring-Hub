document.getElementById("profileInputForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  // Gather form data
  const formData = {
    employeeName: document.getElementById("employee-name").value,
    email: document.getElementById("employee-email").value,
    phone: document.getElementById("employee-phone").value,
    permanentAddress: document.getElementById("employee-address").value,
    mailingAddress: document.getElementById("mailing-address").value,
    emergencyContact: document.getElementById("emergency-contact").value,
    dateOfBirth: document.getElementById("date-of-birth").value,
    description: document.getElementById("employee-description").value,
    department: document.getElementById("department").value,
    linkedin: document.getElementById("linkedin").value,
    github: document.getElementById("github").value,
    sinNumber: document.getElementById("sin-number").value,
    bankInfo: {
      institutionNumber: document.getElementById("institution-number").value,
      transitNumber: document.getElementById("transit-number").value,
      accountNumber: document.getElementById("account-number").value,
    }
  };
  console.log(formData);
  // Send data to backend
  try {
    const response = await fetch("http://localhost:3000/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error("Error submitting profile:", error);
    alert("Failed to submit profile.");
  }
});
  