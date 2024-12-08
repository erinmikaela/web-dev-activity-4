import { getChampionDetails } from './fetchChampionDetails.js';

document.addEventListener('DOMContentLoaded', () => {
  const championGrid = document.getElementById("champion-grid");
  const detailsContainer = document.getElementById("champion-details-container");
  const urlParams = new URLSearchParams(window.location.search);
  const championKey = urlParams.get('championKey');

  if (championKey) {
    // Handle the details page
    loadChampionDetails(championKey, detailsContainer);
  } else if (championGrid) {
    // Attach click event listeners for the grid
    championGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".champion-card");
      if (card) {
        const championKey = card.dataset.key;
        if (championKey) {
          redirectToChampionPage(championKey);
        }
      }
    });
  }
});

// Function to redirect to the champion details page
function redirectToChampionPage(championKey) {
  window.location.href = `champion-details.html?championKey=${championKey}`;
}

// Function to load champion details and display them in a container
async function loadChampionDetails(championKey, container) {
  if (!container) {
    console.error("Champion details container not found.");
    return;
  }

  try {
    const details = await getChampionDetails(championKey);

    if (!details) {
      container.innerHTML = '<p>Champion details not found.</p>';
      return;
    }

    const highResImageUrl = `https://cdn.communitydragon.org/latest/champion/${championKey}/splash-art`;
    const { name, title, shortBio, tacticalInfo = {}, playstyleInfo = {}, roles = [] } = details;

    container.innerHTML = `
      <img src="${highResImageUrl}" alt="${name}">
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
    `;
  } catch (error) {
    console.error(`Error fetching champion details for ${championKey}:`, error);
    container.innerHTML = '<p>Failed to fetch champion details. Please try again later.</p>';
  }
}
