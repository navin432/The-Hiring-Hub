document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginButton = document.querySelector(".btn--login");
    loginButton.disabled = true;

    const email = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;
    const role = document.querySelector(".role:checked").value;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); // Save token in localStorage

        // Redirect to guest dashboard on successful login
        console.log(data.role);
        window.location.href = `html/${data.role}Dashboard.html`;
      } else {
        const errorMessage = await response.text();
        alert("Login failed: " + errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in.");
    } finally {
      loginButton.disabled = false;
    }
  });
