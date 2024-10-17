document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('Calendar element not found.');
        return;
    }

    // Initialize FullCalendar with time-based views
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // Set initial view to week with time slots
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        editable: true,
        events: [],
        eventClick: function (info) {
            if (confirm("Do you want to remove this event?")) {
                info.event.remove();
            }
        }
    });

    calendar.render();
    console.log('Calendar rendered successfully.');

    // Add event functionality with time input
    const addEventBtn = document.getElementById('add-event');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function () {
            const title = prompt("Enter event title:");
            const dateStr = prompt("Enter date (YYYY-MM-DD):");
            const startTime = prompt("Enter start time (HH:MM in 24-hour format):");
            const endTime = prompt("Enter end time (HH:MM in 24-hour format) (optional):");

            if (title && dateStr && startTime) {
                const startDateTime = `${dateStr}T${startTime}`;
                const endDateTime = endTime ? `${dateStr}T${endTime}` : null;

                if (!isNaN(new Date(startDateTime).getTime())) {
                    calendar.addEvent({
                        title: title,
                        start: startDateTime,
                        end: endDateTime
                    });
                    console.log('Event added:', title, startDateTime, endDateTime);
                } else {
                    alert("Invalid date or time.");
                }
            } else {
                alert("Please provide the event title, date, and start time.");
            }
        });
    } else {
        console.error('Add Event button not found.');
    }
});
