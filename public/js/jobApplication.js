document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("jobId");

  if (!jobId) {
    alert("Job ID is missing.");
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
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const data = await response.json();
      console.log("Job application submitted successfully:", data);
      alert("Application submitted successfully!");

      setTimeout(() => {
        window.location.href = "guestDashboard.html";
      }, 500);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  });
});
