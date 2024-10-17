document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("jobId");
  const token = localStorage.getItem("authToken");

  if (!jobId) {
    alert("Job ID is missing.");
    return;
  }

  if (!token) {
    alert("You need to log in before applying for a job.");
    return;
  }
  const form = document.querySelector(".application__form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    formData.append("jobId", jobId);

    try {
      const response = await fetch("/api/jobapplications", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      const data = await response.json();
      console.log(
        "Job application submitted successfully:",
        data.jobApplication
      );
      alert("Application submitted successfully!");

      setTimeout(() => {
        window.location.href = `${data.role}Dashboard.html`;
      }, 500);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  });
});
