let currentView = "grid";
let searchTerm = "";
let filteredEvents = [];

let currentFilters = {
  price: [],
  date: [],
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  filterAndRenderEvents();
});

function filterEvents(events) {
  // First apply search
  let filtered = events;
  if (searchTerm) {
    filtered = filtered.filter((event) => {
      return (
        event.title.toLowerCase().includes(searchTerm) ||
        event.organizer.toLowerCase().includes(searchTerm) ||
        event.place.toLowerCase().includes(searchTerm) ||
        event.sortDescription.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Then apply filters
  return applyFilters(filtered);
}

function filterAndRenderEvents() {
  filteredEvents = filterEvents(window.eventsData);
  if (currentView === "grid") {
    renderGridView(filteredEvents);
  } else {
    renderRowView(filteredEvents);
  }

  // Update the UI to show number of results
  updateSearchResults(filteredEvents.length);
}

function updateSearchResults(count) {
  const searchInput = document.getElementById("searchInput");
  if (searchTerm) {
    searchInput.placeholder = `Found ${count} event${count !== 1 ? "s" : ""}`;
  } else {
    searchInput.placeholder = "Search events...";
  }
}

function getPriceRange(price) {
  switch (price) {
    case "0-1000":
      return { min: 0, max: 1000 };
    case "1001-2000":
      return { min: 1001, max: 2000 };
    case "2001-3000":
      return { min: 2001, max: 3000 };
    case "3001+":
      return { min: 3001, max: Infinity };
    default:
      return null;
  }
}

function applyFilters(events) {
  return events.filter((event) => {
    // Price filter
    const priceMatch =
      currentFilters.price.length === 0 ||
      currentFilters.price.some((range) => {
        const { min, max } = getPriceRange(range);
        const price = parseFloat(event.ticketRate);
        return price >= min && price <= max;
      });

    // Date filter
    const dateMatch =
      currentFilters.date.length === 0 ||
      currentFilters.date.some((range) => isDateInRange(event.date, range));

    return priceMatch && dateMatch;
  });
}

// Function to check if date is within range
function isDateInRange(eventDate, range) {
  const date = new Date(eventDate);
  const today = new Date();
  const eventTime = date.getTime();
  const currentTime = today.getTime();

  switch (range) {
    case "today":
      return date.toDateString() === today.toDateString();
    case "week":
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventTime >= currentTime && eventTime <= weekFromNow.getTime();
    case "month":
      const monthFromNow = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      return eventTime >= currentTime && eventTime <= monthFromNow.getTime();
    case "future":
      return eventTime >= currentTime;
    default:
      return true;
  }
}

function handleBooking(event) {
  localStorage.setItem("selectedEvent", JSON.stringify(event));
  window.location.href = "./event.html";
}

function handleFilterChange(filterType, value) {
  const index = currentFilters[filterType].indexOf(value);
  if (index === -1) {
    currentFilters[filterType].push(value);
  } else {
    currentFilters[filterType].splice(index, 1);
  }
  filterAndRenderEvents();
}

function resetFilters() {
  currentFilters = {
    price: [],
    date: [],
  };

  // Reset checkboxes
  document
    .querySelectorAll('.price-group input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });
  document
    .querySelectorAll('.date-group input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });

  // Reset search
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  searchTerm = "";

  // Re-render events
  filterAndRenderEvents();
}

document.addEventListener("DOMContentLoaded", function () {
  // Price filter listeners
  document
    .querySelectorAll('.price-group input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        handleFilterChange("price", e.target.value);
        updateFilterCounts();
      });
    });

  // Date filter listeners
  document
    .querySelectorAll('.date-group input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        handleFilterChange("date", e.target.value);
        updateFilterCounts();
      });
    });
});

// Function to update filter counts in UI
function updateFilterCounts() {
  const totalFilters = currentFilters.price.length + currentFilters.date.length;
  const filterButton = document.querySelector(".dropdown-toggle");
  filterButton.innerHTML = `<i class="fas fa-filter"></i> Filters ${
    totalFilters ? `(${totalFilters})` : ""
  }`;
}

