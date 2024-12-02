document.addEventListener("DOMContentLoaded", function () {
  const jobListingsSection = document.getElementById("job-listings");
  const profileName = document.getElementById("user-name");
  let userName = localStorage.getItem("userName");
  userName = userName.split(" ");
  profileName.innerText = "Welcome, " + userName[0];

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
    jobListingsSection.innerHTML = "";

    jobs.forEach((job) => {
      if (job.jobCategory === "External" || job.jobCategory === "Both") {
        const jobListing = document.createElement("article");
        jobListing.classList.add("job-listing");

        jobListing.innerHTML = `
          <h3 class="job-listing__title">${job.title}</h3>
          <p class="job-listing__location"><strong>Location:</strong> ${
            job.location
          }</p>
          <p class="job-listing__position-summary">${
            job.jobDetails.positionSummary
          }</p>
          <a href="#" class="btn job-listing__more-details">More details</a>
          
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
          
          <a href="jobApply.html?jobId=${
            job._id
          }" class="btn btn--apply">Apply Now</a>
        `;

        jobListingsSection.appendChild(jobListing);
        const moreDetailsLink = jobListing.querySelector(
          ".job-listing__more-details"
        );
        const jobDetailsDiv = jobListing.querySelector(".job-details");

        moreDetailsLink.addEventListener("click", (e) => {
          e.preventDefault();
          if (jobDetailsDiv.style.display === "none") {
            jobDetailsDiv.style.display = "block";
            moreDetailsLink.textContent = "Hide details";
          } else {
            jobDetailsDiv.style.display = "none";
            moreDetailsLink.textContent = "More details";
          }
        });
      }
    });
  }

  fetchJobListings();
});
