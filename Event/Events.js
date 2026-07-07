document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventList = document.getElementById('eventList');
    const selectedDateText = document.getElementById('selectedDateText');

    let currentDate = new Date();
    // Default mock data (mostly in 2026 based on the system date)
    const mockEvents = [
        {
            date: '2026-07-07',
            title: 'Kasikatan Event',
            time: '2:30 PM',
            location: 'Main Auditorium',
            type: 'general',
            description: 'Showcasing the diverse talents of our student body.'
        },
        {
            date: '2026-08-15',
            title: 'SIDLAK Opening Ceremony',
            time: '8:00 AM',
            location: 'University Field',
            type: 'sports',
            description: 'Start of the annual intramurals.'
        },
        {
            date: '2026-08-16',
            title: 'SIDLAK Day 2 (Basketball Finals)',
            time: '1:00 PM',
            location: 'Gymnasium',
            type: 'sports',
            description: 'Cheer for your college team!'
        },
        {
            date: '2026-09-10',
            title: 'Midterm Exams Begin',
            time: 'All Day',
            location: 'Campus Wide',
            type: 'exam',
            description: 'First day of midterm examinations.'
        }
    ];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Display Month and Year
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        // Get first day of the month (0 = Sun, 1 = Mon, etc.)
        const firstDay = new Date(year, month, 1).getDay();
        // Get number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Clear previous calendar days
        calendarDays.innerHTML = '';

        // Fill empty days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDiv);
        }

        const today = new Date();

        // Fill the actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            // Format date as YYYY-MM-DD
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(i).padStart(2, '0');
            const dateStr = `${year}-${mStr}-${dStr}`;
            
            // Check if it's today
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            // Create date number
            const dateSpan = document.createElement('span');
            dateSpan.className = 'date-number';
            dateSpan.textContent = i;
            dayDiv.appendChild(dateSpan);

            // Find events for this day
            const dayEvents = mockEvents.filter(e => e.date === dateStr);
            dayEvents.forEach(ev => {
                const evDiv = document.createElement('div');
                evDiv.className = `event-indicator ${ev.type}`;
                evDiv.textContent = ev.title;
                dayDiv.appendChild(evDiv);
            });

            // Click listener to show events
            dayDiv.addEventListener('click', () => {
                showEventsForDate(dateStr, `${monthNames[month]} ${i}, ${year}`, dayEvents);
            });

            calendarDays.appendChild(emptyDiv = dayDiv);
        }
    }

    function showEventsForDate(dateStr, formattedDate, events) {
        selectedDateText.textContent = formattedDate;
        eventList.innerHTML = '';

        if (events.length === 0) {
            eventList.innerHTML = '<p class="no-events">No events scheduled for this day.</p>';
            return;
        }

        events.forEach(ev => {
            const evDiv = document.createElement('div');
            evDiv.className = 'event-item';
            
            const title = document.createElement('h4');
            title.textContent = ev.title;
            
            const time = document.createElement('p');
            time.innerHTML = `<strong>Time:</strong> ${ev.time}`;
            
            const location = document.createElement('p');
            location.innerHTML = `<strong>Location:</strong> ${ev.location}`;
            
            const desc = document.createElement('p');
            desc.textContent = ev.description;
            
            evDiv.appendChild(title);
            evDiv.appendChild(time);
            evDiv.appendChild(location);
            evDiv.appendChild(desc);
            
            eventList.appendChild(evDiv);
        });
    }

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
    
    // Select today by default if it has events
    const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const todayEvents = mockEvents.filter(e => e.date === todayStr);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    showEventsForDate(todayStr, `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`, todayEvents);

    // Load Profile from LocalStorage
    const storedProfile = localStorage.getItem('studentProfile');
    if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        const nameEl = document.querySelector('.profile-name');
        const idEl = document.querySelector('.profile-id');
        const courseEl = document.querySelector('.profile-course');
        const avatarEl = document.querySelector('.profile-avatar span');
        
        if (nameEl) nameEl.textContent = profile.fullName;
        if (idEl) idEl.textContent = 'ID: ' + profile.studentId;
        if (courseEl) courseEl.textContent = profile.course;
        
        if (avatarEl && profile.fullName) {
            const parts = profile.fullName.trim().split(/\s+/);
            let initials = '';
            if (parts.length >= 2) {
                initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            } else if (parts.length === 1) {
                initials = parts[0].substring(0, 2).toUpperCase();
            }
            avatarEl.textContent = initials;
        }
    }
});
