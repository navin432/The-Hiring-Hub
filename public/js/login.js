document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("authToken", token); // Save token in localStorage

        // Redirect to guest dashboard on successful login
        window.location.href = "html/guestDashboard.html";
      } else {
        const errorMessage = await response.text();
        alert("Login failed: " + errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in.");
    }
  });