// Update the filterAndRenderEvents function
function filterAndRenderEvents() {
  filteredEvents = filterEvents(window.eventsData);
  if (currentView === "grid") {
    renderGridView(filteredEvents);
  } else {
    renderRowView(filteredEvents);
  }

  // Update results count
  updateSearchResults(filteredEvents.length);

  // Update filter counts
  updateFilterCounts();
}

// Add active filter badges
function updateActiveFilters() {
  const activeFiltersContainer = document.createElement("div");
  activeFiltersContainer.className = "active-filters mt-2";

  const allFilters = [
    ...currentFilters.price.map((price) => ({ type: "price", value: price })),
    ...currentFilters.date.map((date) => ({ type: "date", value: date })),
  ];

  if (allFilters.length > 0) {
    allFilters.forEach((filter) => {
      const badge = document.createElement("span");
      badge.className = "badge bg-secondary me-2 mb-2";
      badge.innerHTML = `${filter.value} <i class="fas fa-times ms-1" style="cursor: pointer;"></i>`;
      badge.querySelector("i").addEventListener("click", () => {
        handleFilterChange(filter.type, filter.value);
        const checkbox = document.querySelector(
          `input[value="${filter.value}"]`
        );
        if (checkbox) checkbox.checked = false;
      });
      activeFiltersContainer.appendChild(badge);
    });
  }

  // Replace existing active filters
  const existingFilters = document.querySelector(".active-filters");
  if (existingFilters) existingFilters.remove();
  document.querySelector(".filter-content").prepend(activeFiltersContainer);
}

document.addEventListener("DOMContentLoaded", function () {
  // Add click event listeners to the buttons
  document
    .getElementById("gridBtn")
    .addEventListener("click", () => switchView("grid"));
  document
    .getElementById("rowBtn")
    .addEventListener("click", () => switchView("row"));

  // Load events data
  fetch("./assets/json/events.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load event data");
      }
      return response.json();
    })
    .then((data) => {
      // Store events data
      window.eventsData = data.events;
      filteredEvents = data.events; // Initialize filtered events
      // Show grid view by default
      switchView("grid");
    })
    .catch((error) => {
      console.error("Error loading events:", error);
    });

  // Load upcoming events (unchanged)
  fetch("./assets/json/UpEvent.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load event data");
      }
      return response.json();
    })
    .then((data) => {
      renderUpcomingEvents(data.upevents);
    })
    .catch((error) => {
      console.error("Error loading events:", error);
    });
});

