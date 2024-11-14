document.addEventListener("DOMContentLoaded", function () {
  const jobForm = document.getElementById("job-form");
  const jobList = document.getElementById("job-list");
  const jobIdField = document.getElementById("job-id");

  async function fetchJobs() {
    const response = await fetch("/api/jobs");
    const jobs = await response.json();
    displayJobs(jobs);
  }

  function displayJobs(jobs) {
    jobList.innerHTML = "";

    jobs.forEach((job) => {
      const jobDiv = document.createElement("div");
      jobDiv.classList.add("job-item");

      jobDiv.innerHTML = `
        <h3>${job.title}</h3>
        <p>Location: ${job.location}</p>
        <p>Type: ${job.jobDetails.jobType}</p>
        <p>${job.jobDetails.positionSummary}</p>
  
        <a href="javascript:void(0);" class="job-listing__more-details">More Details</a>
  
        <div class="job-details" style="display: none;">
          <h4>Responsibilities:</h4>
          <ul>
            ${job.jobDetails.keyResponsibilities
              .map((item) => `<li>${item}</li>`)
              .join("")}
          </ul>
  
          <h4>Requirements:</h4>
          <ul>
            ${job.jobDetails.requirements
              .map((item) => `<li>${item}</li>`)
              .join("")}
          </ul>
  
          <h4>Education Level:</h4>
          <p>${job.jobDetails.educationLevel}</p>
  
          <h4>Required Skills:</h4>
          <ul>
            ${job.jobDetails.requiredSkills
              .map((item) => `<li>${item}</li>`)
              .join("")}
          </ul>
        </div>
  
        <div class="job-actions">
          <button onclick="editJob('${job._id}')">Edit</button>
          <button class="delete-btn" onclick="deleteJob('${
            job._id
          }')">Delete</button>
          <button onclick="window.location.href='view-applicants.html?id=${
            job._id
          }'">View Applicants</button>
        </div>
      `;

      // Add the job item to the list
      jobList.appendChild(jobDiv);

      // Toggle job details visibility
      const moreDetailsLink = jobDiv.querySelector(
        ".job-listing__more-details"
      );
      const jobDetailsDiv = jobDiv.querySelector(".job-details");

      moreDetailsLink.addEventListener("click", (e) => {
        e.preventDefault();
        jobDetailsDiv.style.display =
          jobDetailsDiv.style.display === "none" ? "block" : "none";
        moreDetailsLink.textContent =
          jobDetailsDiv.style.display === "none"
            ? "More Details"
            : "Hide Details";
      });
    });
  }

  // Submit form (create or edit job)
  jobForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const jobId = jobIdField.value;

    const job = {
      title: document.getElementById("title").value,
      location: document.getElementById("location").value,
      jobDetails: {
        positionSummary: document.getElementById("positionSummary").value,
        keyResponsibilities: document
          .getElementById("keyResponsibilities")
          .value.split("\n")
          .map((item) => item.trim()),
        requirements: document
          .getElementById("requirements")
          .value.split("\n")
          .map((item) => item.trim()),
        jobType: document.getElementById("jobType").value,
        expectedStartDate: document.getElementById("expectedStartDate").value,
        minExperience: document.getElementById("minExperience").value || 0,
        educationLevel: document.getElementById("educationLevel").value,
        requiredSkills: document
          .getElementById("requiredSkills")
          .value.split("\n")
          .map((item) => item.trim()),
      },
    };

    if (jobId) {
      // PUT request for editing job
      await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
    } else {
      // POST request for creating job
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
    }

    // Clear form after submission
    jobForm.reset();
    jobIdField.value = "";
    fetchJobs(); // Refresh the job list
  });

  // Edit job function
  window.editJob = async function (id) {
    const response = await fetch(`/api/jobs/${id}`);
    const job = await response.json();
    document.getElementById("title").value = job.title;
    document.getElementById("location").value = job.location;
    document.getElementById("positionSummary").value =
      job.jobDetails.positionSummary;
    document.getElementById("keyResponsibilities").value =
      job.jobDetails.keyResponsibilities.join("\n");
    document.getElementById("requirements").value =
      job.jobDetails.requirements.join("\n");
    document.getElementById("jobType").value = job.jobDetails.jobType;
    document.getElementById("expectedStartDate").value = new Date(
      job.jobDetails.expectedStartDate
    )
      .toISOString()
      .substr(0, 10);
    jobIdField.value = job._id;
  };

  // Delete job function
  window.deleteJob = async function (id) {
    if (confirm("Are you sure you want to delete this job?")) {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      fetchJobs();
    }
  };

  // Initial fetch of jobs
  fetchJobs();
});
