
const fs = require('fs');
const path = require('path');

const eventStartTime = '10:00 AM';
const talkDurationMinutes = 60;
const transitionMinutes = 10;
const lunchDurationMinutes = 60;

const talks = [
    {
        title: 'The Future of AI in Software Engineering',
        speakers: ['Dr. Anya Sharma'],
        category: ['AI', 'Software Development', 'Future Tech'],
        duration: talkDurationMinutes,
        description: 'Explore the transformative role of artificial intelligence in modern software development, from automated code generation to intelligent debugging systems.'
    },
    {
        title: 'Mastering Microservices: A Practical Guide',
        speakers: ['Ben Carter', 'Chloe Davis'],
        category: ['Microservices', 'Architecture', 'DevOps'],
        duration: talkDurationMinutes,
        description: 'Dive into the world of microservices with practical examples and best practices for design, deployment, and scaling distributed systems.'
    },
    {
        title: 'Frontend Frameworks: Beyond React',
        speakers: ['Liam Gallagher'],
        category: ['Frontend', 'Web Development', 'Frameworks'],
        duration: talkDurationMinutes,
        description: 'A critical look at emerging frontend frameworks and techniques that are shaping the next generation of web applications, moving beyond the mainstream.'
    },
    {
        title: 'Cybersecurity Essentials for Developers',
        speakers: ['Sophie Miller'],
        category: ['Cybersecurity', 'Security', 'Development'],
        duration: talkDurationMinutes,
        description: 'Learn fundamental cybersecurity principles and common vulnerabilities that every developer should know to build more secure applications.'
    },
    {
        title: 'Cloud Native Development with Kubernetes',
        speakers: ['Ethan Wong'],
        category: ['Cloud Native', 'Kubernetes', 'Containers'],
        duration: talkDurationMinutes,
        description: 'An in-depth session on leveraging Kubernetes for deploying, managing, and scaling containerized applications in cloud-native environments.'
    },
    {
        title: 'Data Streaming with Apache Kafka',
        speakers: ['Olivia Clark'],
        category: ['Data', 'Kafka', 'Streaming'],
        duration: talkDurationMinutes,
        description: 'Understand the power of real-time data streaming. This talk covers Apache Kafka fundamentals, use cases, and how to build robust data pipelines.'
    }
];

function generateSchedule(talks, eventStartTime, talkDurationMinutes, transitionMinutes, lunchDurationMinutes) {
    const schedule = [];
    let currentTime = new Date(`2000/01/01 ${eventStartTime}`); // Use a dummy date for time calculations

    talks.forEach((talk, index) => {
        // Add a transition before the talk, unless it's the first one
        if (index > 0) {
            currentTime.setMinutes(currentTime.getMinutes() + transitionMinutes);
        }

        const talkStartTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + talk.duration);
        const talkEndTime = new Date(currentTime);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime: formatTime(talkStartTime),
            endTime: formatTime(talkEndTime)
        });

        // Insert lunch break after the 3rd talk (index 2)
        if (index === 2) {
            currentTime.setMinutes(currentTime.getMinutes() + transitionMinutes); // Transition before lunch
            const lunchStartTime = new Date(currentTime);
            currentTime.setMinutes(currentTime.getMinutes() + lunchDurationMinutes);
            const lunchEndTime = new Date(currentTime);
            schedule.push({
                type: 'break',
                title: 'Lunch Break',
                startTime: formatTime(lunchStartTime),
                endTime: formatTime(lunchEndTime),
                duration: lunchDurationMinutes
            });
        }
    });

    return schedule;
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

const schedule = generateSchedule(talks, eventStartTime, talkDurationMinutes, transitionMinutes, lunchDurationMinutes);

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talks Event</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2 {
            color: #333;
            text-align: center;
        }
        .schedule-item {
            background-color: #e9e9e9;
            border-left: 5px solid #007bff;
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 4px;
        }
        .schedule-item.break {
            border-left: 5px solid #28a745;
            background-color: #d4edda;
            color: #155724;
        }
        .schedule-item h3 {
            margin-top: 0;
            color: #007bff;
        }
        .schedule-item.break h3 {
            color: #155724;
        }
        .schedule-item p {
            margin: 5px 0;
        }
        .schedule-item .time {
            font-weight: bold;
            color: #555;
        }
        .schedule-item.break .time {
            color: #155724;
        }
        .schedule-item .speakers {
            font-style: italic;
            color: #666;
        }
        .schedule-item .category {
            font-size: 0.9em;
            color: #0056b3;
            background-color: #e0f0ff;
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .search-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .search-container input {
            width: 100%;
            max-width: 400px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
        }
        .no-results {
            text-align: center;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Talks Event - April 16, 2026</h1>
        <p style="text-align: center;">A day full of insightful technical discussions.</p>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Filter by category (e.g., AI, Frontend)">
        </div>

        <div id="schedule">
            <!-- Schedule items will be injected here by JavaScript -->
        </div>
    </div>

    <script>
        const eventScheduleData = ${JSON.stringify(schedule, null, 2)}; // Correctly embed the generated schedule

        const scheduleDiv = document.getElementById('schedule');
        const categorySearchInput = document.getElementById('categorySearch');

        function renderSchedule(scheduleToRender) {
            scheduleDiv.innerHTML = ''; // Clear existing schedule

            if (scheduleToRender.length === 0) {
                scheduleDiv.innerHTML = '<p class="no-results">No talks found matching your criteria.</p>';
                return;
            }

            scheduleToRender.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('schedule-item');
                if (item.type === 'break') {
                    itemDiv.classList.add('break');
                    itemDiv.innerHTML = \`
                        <p class="time">\${item.startTime} - \${item.endTime}</p>
                        <h3>\${item.title}</h3>
                    \`;
                } else {
                    const categoriesHtml = item.category.map(cat => \`<span class="category">\${cat}</span>\`).join('');
                    itemDiv.innerHTML = \`
                        <p class="time">\${item.startTime} - \${item.endTime}</p>
                        <h3>\${item.title}</h3>
                        <p class="speakers">Speakers: \${item.speakers.join(', ')}</p>
                        <p>Categories: \${categoriesHtml}</p>
                        <p>\${item.description}</p>
                    \`;
                }
                scheduleDiv.appendChild(itemDiv);
            });
        }

        // Initial render
        renderSchedule(eventScheduleData);

        // Search functionality with debounce
        let searchTimeout;
        categorySearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                if (searchTerm === '') {
                    renderSchedule(eventScheduleData); // Show full schedule if search is empty
                } else {
                    const filteredTalks = eventScheduleData.filter(item => {
                        if (item.type === 'talk') {
                            return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
                        }
                        return false; // Don't filter breaks
                    });
                    renderSchedule(filteredTalks);
                }
            }, 300); // 300ms debounce
        });
    </script>
</body>
</html>