function switchView(view) {
  currentView = view;
  const gridBtn = document.getElementById("gridBtn");
  const rowBtn = document.getElementById("rowBtn");

  // Update button states
  if (view === "grid") {
    gridBtn.classList.add("active");
    rowBtn.classList.remove("active");
    renderGridView(filteredEvents.length ? filteredEvents : window.eventsData);
  } else {
    gridBtn.classList.remove("active");
    rowBtn.classList.add("active");
    renderRowView(filteredEvents.length ? filteredEvents : window.eventsData);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.getElementById("searchInput").addEventListener(
  "input",
  debounce((e) => {
    searchTerm = e.target.value.toLowerCase();
    filterAndRenderEvents();
  }, 300) // 300ms delay
);
function renderGridView(events) {
  const eventsGrid = document.getElementById("eventsContent");
  eventsGrid.innerHTML = events
    .map(
      (event) => `
        <div class="col-md-6 col-lg-4 events-section-card mb-4">
            <div class="card">
                <div class="position-relative">
                    <img src="${event.image}" class="card-img-top" alt="${
        event.title
      }">
                    <div class="event-date">
                        <span>${formatDate(event.date)}</span>
                        <i class="far fa-calendar"></i>
                    </div>
                    <div class="event-date-box2">
                        <span class="ms-1">${event.ticketsSold}/${
        event.seatTotal
      }</span>
                        <i class="fas fa-chair"></i>
                    </div>
                    <div class="event-date-box3">
                        <span class="ms-1">${event.rating}</span>
                        <i class="fas fa-star text-warning"></i>
                    </div>
                </div>
                <div class="card-body">
                    <div class="content-wrapper">
                        <div class="d-flex justify-content-start align-items-center mb-1">
                            <h5 class="card-title mb-0 fw-bold">${
                              event.title
                            }</h5>
                        </div>
                        <p class="card-text">
                            ${
                              event.sortDescription.length > 16
                                ? event.sortDescription.substring(0, 18) + "..."
                                : event.sortDescription
                            }
                        </p>
                        <div class="event-meta mb-1">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.place}</span>
                        </div>
                        <div class="event-meta mb-3">
                            <i class="fa-brands fa-creative-commons-by"></i>
                            <span>${event.organizer}</span>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="d-flex align-items-center justify-content-center mb-2">
                            <i class="fas fa-tag me-2"></i>
                            <span class="mb-0 fw-bold">₹${
                              event.ticketRate
                            }</span>
                        </div>
                        <button class="btn btn-book w-100" onclick='handleBooking(${JSON.stringify(
                          event
                        )})'>
                            Book Now
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`
    )
    .join("");
}
function renderRowView(events) {
  const eventsRow = document.getElementById("eventsContent");
  eventsRow.innerHTML = events
    .map(
      (event) => `
            <div class="col-12 mb-4 events-section-card">
                <div class="card shadow-sm h-auto">
                    <div class="row g-0">
                        <div class="col-sm-4 position-relative">
                            <img src="${
                              event.image
                            }" class="img-fluid card-img-top card-img-col" alt="${
        event.title
      }">
                            <div class="event-date">
                                <span>${formatDate(event.date)}</span>
                                <i class="far fa-calendar"></i>
                            </div>
                            <div class="event-date-box2">
                                <span class="ms-1">${event.ticketsSold}/${
        event.seatTotal
      }</span>
                                <i class="fas fa-chair"></i>
                            </div>
                            <div class="event-date-box3">
                                <span class="ms-1">${event.rating}</span>
                                <i class="fas fa-star text-warning"></i>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="card-body h-100 d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div class="d-flex justify-content-start align-items-center mb-1">
                                            <h5 class="card-title mb-0 fw-bold">${
                                              event.title
                                            }</h5>
                                        </div>
                                        <p class="card-text">${
                                          event.sortDescription
                                        }</p>
                                        <div class="event-meta mb-1">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>${event.venue}</span>
                                        </div>
                                        <div class="event-meta mb-1">
                                            <i class="fa-brands fa-creative-commons-by"></i>
                                            <span>${event.organizer}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <div class="d-flex justify-content-center align-items-center">
                                            <i class="fas fa-tag me-2"></i>
                                            <span class="mb-0 fw-bold">₹${
                                              event.ticketRate
                                            }</span>
                                        </div>
                                    </div>
                        <button class="btn btn-book" onclick='handleBooking(${JSON.stringify(
                          event
                        )})'>
                                        Book Now
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    )
    .join("");
}

function renderUpcomingEvents(upevents) {
  const container = document.getElementById("eventGrid");
  container.innerHTML = "";

  upevents.forEach((upEvent) => {
    const col = document.createElement("div");
    col.className = "col-12 ";
    col.innerHTML = `
            <div class="card p-2 my-2 border-0 card-upcoming-next">
                
                    <div class="d-flex">
                        <div class="event-avatar me-3">
                            <img src="${
                              upEvent.image
                            }" class="rounded-circle" alt="${upEvent.title}">
                        </div>
                        <div class="event-details w-100">
                            <div class="organizer-info mb-0">
                                <h6 class="card-title fw-bold p-0 m-0">${
                                  upEvent.title
                                }</h6>
                                <small class="text-muted fw-bold">${
                                  upEvent.place
                                }</small> 
                            </div>
                            <div class="organizer-info mb-1">
                                <small class="text-muted">By</small>
                                <span class="font-weight-normal">${
                                  upEvent.organizer
                                }</span>
                            </div>
                            <div class="row">
                                <div class="col text-start">
                                    ${upEvent.tags
                                      .map(
                                        (tag) =>
                                          `<span class="badge me-1">${tag}</span>`
                                      )
                                      .join("")}
                                </div> 
                                <div class="col text-end">
                                    <div class="date-tag text-end">
                                        <small class="text-muted">
                                            <i class="far fa-calendar-alt"></i> 
                                            ${formatDate(upEvent.date)}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>`;
    container.appendChild(col);
  });
}
