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
    const { name, title, shortBio, tacticalInfo = {}, roles = [] } = details;

    // Update the champion details in the container
    container.querySelector("#champion-image").style.backgroundImage = `url(${highResImageUrl})`;
    container.querySelector("#champion-title").textContent = title;
    container.querySelector("#champion-name").textContent = name;
    container.querySelector("#champion-shortbio").textContent = shortBio;
    container.querySelector("#champion-roles").textContent = roles.join(" / ") || "N/A";
    container.querySelector("#champion-difficulty").textContent = tacticalInfo.difficulty ?? "N/A";

    // Update role icons
    const roleIconsContainer = container.querySelector("#role-icons");
    roleIconsContainer.innerHTML = roles.map(role => {
      let roleIconUrl;
      switch (role.toLowerCase()) {
        case 'mage':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/2/28/Mage_icon.png';
          break;
        case 'assassin':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/2/28/Slayer_icon.png';
          break;
        case 'fighter':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/8/8f/Fighter_icon.png';
          break;
        case 'tank':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/5/5a/Tank_icon.png';
          break;
        case 'marksman':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/7/7f/Marksman_icon.png';
          break;
        case 'support':
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Support_icon.png';
          break;
        default:
          roleIconUrl = 'https://static.wikia.nocookie.net/leagueoflegends/images/2/28/Mage_icon.png';
      }
      return `<img src="${roleIconUrl}" alt="${role}" class="role-icon">`;
    }).join('');
    
    // Fetch and display champion skins
    fetchChampionSkins(championKey);
  } catch (error) {
    console.error(`Error fetching champion details for ${championKey}:`, error);
    container.innerHTML = '<p>Failed to fetch champion details. Please try again later.</p>';
  }
}

async function fetchChampionSkins(championKey) {
  try {
    const response = await fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championKey}.json`);
    const data = await response.json();
    console.log("Fetched skins data:", data.skins); // Debug log
    const skins = data.skins.map(skin => {
      const imageUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${skin.id}.jpg`;
      console.log(`Skin ID: ${skin.id}, Image URL: ${imageUrl}`); // Debug log
      return {
        id: skin.id,
        name: skin.name,
        imageUrl: imageUrl
      };
    });
    console.log("Skins with image URLs:", skins); // Debug log
    displayChampionSkins(skins);
  } catch (error) {
    console.error("Error fetching champion skins:", error);
  }
}

function displayChampionSkins(skins) {
  const carouselTrack = document.getElementById("carousel-track");
  carouselTrack.innerHTML = ""; // Clear previous skins

  skins.forEach((skin) => {
    const skinDiv = document.createElement("div");
    skinDiv.classList.add("skin");

    const skinImg = document.createElement("img");
    skinImg.src = skin.imageUrl;
    skinImg.alt = skin.name;
    skinImg.style.width = "100%";
    skinImg.style.maxWidth = "9.375em"; // Adjusted max width to 150px equivalent
    console.log(`Appending image: ${skin.imageUrl}`); // Debug log
    skinDiv.appendChild(skinImg);

    const skinName = document.createElement("div");
    skinName.classList.add("skin-name");
    skinName.textContent = skin.name;
    skinDiv.appendChild(skinName);

    carouselTrack.appendChild(skinDiv);
  });

  // Add carousel functionality
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  let currentIndex = 0;
  let isAnimating = false;

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function updateCarousel() {
    if (isAnimating) return;
    isAnimating = true;
    const trackWidth = carouselTrack.offsetWidth;
    const itemWidth = carouselTrack.children[0].offsetWidth;
    const totalWidth = itemWidth * skins.length;
    const offset = (trackWidth - itemWidth) / 2 - currentIndex * itemWidth;
    requestAnimationFrame(() => {
      carouselTrack.style.transform = `translateX(${offset}px)`;
      isAnimating = false;
    });
  }

  prevButton.addEventListener("click", debounce(() => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = skins.length - 1; // Wrap around to the last item
    }
    updateCarousel();
  }, 300));

  nextButton.addEventListener("click", debounce(() => {
    if (currentIndex < skins.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Wrap around to the first item
    }
    updateCarousel();
  }, 300));

  updateCarousel();
}
