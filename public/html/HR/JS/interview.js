const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
  fetchAndRenderInterviews(); // Fetch and render interviews on page load

  // Add event listener for the cancel button
  document
    .getElementById("cancelScheduleButton")
    .addEventListener("click", function () {
      document.getElementById("scheduleModal").style.display = "none";
      document.getElementById("modalBackdrop").style.display = "none"; // Hide backdrop
    });
});

// Function to fetch and render interviews
async function fetchAndRenderInterviews() {
  try {
    const response = await fetch("/api/interview"); // Adjust the API URL based on your backend
    const data = await response.json();
    const interviewsList = document.getElementById("interviews-list");
    interviewsList.innerHTML = ""; // Clear the existing list
    const calendarEvents = []; // For FullCalendar events

    // Loop through the fetched interviews and display them
    data.forEach((interview) => {
      const applicantName = interview.applicant.applicantName;
      const jobTitle = interview.jobTitle;
      const interviewDate = new Date(interview.interviewDate);
      const formattedDate = interviewDate.toLocaleString();

      // Add interview to the table
      const interviewElement = document.createElement("tr");
      interviewElement.id = `interview-${interview._id}`; // Set an ID for the row
      interviewElement.innerHTML = `
          <td>${applicantName}</td>
          <td>${jobTitle}</td>
          <td>${formattedDate}</td>
          <td>${interview.round}</td>
          <td>
            <button class="hire-btn" data-id="${interview.applicant.application_id}" data-extra="${interview.applicant.applicantEmail}" data-ivId="${interview._id}">Hire</button>
            <button class="reject-btn" data-id="${interview.applicant.application_id}" data-extra="${interview._id}">Reject</button>
            <button class="schedule-btn" data-id="${interview._id}">Schedule Another Interview</button>
          </td>
        `;
      interviewsList.appendChild(interviewElement);

      // Add interview to FullCalendar events
      calendarEvents.push({
        title: `${applicantName} - ${jobTitle}`,
        start: interview.interviewDate,
        description: `Interview scheduled for ${applicantName} (${jobTitle})`,
      });
    });

    // Initialize the calendar with events
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: "2024-12-01", // Set the calendar to start from December
      events: calendarEvents, // Load events into the calendar
      headerToolbar: {
        left: "prev,next today", // Navigation buttons
        center: "title", // Title in the center
        right: "dayGridMonth,timeGridWeek,timeGridDay", // Views
      },
      eventClick: function (info) {
        alert(
          `Interview Scheduled for: ${info.event.title} at ${info.event.start}`
        );
      },
    });

    calendar.render(); // Render the calendar

    // Attach event listeners for hire and reject buttons
    attachButtonListeners();
    attachScheduleButtonListeners(); // Attach listeners for schedule buttons
  } catch (error) {
    console.error("Error fetching interviews:", error);
  }
}

// Function to attach event listeners to hire and reject buttons
function attachButtonListeners() {
  // Handle hiring buttons
  document.querySelectorAll(".hire-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const applicationId = e.currentTarget.getAttribute("data-id");
      const userEmail = e.currentTarget.getAttribute("data-extra");
      const interviewId = e.currentTarget.getAttribute("data-ivId");

      if (!applicationId) {
        console.error("No application ID found!");
        return;
      }

      try {
        const response = await fetch("/hire", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            applicationId,
            interviewId,
          }),
        });

        // Check if the response is successful
        if (response.ok) {
          console.log("User  hired successfully:");
          alert("Applicant hired successfully.");
          fetchAndRenderInterviews(); // Refresh the table
        } else {
          console.error("Failed to hire user.");
          alert("Error hiring the applicant. Please try again.");
        }
      } catch (error) {
        console.error("An error occurred while hiring the user:", error);
      }
    });
  });

  // Handle rejection buttons
  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const applicationId = e.currentTarget.getAttribute("data-id");

      const confirmReject = confirm(
        "Are you sure you want to reject this applicant?"
      );

      if (confirmReject) {
        try {
          const rejectResponse = await fetch(
            `/api/jobApplications/${applicationId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!rejectResponse.ok) {
            alert("Error rejecting applicant. Please try again.");
            console.error(
              "Error rejecting applicant:",
              rejectResponse.statusText
            );
            return;
          }
          alert("Applicant rejected successfully.");
          fetchAndRenderInterviews(); // Refresh the table
        } catch (error) {
          console.error("Error rejecting applicant:", error);
        }
      }
    });
  });
}

// Function to attach event listeners to schedule buttons
function attachScheduleButtonListeners() {
  document.querySelectorAll(".schedule-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const interviewId = e.currentTarget.getAttribute("data-id");
      document.getElementById("scheduleModal").style.display = "block";
      document.getElementById("modalBackdrop").style.display = "block"; // Show backdrop

      // Add event listener for the confirm button
      document.getElementById("confirmScheduleButton").onclick =
        async function () {
          const interviewDate = document.getElementById("interviewDate").value;

          if (!interviewDate) {
            alert("Please select a date and time for the interview.");
            return;
          }

          try {
            const response = await fetch(`/api/interview/${interviewId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ interviewDate }),
            });

            if (response.ok) {
              alert("Interview scheduled successfully.");
              fetchAndRenderInterviews(); // Refresh the table
              document.getElementById("scheduleModal").style.display = "none"; // Close modal
              document.getElementById("modalBackdrop").style.display = "none"; // Hide backdrop
            } else {
              alert("Error scheduling the interview. Please try again.");
            }
          } catch (error) {
            console.error(
              "An error occurred while scheduling the interview:",
              error
            );
          }
        };
    });
  });
}
