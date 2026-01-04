const CARDS_PER_PAGE = 12;
let currentPage = 0;
let countries = [];

const track = document.getElementById("countryGrid");
const dotsContainer = document.getElementById("pageDots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let startX = 0;
let isDragging = false;

// Detect continent from <body data-continent="">
const continent = document.body.dataset.continent;
const jsonFile = `${continent}.json`;

// Fetch the right JSON file
fetch(jsonFile)
  .then(res => res.json())
  .then(data => {
    countries = data.sort((a, b) => a.name.localeCompare(b.name));
    buildPages();
    renderDots();
    updateSlider();
  });

function buildPages() {
  track.innerHTML = "";
  const pages = Math.ceil(countries.length / CARDS_PER_PAGE);

  for (let p = 0; p < pages; p++) {
    const page = document.createElement("div");
    page.className = "slider-page";

    const slice = countries.slice(p * CARDS_PER_PAGE, (p + 1) * CARDS_PER_PAGE);

    slice.forEach(country => {
      const card = document.createElement("div");
      card.className = "country-card";
      card.dataset.country = country.name;
      card.style.backgroundImage = `url('${country.image}')`;

      card.innerHTML = `
        <div class="country-label">
          <img src="https://flagcdn.com/w40/${country.flag}.png">
          <span>${country.name}</span>
        </div>
      `;

      page.appendChild(card);
    });

    track.appendChild(page);
  }
}

function updateSlider() {
  track.style.transform = `translateX(-${currentPage * 100}%)`;
  updateDots();
  updateButtons();
}

/* ===== DOTS ===== */
function renderDots() {
  dotsContainer.innerHTML = "";
  const pages = Math.ceil(countries.length / CARDS_PER_PAGE);

  for (let i = 0; i < pages; i++) {
    const dot = document.createElement("div");
    dot.className = "page-dot";
    if (i === currentPage) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentPage = i;
      updateSlider();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll(".page-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentPage);
  });
}

function updateButtons() {
  const max = Math.ceil(countries.length / CARDS_PER_PAGE) - 1;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === max;
}

/* ===== ARROWS ===== */
prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    updateSlider();
  }
});

nextBtn.addEventListener("click", () => {
  const max = Math.ceil(countries.length / CARDS_PER_PAGE) - 1;
  if (currentPage < max) {
    currentPage++;
    updateSlider();
  }
});

/* ===== TOUCH SWIPE ===== */
track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener("touchend", e => {
  if (!isDragging) return;

  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  const max = Math.ceil(countries.length / CARDS_PER_PAGE) - 1;

  if (diff > 50 && currentPage < max) currentPage++;
  if (diff < -50 && currentPage > 0) currentPage--;

  updateSlider();
  isDragging = false;
});