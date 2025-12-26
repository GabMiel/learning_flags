document.addEventListener("DOMContentLoaded", () => {
  const flags = document.querySelectorAll(".flag");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close");
  const modalTitle = document.getElementById("modal-title");
  const fetchBtn = document.getElementById("fetch-data");
  const infoDiv = document.getElementById("country-info");
  let selectedCountry = "";

  // Open modal when flag clicked
  flags.forEach(flag => {
    flag.addEventListener("click", () => {
      selectedCountry = flag.dataset.country;
      modalTitle.textContent = `Data for ${selectedCountry}`;
      modal.classList.remove("hidden");
      infoDiv.innerHTML = "";
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Fetch data (for now, from local JSON)
  fetchBtn.addEventListener("click", () => {
    const year = document.getElementById("year").value;

    // Later: replace with API call like:
    // fetch(`https://your-api.com/country/${selectedCountry}?year=${year}`)
    fetch("data/sample.json")
      .then(res => res.json())
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
      });
  });
});