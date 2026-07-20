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
const categoryButtons = document.getElementById("category-buttons");
const homeResults = document.getElementById("home-results");
const jobsResults = document.getElementById("jobs-results");
const volunteerResults = document.getElementById("volunteer-results");

let selectedTag = "";

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

  uniqueValues(listings.map((item) => item.minAge)).forEach((age) => {
    const option = document.createElement("option");
    option.value = String(age);
    option.textContent = `${age}+`;
    ageFilter.appendChild(option);
  });

  const allTags = uniqueValues(listings.flatMap((item) => item.tags));
  const allButton = document.createElement("button");
  allButton.className = "category-btn active";
  allButton.textContent = "All categories";
  allButton.dataset.tag = "";
  categoryButtons.appendChild(allButton);

  allTags.forEach((tag) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.textContent = tag;
    button.dataset.tag = tag;
    categoryButtons.appendChild(button);
  });

  categoryButtons.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    selectedTag = target.dataset.tag || "";
    categoryButtons.querySelectorAll(".category-btn").forEach((button) => {
      button.classList.toggle("active", button === target);
    });
    renderListings();
  });
}

function filterListings() {
  const query = searchInput.value.trim().toLowerCase();
  const location = locationFilter.value;
  const age = ageFilter.value ? Number(ageFilter.value) : null;
  const type = typeFilter.value;

  return listings.filter((listing) => {
    const matchesQuery =
      !query ||
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesLocation = !location || listing.location === location;
    const matchesAge = age === null || listing.minAge === age;
    const matchesType = !type || listing.type === type;
    const matchesTag = !selectedTag || listing.tags.includes(selectedTag);

    return matchesQuery && matchesLocation && matchesAge && matchesType && matchesTag;
  });
}

function cardTemplate(item) {
  return `<article class="card">
    <h3>${item.title}</h3>
    <div class="meta">
      <span><strong>Location:</strong> ${item.location}</span>
      <span><strong>Age:</strong> ${item.minAge}+</span>
      <span><strong>Type:</strong> ${item.type === "job" ? "Part-time Job" : "Volunteer"}</span>
    </div>
    <p>${item.description}</p>
    <div class="tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
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
    const value = Math.max(0, Number(hoursInput.value) || 0);
    const progress = Math.min(100, (value / targetHours) * 100);
    progressBar.style.width = `${progress}%`;
    hoursText.textContent = `${value} / ${targetHours} hours completed`;
  };

  updateButton.addEventListener("click", updateProgress);
}

[searchInput, locationFilter, ageFilter, typeFilter].forEach((element) => {
  element.addEventListener("input", renderListings);
});

setupFilters();
setupPageNavigation();
setupTracker();
renderListings();
