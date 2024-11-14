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
    const skillsInput = formData.get("skills");
    if (skillsInput) {
      if (skillsInput) {
        const skillsArray = skillsInput.split(",").map((skill) => skill.trim());
        formData.delete("skills");
        skillsArray.forEach((skill) => {
          formData.append("skills[]", skill);
        });
      }
    }
    formData.append("jobId", jobId);

    try {
      const response = await fetch("/api/jobapplications", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.message;
        alert(errorMsg);
        if (
          errorMsg ===
          "Your application has been rejected as it did not meet the job criteria."
        ) {
          setTimeout(() => {
            window.location.href = `${data.role}Dashboard.html`;
          }, 500);
          return;
        }

        return;
      }

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
