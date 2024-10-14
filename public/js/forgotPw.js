document
  .getElementById("send-reset-code")
  .addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const button = document.getElementById("send-reset-code");
    const loadingText = document.getElementById("loading-text");

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    // Disable the button and show the loading message
    button.disabled = true;
    loadingText.style.display = "block";

    try {
      const response = await fetch("/api/forgotpassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Reset code sent to your email.");

        // Store email in sessionStorage to be used in the resetPassword page
        sessionStorage.setItem("email", email);

        // Redirect to resetPassword page
        window.location.href = "resetPw.html";
      } else {
        const data = await response.json();
        alert(data.message || "Failed to send reset code.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending reset code.");
    } finally {
      // Re-enable the button and hide the loading message
      button.disabled = false;
      loadingText.style.display = "none";
    }
  });
