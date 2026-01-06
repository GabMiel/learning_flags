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
  if (title.includes("population")) return "👥";
  if (title.includes("religion")) return "🕌";
  return "📘";
}

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

      /* Map */
      document.getElementById("map-image").src =
        `https://flagcdn.com/map.svg?country=${country.flag.toUpperCase()}`;

      const sections = country.sections || [];
      renderCards(sections);

      document.getElementById("prevSection").onclick = () => {
        if (currentIndex > 0) {
          currentIndex -= cardsPerPage;
          renderCards(sections);
        }
      };

      document.getElementById("nextSection").onclick = () => {
        if (currentIndex + cardsPerPage < sections.length) {
          currentIndex += cardsPerPage;
          renderCards(sections);
        }
      };
    })
    .catch(err => {
      document.querySelector(".country-page").innerHTML =
        `<p style="color:red;">Country data not found.</p>`;
      console.error(err);
    });
}

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
        <div>
          <h3>${section.title}</h3>
          <p>${section.content}</p>
        </div>
      `;

      container.appendChild(card);
    });
}
