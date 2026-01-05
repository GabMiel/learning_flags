const params = new URLSearchParams(window.location.search);
const countryName = params.get("name");
const continent = params.get("continent");

let currentSection = 0;
let sections = [];

// ✅ Fix: set close button to go back to continent list
const closeBtn = document.getElementById("closeBtn");
if (continent) {
  closeBtn.href = `../continents/${continent}/${continent}.html`;
} else {
  closeBtn.href = "../index.html"; // fallback if continent is missing
}

if (countryName && continent) {
  const safeFileName = countryName.toLowerCase().replace(/ /g, "-") + ".json";
  const filePath = `../data/countries/${continent}/${safeFileName}`;

  fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${filePath}`);
      return res.json();
    })
    .then(country => {
      document.getElementById("country-name").textContent = country.name;
      document.getElementById("country-flag").src = `https://flagcdn.com/w80/${country.flag}.png`;
      document.getElementById("country-image").style.backgroundImage = `url('${country.image}')`;

      sections = country.sections || [];
      showSection();
    })
    .catch(err => {
      document.querySelector(".country-page").innerHTML = `<p style="color:red;">Country data not found.</p>`;
      console.error(err);
    });
}

function showSection() {
  const section = sections[currentSection];
  document.getElementById("section-title").textContent = section?.title || "No Title";
  document.getElementById("section-content").textContent = section?.content || "No content available.";

  document.getElementById("prevSection").style.display = currentSection === 0 ? "none" : "inline-block";
  document.getElementById("nextSection").style.display = currentSection === sections.length - 1 ? "none" : "inline-block";
}

document.getElementById("prevSection").addEventListener("click", () => {
  if (currentSection > 0) {
    currentSection--;
    showSection();
  }
});

document.getElementById("nextSection").addEventListener("click", () => {
  if (currentSection < sections.length - 1) {
    currentSection++;
    showSection();
  }
});

const breadcrumb = document.getElementById("breadcrumb");
if (continent) {
  breadcrumb.innerHTML = `<a href="../continents/${continent}/${continent}.html">← Back to ${continent.charAt(0).toUpperCase() + continent.slice(1)}</a>`;
}