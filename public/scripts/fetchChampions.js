import { getChampionDetails } from './fetchChampionDetails.js';
import { setupPagination, calculatePaginationData } from './pagination.js';

// Constants
const patch = "latest";
const maxChampionsPerPage = 30; // Number of champions to display per page
const maxConcurrentRequests = 5; // Control the concurrency for requests

// In-memory cache
const cache = {
  championDetails: {}, // Cache for champion details
  imageValidation: {}, // Cache for image validation results
};

let currentPage = 1; // Current page for pagination
let totalPages = 1; // Total number of pages
let validChampions = []; // Valid champions after image validation

async function loadChampions() {
  const championGrid = document.getElementById("champion-grid");
  const paginationControls = document.getElementById("pagination-controls");

  try {
    showLoadingScreen();
    // Fetch champions using the proxy route
    const response = await fetch("/api/champions");
    const champions = await response.json();

    // Validate images concurrently with controlled concurrency
    validChampions = await filterValidChampions(Object.keys(champions));

    if (!validChampions.length) {
      championGrid.innerHTML = `<p>No champions found or their images could not be loaded. Please try again later.</p>`;
      return;
    }

    // Calculate total pages
    totalPages = Math.ceil(validChampions.length / maxChampionsPerPage);

    // Display champions for the current page
    displayCurrentPage();

    // Setup pagination controls
    setupPaginationControls(paginationControls);
  } catch (error) {
    console.error("Error loading champions:", error);
    championGrid.innerHTML = `<p>Failed to load champions. Please try again later.</p>`;
  } finally {
    hideLoadingScreen();
  }
}

async function filterValidChampions(keys) {
  const validChampions = [];
  const promises = keys.map(async (key) => {
    const imageUrl = `https://cdn.communitydragon.org/${patch}/champion/${key}/square`;
    const isValid = await validateImageWithCache(key, imageUrl);
    if (isValid) validChampions.push(key);
  });

  // Use Promise.all to fetch all data concurrently
  await Promise.all(promises);
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

async function displayCurrentPage() {
  const championGrid = document.getElementById("champion-grid");
  const { startIndex, endIndex } = calculatePaginationData(validChampions.length, maxChampionsPerPage, currentPage);
  const championsToDisplay = validChampions.slice(startIndex, endIndex);

  // Fetch and display champions
  championGrid.innerHTML = await displayChampions(championsToDisplay);
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

  try {
    const details = await getChampionDetails(key);
    cache.championDetails[key] = details;
    return details;
  } catch (error) {
    console.error(`Error fetching details for champion ${key}:`, error);
    return null;
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

function setupPaginationControls(container) {
  container.innerHTML = ""; // Clear existing controls

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) button.classList.add("active");

    button.addEventListener("click", async () => {
      currentPage = i;
      await displayCurrentPage();
      updateActiveButton(container);
    });

    container.appendChild(button);
  }
}

function updateActiveButton(container) {
  const buttons = container.querySelectorAll(".pagination-button");
  buttons.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Initialize champions on page load
document.addEventListener("DOMContentLoaded", loadChampions);