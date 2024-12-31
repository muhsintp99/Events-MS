// Event data
const eventData = {
    events: [
        {
            id: 1,
            title: "Tech Summit 2024",
            description: "A global gathering of tech enthusiasts and industry leaders. Explore the latest in technology and innovation.",
            date: "2024-12-28",
            time: { start: "10:00 AM", end: "6:00 PM" },
            isUpcoming: true,
            image: "images/tech-summit.jpg",
            venue: "Grand Tech Hall, San Francisco",
            organizer: "TechWorld Events",
            seatTotal: 500,
            ticketsSold: 320,
            ticketRate: 1500, // in INR
            tags: ["Technology", "Innovation", "Networking"],
            rating: 4.7, // out of 5
            rateStart: 1000, // minimum ticket price in INR
            lastUpdated: "2024-12-25 10:00 AM"
        },
        {
            id: 2,
            title: "Music Fiesta",
            description: "An electrifying evening of live performances by top artists. Dance, sing, and celebrate music like never before.",
            date: "2024-12-30",
            time: { start: "5:00 PM", end: "11:00 PM" },
            isUpcoming: true,
            image: "images/music-fiesta.jpg",
            venue: "City Arena, New York",
            organizer: "MusicFest Inc.",
            seatTotal: 1000,
            ticketsSold: 750,
            ticketRate: 2500, // in INR
            tags: ["Music", "Concert", "Live"],
            rating: 4.9,
            rateStart: 2000,
            lastUpdated: "2024-12-24 2:30 PM"
        },
        {
            id: 3,
            title: "Art & Culture Expo",
            description: "Explore art from different cultures around the world. A colorful exhibition of creativity and diversity.",
            date: "2025-01-15",
            time: { start: "9:00 AM", end: "5:00 PM" },
            isUpcoming: true,
            image: "images/art-expo.jpg",
            venue: "Art Centre, Los Angeles",
            organizer: "Global Arts",
            seatTotal: 300,
            ticketsSold: 200,
            ticketRate: 1000, // in INR
            tags: ["Art", "Culture", "Exhibition"],
            rating: 4.5,
            rateStart: 800,
            lastUpdated: "2024-12-20 1:00 PM"
        },
        {
            id: 4,
            title: "Startup Pitch Night",
            description: "Watch startups pitch their ideas to investors. Discover the next big thing in innovation and business.",
            date: "2025-02-05",
            time: { start: "6:00 PM", end: "9:00 PM" },
            isUpcoming: true,
            image: "images/startup-pitch.jpg",
            venue: "Innovation Hub, Boston",
            organizer: "Startup Nation",
            seatTotal: 200,
            ticketsSold: 150,
            ticketRate: 500, // in INR
            tags: ["Startups", "Business", "Investors"],
            rating: 4.6,
            rateStart: 300,
            lastUpdated: "2024-12-15 11:00 AM"
        },
        {
            id: 5,
            title: "Health & Wellness Retreat",
            description: "A weekend to rejuvenate your mind and body. Experience mindfulness, yoga, and natural therapies.",
            date: "2025-01-20",
            time: { start: "8:00 AM", end: "8:00 PM" },
            isUpcoming: true,
            image: "images/health-retreat.jpg",
            venue: "Mountain Resort, Colorado",
            organizer: "Wellness Co.",
            seatTotal: 100,
            ticketsSold: 70,
            ticketRate: 3000, // in INR
            tags: ["Health", "Wellness", "Retreat"],
            rating: 4.8,
            rateStart: 2500,
            lastUpdated: "2024-12-18 4:00 PM"
        },
        {
            id: 6,
            title: "Coding Bootcamp",
            description: "An intensive program to learn web development. Build real-world projects and boost your coding skills.",
            date: "2024-12-27",
            time: { start: "9:00 AM", end: "5:00 PM" },
            isUpcoming: true,
            image: "images/coding-bootcamp.jpg",
            venue: "Code Academy, Seattle",
            organizer: "DevLearn",
            seatTotal: 150,
            ticketsSold: 120,
            ticketRate: 2000, // in INR
            tags: ["Coding", "Web Development", "Learning"],
            rating: 4.9,
            rateStart: 1800,
            lastUpdated: "2024-12-22 3:00 PM"
        },
        {
            id: 7,
            title: "Charity Run",
            description: "Join the race and support a noble cause. A day of fun, fitness, and giving back.",
            date: "2025-03-10",
            time: { start: "7:00 AM", end: "12:00 PM" },
            isUpcoming: true,
            image: "images/charity-run.jpg",
            venue: "Central Park, New York",
            organizer: "Run for Life",
            seatTotal: 800,
            ticketsSold: 650,
            ticketRate: 1200, // in INR
            tags: ["Charity", "Sports", "Outdoor"],
            rating: 4.7,
            rateStart: 1000,
            lastUpdated: "2024-12-23 11:30 AM"
        },
        {
            id: 8,
            title: "Film Screening Night",
            description: "Experience a night of indie film screenings. Watch unique stories brought to life by talented filmmakers.",
            date: "2024-12-29",
            time: { start: "6:00 PM", end: "10:00 PM" },
            isUpcoming: true,
            image: "images/film-screening.jpg",
            venue: "Downtown Theater, Chicago",
            organizer: "Indie Film Group",
            seatTotal: 200,
            ticketsSold: 180,
            ticketRate: 800, // in INR
            tags: ["Film", "Cinema", "Art"],
            rating: 4.6,
            rateStart: 600,
            lastUpdated: "2024-12-21 10:00 AM"
        },
        {
            id: 9,
            title: "Culinary Workshop",
            description: "Learn to cook gourmet dishes with a top chef. Enhance your culinary skills with hands-on training.",
            date: "2025-01-10",
            time: { start: "10:00 AM", end: "4:00 PM" },
            isUpcoming: true,
            image: "images/culinary-workshop.jpg",
            venue: "Chef's Kitchen Studio, Houston",
            organizer: "Gourmet Academy",
            seatTotal: 50,
            ticketsSold: 40,
            ticketRate: 3500, // in INR
            tags: ["Cooking", "Workshop", "Food"],
            rating: 4.9,
            rateStart: 3000,
            lastUpdated: "2024-12-19 9:00 AM"
        }
    ]
};


const eventContainer = document.getElementById('eventContainer');

function renderEvents(events) {
    eventContainer.innerHTML = ""; 
    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("event-card");

        card.innerHTML = `
        <img src="${event.image}" alt="${event.title}">
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time.start} - ${event.time.end}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Organizer:</strong> ${event.organizer}</p>
        <p><strong>Rating:</strong> ⭐ ${event.rating}</p>
        <p><strong>Ticket Rate:</strong> ₹${event.ticketRate}</p>
                <p><strong>Last updated:</strong> ${event.lastUpdated} ago</p>

        <p>${event.description}</p>
        <div class="tags">
          ${event.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      `;

        eventContainer.appendChild(card);
    });
}

// Render the events on page load
renderEvents(eventData.events);
