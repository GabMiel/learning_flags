const params = new URLSearchParams(window.location.search);
const countryName = params.get("name");
const continent = params.get("continent");

let currentIndex = 0;
const cardsPerPage = 4;

/* Breadcrumb */
const breadcrumb = document.getElementById("breadcrumb");
if (continent) {
  breadcrumb.innerHTML = `
    <a href="../continents/${continent}/${continent}.html">
      ← Back to ${continent.charAt(0).toUpperCase() + continent.slice(1)}
    </a>
  `;
}

/* Auto icons based on title */
function getIcon(title) {
  title = title.toLowerCase();
  if (title.includes("capital")) return "🏛️";
  if (title.includes("currency")) return "💱";
  if (title.includes("language")) return "🗣️";
  if (title.includes("food")) return "🍽️";
  if (title.includes("culture")) return "🎭";
  if (title.includes("history")) return "📜";
  return "📘";
}

/* Food modal elements */
const foodModal = document.getElementById("food-modal");
const foodGallery = document.getElementById("food-gallery");
const closeModalBtn = document.querySelector(".modal-close");

function openFoodModal(images) {
  foodGallery.innerHTML = "";

  images.forEach(imgSrc => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Traditional food";
    foodGallery.appendChild(img);
  });

  foodModal.classList.remove("hidden");
}

closeModalBtn.onclick = () => foodModal.classList.add("hidden");
foodModal.onclick = e => {
  if (e.target === foodModal) foodModal.classList.add("hidden");
};

if (countryName && continent) {
  const safeFileName = countryName.toLowerCase().replace(/ /g, "-") + ".json";
  const filePath = `../data/countries/${continent}/${safeFileName}`;

  fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error("Country not found");
      return res.json();
    })
    .then(country => {
      document.getElementById("country-name").textContent = country.name;
      document.getElementById("country-flag").src =
        `https://flagcdn.com/w80/${country.flag}.png`;

      document.getElementById("map-image").src =
        `https://flagcdn.com/map.svg?country=${country.flag.toUpperCase()}`;

      renderCards(country.sections || []);
      renderTimeline(country.history || []);

      document.getElementById("prevSection").onclick = () => {
        if (currentIndex > 0) {
          currentIndex -= cardsPerPage;
          renderCards(country.sections);
        }
      };

      document.getElementById("nextSection").onclick = () => {
        if (currentIndex + cardsPerPage < country.sections.length) {
          currentIndex += cardsPerPage;
          renderCards(country.sections);
        }
      };
    })
    .catch(err => {
      document.querySelector(".country-page").innerHTML =
        `<p style="color:red;">Country data not found.</p>`;
      console.error(err);
    });
}

/* Render info cards */
function renderCards(sections) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  sections
    .slice(currentIndex, currentIndex + cardsPerPage)
    .forEach(section => {
      const card = document.createElement("div");
      card.className = "info-card";

      card.innerHTML = `
        <div class="card-icon">${getIcon(section.title)}</div>
        <div class="card-body">
          <h3>${section.title}</h3>
          <p>${section.content}</p>
        </div>
      `;

      /* Food modal trigger */
      if (section.images) {
        card.style.cursor = "pointer";
        card.onclick = () => openFoodModal(section.images);
      }

      container.appendChild(card);
    });
}

/* Render history timeline */
function renderTimeline(history) {
  const yearList = document.getElementById("year-list");
  const content = document.getElementById("history-content");

  yearList.innerHTML = "";
  content.innerHTML = "<p>Select a year to view historical details.</p>";

  history.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "year-btn";
    btn.textContent = item.year;

    btn.onclick = () => {
      document.querySelectorAll(".year-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      content.innerHTML = `
        <h3>${item.year}</h3>
        <img src="${item.image}" class="history-img" alt="Historical event">
        <p>${item.event}</p>
        <a href="${item.link}" target="_blank" class="history-link">
          Read more on Wikipedia →
        </a>
      `;
    };

    yearList.appendChild(btn);
  });
}
