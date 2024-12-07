import { getChampionDetails } from './fetchChampionDetails.js';

// Constants
const patch = "latest";
const maxChampionsToDisplay = 1000; // This constant determines the maximum number of champions to display
const maxConcurrentRequests = 10; // Control the concurrency for requests

// In-memory cache
const cache = {
  championDetails: {}, // Cache for champion details
  imageValidation: {}, // Cache for image validation results
};

async function loadChampions() {
  const championGrid = document.getElementById("champion-grid");
  const loadingScreen = document.getElementById("loading-screen");

  try {
    // Show loading screen
    loadingScreen.style.display = "flex";

    // Fetch champions using the proxy route
    const response = await fetch("/api/champions");
    const champions = await response.json();

    // Validate images in parallel with controlled concurrency
    const championKeys = Object.keys(champions).slice(0, maxChampionsToDisplay); // Limit the number of keys to maxChampionsToDisplay
    const validChampions = await filterValidChampions(championKeys);

    if (!validChampions.length) {
      championGrid.innerHTML = `<p>No champions found or their images could not be loaded. Please try again later.</p>`;
      return;
    }

    // Sort champions alphabetically
    validChampions.sort((a, b) => a.localeCompare(b));

    // Fetch and display champions
    championGrid.innerHTML = await displayChampions(validChampions);
  } catch (error) {
    console.error("Error loading champions:", error);
    championGrid.innerHTML = `<p>Failed to load champions. Please try again later.</p>`;
  } finally {
    // Hide loading screen
    loadingScreen.style.display = "none";
  }
}

async function filterValidChampions(championKeys) {
  const validChampions = [];
  let activeRequests = [];

  for (const championKey of championKeys) {
    if (validChampions.length >= maxChampionsToDisplay) break; // This line ensures that no more than maxChampionsToDisplay champions are processed

    const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${championKey}/square.png`; // Ensure the correct file extension

    const validationPromise = validateImageWithCache(championKey, imageUrl).then((isValid) => {
      if (isValid) validChampions.push(championKey);
    });

    activeRequests.push(validationPromise);

    // Control the number of concurrent requests
    if (activeRequests.length >= maxConcurrentRequests) {
      await Promise.race(activeRequests);
      activeRequests = activeRequests.filter((req) => !req.isSettled);
    }
  }

  // Wait for remaining requests
  await Promise.all(activeRequests);
  return validChampions;
}

async function validateImageWithCache(championKey, imageUrl) {
  if (cache.imageValidation[championKey] !== undefined) {
    return cache.imageValidation[championKey];
  }

  const isValid = await validateImage(imageUrl);
  cache.imageValidation[championKey] = isValid;
  return isValid;
}

async function displayChampions(championKeys) {
  const championCards = await Promise.all(
    championKeys.map(async (championKey) => {
      const details = await getDetailsWithCache(championKey);
      const name = details?.name || championKey;
      const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${championKey}/square.png`; // Ensure the correct file extension

      return `
      <div class="champion-card" data-key="${championKey}">
        <a href="javascript:void(0)">
          <img src="${imageUrl}" alt="${name}" 
               onerror="this.onerror=null; this.src='https://example.com/default-image.jpg';">
          <p>${name}</p>
        </a>
      </div>
      `;
    })
  );

  return championCards.join("");
}

async function getDetailsWithCache(championKey) {
  if (cache.championDetails[championKey]) {
    return cache.championDetails[championKey];
  }

  const details = await getChampionDetails(championKey);
  cache.championDetails[championKey] = details;
  return details;
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
