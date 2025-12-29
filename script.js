document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     SIDEBAR TOGGLE
  ====================== */
  const profileBtn = document.getElementById("profile-btn");
  const sidebar = document.getElementById("sidebar");

  if (profileBtn && sidebar) {
    profileBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }

  /* ======================
     COUNTRY CARD MODAL
  ====================== */
  const cards = document.querySelectorAll(".country-card");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close");
  const modalTitle = document.getElementById("modal-title");
  const fetchBtn = document.getElementById("fetch-data");
  const infoDiv = document.getElementById("country-info");

  let selectedCountry = "";

  cards.forEach(card => {
    card.addEventListener("click", () => {
      selectedCountry = card.dataset.country;

      if (!modal) return;

      modalTitle.textContent = `Data for ${selectedCountry}`;
      infoDiv.innerHTML = "";
      modal.classList.remove("hidden");
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  /* ======================
     FETCH COUNTRY DATA
  ====================== */
  if (fetchBtn) {
    fetchBtn.addEventListener("click", () => {
      const yearInput = document.getElementById("year");
      if (!yearInput || !selectedCountry) return;

      const year = yearInput.value;
      const fileName = selectedCountry.toLowerCase() + ".json";

      fetch(`data/${fileName}`)
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.json();
        })
        .then(data => {
          if (data[selectedCountry] && data[selectedCountry][year]) {
            const entry = data[selectedCountry][year];
            infoDiv.innerHTML = `
              <p><strong>Population:</strong> ${entry.population}</p>
              <p><strong>GDP:</strong> ${entry.GDP} Billion USD</p>
              <p><strong>Lifestyle:</strong> ${entry.lifestyle}</p>
            `;
          } else {
            infoDiv.innerHTML = `<p>No data available for ${year}.</p>`;
          }
        })
        .catch(err => {
          infoDiv.innerHTML = `<p>Error loading data: ${err.message}</p>`;
        });
    });
  }

  /* ======================
     SEARCH FILTER
  ====================== */
  const searchInput = document.getElementById("search");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();

      cards.forEach(card => {
        const country = card.dataset.country.toLowerCase();
        card.style.display = country.includes(term) ? "block" : "none";
      });
    });
  }

  /* ======================
     DARK MODE
  ====================== */
  const toggle = document.getElementById("dark-mode-toggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  /* ======================
     ACHIEVEMENTS
  ====================== */
  let xp = parseInt(localStorage.getItem("xp")) || 0;

  function checkAchievements() {
    const list = document.getElementById("achievements-list");
    if (!list) return;

    list.innerHTML = "";
    if (xp >= 100) list.innerHTML += "<li>🏆 Beginner Explorer</li>";
    if (xp >= 500) list.innerHTML += "<li>🌍 World Master</li>";
  }

  checkAchievements();
});
