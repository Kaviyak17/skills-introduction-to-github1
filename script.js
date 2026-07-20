const listings = [
  {
    title: "Library Assistant",
    location: "Downtown",
    minAge: 15,
    description: "Help organize shelves, prep displays, and support after-school reading events.",
    tags: ["no experience needed", "after school"],
    type: "job"
  },
  {
    title: "Cafe Counter Team Member",
    location: "Northside",
    minAge: 16,
    description: "Take orders, serve drinks, and keep the front counter welcoming during evenings.",
    tags: ["walk-in friendly", "weekend shifts"],
    type: "job"
  },
  {
    title: "Pet Store Helper",
    location: "Lakeside",
    minAge: 14,
    description: "Restock small items and greet customers in a student-friendly retail environment.",
    tags: ["no experience needed", "flexible hours"],
    type: "job"
  },
  {
    title: "Food Bank Volunteer",
    location: "Downtown",
    minAge: 14,
    description: "Sort donations and build meal kits with community mentors every Saturday.",
    tags: ["walk-in friendly", "community impact"],
    type: "volunteer"
  },
  {
    title: "Park Cleanup Crew",
    location: "West End",
    minAge: 13,
    description: "Join local teams to clean trails and public spaces once a week.",
    tags: ["outdoor", "no experience needed"],
    type: "volunteer"
  },
  {
    title: "Senior Center Activity Buddy",
    location: "Northside",
    minAge: 15,
    description: "Support board games, reading sessions, and social activities with seniors.",
    tags: ["service hours", "walk-in friendly"],
    type: "volunteer"
  }
];

const searchInput = document.getElementById("search-input");
const locationFilter = document.getElementById("location-filter");
const ageFilter = document.getElementById("age-filter");
const typeFilter = document.getElementById("type-filter");
const tagFilter = document.getElementById("tag-filter");
const homeResults = document.getElementById("home-results");
const jobsResults = document.getElementById("jobs-results");
const volunteerResults = document.getElementById("volunteer-results");

function uniqueValues(values) {
  return [...new Set(values)].sort();
}

function setupFilters() {
  uniqueValues(listings.map((item) => item.location)).forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationFilter.appendChild(option);
  });

  uniqueValues(listings.flatMap((item) => item.tags)).forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    tagFilter.appendChild(option);
  });
}

function filterListings() {
  const query = searchInput.value.trim().toLowerCase();
  const location = locationFilter.value;
  const age = ageFilter.value ? Number(ageFilter.value) : null;
  const type = typeFilter.value;
  const tag = tagFilter.value;

  return listings.filter((listing) => {
    const matchesQuery =
      !query ||
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesLocation = !location || listing.location === location;
    const matchesAge = age === null || listing.minAge <= age;
    const matchesType = !type || listing.type === type;
    const matchesTag = !tag || listing.tags.includes(tag);

    return matchesQuery && matchesLocation && matchesAge && matchesType && matchesTag;
  });
}

function formatTag(tag) {
  if (tag === "no experience needed") {
    return "No Experience";
  }
  if (tag === "walk-in friendly") {
    return "Walk-In Friendly";
  }
  return tag
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function cardTemplate(item) {
  return `<article class="card">
    <div class="card-header">
      <h3>${item.title}</h3>
      <span class="pill">${item.minAge}+</span>
    </div>
    <div class="meta">
      <span><strong>Location:</strong> ${item.location}</span>
      <span><strong>Type:</strong> ${item.type === "job" ? "Part-time Job" : "Volunteer"}</span>
    </div>
    <p>${item.description}</p>
    <div class="tags">${item.tags.map((tag) => `<span class="tag">${formatTag(tag)}</span>`).join("")}</div>
  </article>`;
}

function renderTarget(items, targetElement) {
  if (!items.length) {
    targetElement.innerHTML = '<p class="empty">No listings match your filters yet.</p>';
    return;
  }

  targetElement.innerHTML = items.map(cardTemplate).join("");
}

function renderListings() {
  const filtered = filterListings();
  renderTarget(filtered, homeResults);
  renderTarget(filtered.filter((item) => item.type === "job"), jobsResults);
  renderTarget(filtered.filter((item) => item.type === "volunteer"), volunteerResults);
}

function setupPageNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = {
    home: document.getElementById("home-page"),
    jobs: document.getElementById("jobs-page"),
    volunteer: document.getElementById("volunteer-page")
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((navButton) => navButton.classList.remove("active"));
      button.classList.add("active");
      const selectedPage = button.dataset.page;
      Object.entries(pages).forEach(([key, page]) => {
        page.classList.toggle("active", key === selectedPage);
      });
    });
  });
}

function setupTracker() {
  const hoursInput = document.getElementById("hours-input");
  const updateButton = document.getElementById("update-hours");
  const progressBar = document.getElementById("hours-progress");
  const hoursText = document.getElementById("hours-text");
  const targetHours = 40;

  const updateProgress = () => {
    const parsedValue = Number(hoursInput.value);
    const value = Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      hoursInput.value = String(value);
    }
    const progress = Math.min(100, (value / targetHours) * 100);
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", String(targetHours));
    progressBar.setAttribute("aria-valuenow", String(Math.min(value, targetHours)));
    hoursText.textContent = `${value} / ${targetHours} hours completed`;
  };
  updateButton.addEventListener("click", updateProgress);
  updateProgress();
}

[searchInput, locationFilter, ageFilter, typeFilter, tagFilter].forEach((element) => {
  element.addEventListener("input", renderListings);
});

setupFilters();
setupPageNavigation();
setupTracker();
renderListings();
