const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const notificationIcon = document.getElementById('notification-icon');
const profileIcon = document.getElementById('profile-icon');
const notificationPopup = document.getElementById('notification-popup');
const profilePopup = document.getElementById('profile-popup');
const filterExperience = document.getElementById('filter-experience');
const filterDate = document.getElementById('filter-date');
const jobList = document.querySelector('.job-requirements ul');
const filteredList = document.getElementById('filtered-list');
const container = document.querySelector('.container');
const mainContent = document.querySelector('main');

// Add event listeners for filtering
filterExperience.addEventListener('change', filterJobs);
filterDate.addEventListener('change', filterJobs);

// Function to filter jobs based on experience and date
function filterJobs() {
    const experience = filterExperience.value;
    const selectedDate = filterDate.value;

    // Filter logic based on experience and date
    const jobs = Array.from(jobList.children);
    const filteredJobs = jobs.filter(job => {
        const jobExperience = parseInt(job.innerText.match(/\d+/)[0]); // Extract experience number from text
        const jobDate = new Date(job.querySelector('span:last-child').innerText.split(': ')[1]);

        const experienceMatches = (experience === 'all') || (jobExperience >= parseInt(experience));
        const dateMatches = selectedDate ? (jobDate >= new Date(selectedDate)) : true;

        return experienceMatches && dateMatches;
    });

    // Display filtered jobs
    filteredList.innerHTML = '';
    filteredJobs.forEach(job => filteredList.appendChild(job.cloneNode(true)));

    // If no jobs match, show a message
    if (filteredJobs.length === 0) {
        filteredList.innerHTML = '<li>No jobs found matching the criteria.</li>';
    }
}

// Toggle sidebar and adjust content centering
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
    
    // Check if the sidebar is closed or opened and adjust content accordingly
    if (sidebar.classList.contains('closed')) {
        container.classList.add('sidebar-closed');
        container.classList.remove('sidebar-open');
        mainContent.style.marginLeft = '0';
        mainContent.style.maxWidth = '100%'; // Full width when sidebar is closed
        container.style.width = '100%'; // Ensure the container takes full width
    } else {
        container.classList.add('sidebar-open');
        container.classList.remove('sidebar-closed');
        mainContent.style.marginLeft = '250px'; // Sidebar width
        mainContent.style.maxWidth = 'calc(100% - 250px)'; // Adjust main content width when sidebar is open
        container.style.width = 'calc(100% - 250px)'; // Adjust container width when sidebar is open
    }
});

// Toggle notification popup
notificationIcon.addEventListener('click', () => {
    notificationPopup.style.display = notificationPopup.style.display === 'block' ? 'none' : 'block';
    profilePopup.style.display = 'none'; // Hide profile popup if open
});

// Toggle profile popup
profileIcon.addEventListener('click', () => {
    profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
    notificationPopup.style.display = 'none'; // Hide notification popup if open
});

// Hide popups when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.icon-wrapper')) {
        notificationPopup.style.display = 'none';
        profilePopup.style.display = 'none';
    }
});

// Adjust content centering on page load
function adjustContentCentering() {
    if (sidebar.classList.contains('closed')) {
        container.classList.add('sidebar-closed');
        container.classList.remove('sidebar-open');
        mainContent.style.marginLeft = '0';
        mainContent.style.maxWidth = '100%';
        container.style.width = '100%'; // Ensure full width
    } else {
        container.classList.add('sidebar-open');
        container.classList.remove('sidebar-closed');
        mainContent.style.marginLeft = '250px'; // Sidebar width
        mainContent.style.maxWidth = 'calc(100% - 250px)';
        container.style.width = 'calc(100% - 250px)';
    }
}

// Initialize content centering on load
adjustContentCentering();
