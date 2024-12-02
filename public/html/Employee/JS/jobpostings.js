document.addEventListener("DOMContentLoaded", function () {
  const jobListingsSection = document.querySelector(".dashboard-section");

  async function fetchJobListings() {
    try {
      const response = await fetch("/api/jobs");
      const jobs = await response.json();
      renderJobListings(jobs);
    } catch (error) {
      console.error("Error fetching job listings:", error);
    }
  }

  function renderJobListings(jobs) {
    jobListingsSection.innerHTML = ""; // Clear existing content
    jobs.forEach((job) => {
      // Create a section-card for each job listing
      if (job.jobCategory === "Internal" || job.jobCategory === "Both") {
        const jobCard = document.createElement("div");
        jobCard.classList.add("section-card");

        // Create job listing elements
        jobCard.innerHTML = `
          <h2 class="job-title">${job.title}</h2>
          <p class="job-location">Location: ${job.location}</p>
          <p>${job.jobDetails.positionSummary}</p>
          
          <button class="view-details-button">View Details</button>
          
          <div class="job-details" style="display: none;">
            <h4>Key Responsibilities:</h4>
            <ul>
              ${job.jobDetails.keyResponsibilities
                .map((responsibility) => `<li>${responsibility}</li>`)
                .join("")}
            </ul>
  
            <h4>Requirements:</h4>
            <ul>
              ${job.jobDetails.requirements
                .map((requirement) => `<li>${requirement}</li>`)
                .join("")}
            </ul>
  
            <p><strong>Job Type:</strong> ${job.jobDetails.jobType}</p>
            <p><strong>Expected Start Date:</strong> ${
              new Date(job.jobDetails.expectedStartDate)
                .toISOString()
                .split("T")[0]
            }</p>
          </div>
  
          <a href="../jobApply.html?jobId=${
            job._id
          }" class=" btn--apply">Apply Now</a>
        `;

        // Append the job card to the section
        jobListingsSection.appendChild(jobCard);

        // Handle "More details" / "Hide details" toggle
        const jobDetailsDiv = jobCard.querySelector(".job-details");
        const viewDetailsButton = jobCard.querySelector(".view-details-button");

        viewDetailsButton.addEventListener("click", (e) => {
          e.preventDefault();
          if (jobDetailsDiv.style.display === "none") {
            jobDetailsDiv.style.display = "block";
            viewDetailsButton.textContent = "Hide details";
          } else {
            jobDetailsDiv.style.display = "none";
            viewDetailsButton.textContent = "More details";
          }
        });
      }
    });
  }

  fetchJobListings(); // Fetch and render the job listings on page load
});
