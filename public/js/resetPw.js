document
  .getElementById("reset-password-btn")
  .addEventListener("click", async function () {
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Retrieve the stored email from sessionStorage
    const email = sessionStorage.getItem("email");

    if (!email) {
      alert("No email found. Please go back to the Forgot Password page.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, 
          otp, 
          newPassword, 
        }),
      });

      if (response.ok) {
        alert("Password reset successful.");
        sessionStorage.removeItem("email");
        window.location.href = "../index.html";
      } else {
        const data = await response.json();
        alert(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error resetting password.");
    }
  });
