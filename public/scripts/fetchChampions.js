import { getChampionDetails } from './fetchChampionDetails.js'; // Import the function

const patch = "latest";
const maxChampionsToDisplay = 124; // Limit the number of champions to display

async function loadChampions() {
  const championGrid = document.getElementById("champion-grid");

  try {
    // Fetch champions using the proxy route
    const response = await fetch("/api/champions"); // Ensure your server handles this proxy
    const champions = await response.json();

    // Filter and check if image URLs are valid
    const validChampions = [];
    for (const key of Object.keys(champions)) {
      const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${key}/square`;

      // Validate image existence using fetch HEAD request
      const isImageValid = await validateImage(imageUrl);
      if (isImageValid) {
        validChampions.push(key);
      }

      // Stop checking if we reach the display limit
      if (validChampions.length >= maxChampionsToDisplay) break;
    }

    // Log the number of valid images loaded
    console.log(`Number of valid champion images loaded: ${validChampions.length}`);

    // If no valid champions are found, show a message
    if (!validChampions.length) {
      championGrid.innerHTML = `<p>No champions found or their images could not be loaded. Please try again later.</p>`;
      return;
    }

    // Display the champions with detailed names
    championGrid.innerHTML = await Promise.all(
      validChampions.map(async (key) => {
        const details = await getChampionDetails(key); // Fetch champion details
        const name = details?.name || key; // Use fetched name or fallback to key
        const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${key}/square`;
        return `
          <div class="champion-card">
            <img src="${imageUrl}" alt="${name}" 
                 onerror="this.onerror=null; this.src='https://example.com/default-image.jpg';">
            <p>${name}</p>
          </div>
        `;
      })
    ).then((cards) => cards.join(""));

  } catch (error) {
    console.error("Error loading champions:", error);
    championGrid.innerHTML = `<p>Failed to load champions. Please try again later.</p>`;
  }
}

async function validateImage(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

// Initialize champions on page load
document.addEventListener("DOMContentLoaded", loadChampions);
