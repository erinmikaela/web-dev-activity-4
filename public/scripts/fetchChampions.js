import { getChampionDetails } from './fetchChampionDetails.js';

// Constants
const patch = "latest";
const maxChampionsToDisplay = 124;
const maxConcurrentRequests = 10; // Control the concurrency for requests

// In-memory cache
const cache = {
  championDetails: {}, // Cache for champion details
  imageValidation: {}, // Cache for image validation results
};

async function loadChampions() {
  const championGrid = document.getElementById("champion-grid");

  try {
    // Fetch champions using the proxy route
    const response = await fetch("/api/champions");
    const champions = await response.json();

    // Validate images in parallel with controlled concurrency
    const keys = Object.keys(champions);
    const validChampions = await filterValidChampions(keys);

    if (!validChampions.length) {
      championGrid.innerHTML = `<p>No champions found or their images could not be loaded. Please try again later.</p>`;
      return;
    }

    // Fetch and display champions
    championGrid.innerHTML = await displayChampions(validChampions);
  } catch (error) {
    console.error("Error loading champions:", error);
    championGrid.innerHTML = `<p>Failed to load champions. Please try again later.</p>`;
  }
}

async function filterValidChampions(keys) {
  const validChampions = [];
  let activeRequests = [];

  for (const key of keys) {
    if (validChampions.length >= maxChampionsToDisplay) break;

    const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${key}/square`;

    const validationPromise = validateImageWithCache(key, imageUrl).then((isValid) => {
      if (isValid) validChampions.push(key);
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

async function validateImageWithCache(key, imageUrl) {
  if (cache.imageValidation[key] !== undefined) {
    return cache.imageValidation[key];
  }

  const isValid = await validateImage(imageUrl);
  cache.imageValidation[key] = isValid;
  return isValid;
}

async function displayChampions(keys) {
  const championCards = await Promise.all(
    keys.map(async (key) => {
      const details = await getDetailsWithCache(key);
      const name = details?.name || key;
      const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${key}/square`;

      return `
      <div class="champion-card" data-key="${key}">
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

async function getDetailsWithCache(key) {
  if (cache.championDetails[key]) {
    return cache.championDetails[key];
  }

  const details = await getChampionDetails(key);
  cache.championDetails[key] = details;
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
