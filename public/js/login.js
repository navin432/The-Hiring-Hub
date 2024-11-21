document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginButton = document.querySelector(".btn--login");
    loginButton.disabled = true;

    const email = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;
    const role = document.querySelector(".role:checked").value;
    const errorDisplay = document.getElementById("errorDisplay");
    const errorTitle = errorDisplay.children[0];
    const errorMsg = errorDisplay.children[1];

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
        console.log(data);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("userEmail", data.userEmail);

        // Redirect to guest dashboard on successful login
        window.location.href = `html/${data.role}Dashboard.html`;
      } else {
        const errorMessage = await response.text();
        errorTitle.innerText = "Login failed: ";
        errorMsg.innerText = errorMessage;
      }
    } catch (error) {
      console.error("Error:", error);
      errorMsg.innerText = "An error occurred while logging in.";
    } finally {
      loginButton.disabled = false;
    }
  });
