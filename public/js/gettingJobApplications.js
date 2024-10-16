const token = localStorage.getItem("authToken");
document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("jobApplicationsTbody");
  // Fetch all job applications
  const response = await fetch("/api/jobApplications", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    alert("Failed to fetch job applications");
    return;
  }
  const jobApplications = await response.json();

  // Display all job applications in the table
  jobApplications.forEach((application) => {
    const row = document.createElement("tr");
    row.dataset.id = application._id;

    row.innerHTML = `
          <td>${application.job.title}</td>
          <td><a href="${
            application.resume
          }" target="_blank">View Resume</a></td>
          <td><a href="${
            application.coverLetter
          }" target="_blank">View Cover Letter</a></td>
          <td>
          ${
            application.additionalDocs && application.additionalDocs.length > 0
              ? `<ol>
                  ${application.additionalDocs
                    .map(
                      (doc) =>
                        `<li><a href="${doc}" target="_blank">Document</a></li>`
                    )
                    .join("")}
                </ol>`
              : "N/A"
          }
          </td>
          <td>${new Date(application.dateApplied).toLocaleDateString()}</td>
          <td>${application.applicationStatus}</td>
          <td>
            <button class="btn btn--delete" onclick="deleteApplication('${
              application._id
            }')">Cancel Application</button>
          </td>
        `;
    tbody.appendChild(row);
  });
});

// Delete function to trigger DELETE request
async function deleteApplication(applicationId) {
  const confirmation = confirm(
    "Are you sure you want to cancel this application? The process can't be reverted."
  );

  if (confirmation) {
    const response = await fetch(`/api/jobApplications/${applicationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Job application cancelled successfully.");
      location.reload();
    } else {
      alert("Failed to cancel the job application.");
    }
  }
}
