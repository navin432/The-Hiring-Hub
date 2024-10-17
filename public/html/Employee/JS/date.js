
  // Function to get and display the current date
  function updateDate() {
    const dateElement = document.getElementById('current-date');
    const currentDate = new Date();

    // Format the date to a more readable format (e.g., "October 13, 2024")
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);

    // Update the inner HTML of the date element
    dateElement.innerHTML = formattedDate;
  }

  // Call the function to set the date when the page loads
  updateDate();