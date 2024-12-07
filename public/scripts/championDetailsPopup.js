import { getChampionDetails } from './fetchChampionDetails.js';

// Attach event listeners to champion cards
document.addEventListener('DOMContentLoaded', () => {
  const championGrid = document.getElementById("champion-grid");

  if (championGrid) {
    championGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".champion-card");
      if (card) {
        const championKey = card.dataset.key; // Use dataset for cleaner attribute access
        const imageUrl = card.dataset.image;
        if (championKey) {
          showChampionDetailsPopup(championKey, imageUrl);
        }
      }
    });
  }
});

// Function to fetch and display champion details in a reusable modal
async function showChampionDetailsPopup(championKey, imageUrl) {
  try {
    // Fetch champion details
    const details = await getChampionDetails(championKey);

    if (!details) {
      console.error(`No details found for champion: ${championKey}`);
      return;
    }

    // Extract relevant details
    const { name, title, shortBio, tacticalInfo = {}, playstyleInfo = {}, roles = [] } = details;

    // Create or reuse the modal element
    let modal = document.getElementById("champion-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "champion-modal";
      modal.className = "modal"; // Apply the CSS class from style.css
      document.body.appendChild(modal);

      // Add close button functionality
      modal.addEventListener("click", (event) => {
        if (event.target.id === "close-modal" || event.target === modal) {
          modal.style.display = "none"; // Hide instead of removing
        }
      });
    }

    // Update modal content dynamically
    modal.innerHTML = `
      <div class="modal-content">
        <img src="${imageUrl}" alt="${name}">
        <h2>${name}</h2>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Short Bio:</strong> ${shortBio}</p>
        <p><strong>Roles:</strong> ${roles.join(", ") || "N/A"}</p>
        <hr>
        <h3>Tactical Info:</h3>
        <ul>
          <li><strong>Style:</strong> ${tacticalInfo.style ?? "N/A"}</li>
          <li><strong>Difficulty:</strong> ${tacticalInfo.difficulty ?? "N/A"}</li>
          <li><strong>Damage Type:</strong> ${tacticalInfo.damageType ?? "N/A"}</li>
        </ul>
        <h3>Playstyle Info:</h3>
        <ul>
          <li><strong>Damage:</strong> ${playstyleInfo.damage ?? "N/A"}</li>
          <li><strong>Durability:</strong> ${playstyleInfo.durability ?? "N/A"}</li>
          <li><strong>Crowd Control:</strong> ${playstyleInfo.crowdControl ?? "N/A"}</li>
          <li><strong>Mobility:</strong> ${playstyleInfo.mobility ?? "N/A"}</li>
          <li><strong>Utility:</strong> ${playstyleInfo.utility ?? "N/A"}</li>
        </ul>
        <button id="close-modal">Close</button>
      </div>
    `;

    // Show the modal
    modal.style.display = "block";

  } catch (error) {
    console.error(`Error fetching details for champion: ${championKey}`, error);
    alert("Failed to fetch champion details. Please try again later.");
  }
}
