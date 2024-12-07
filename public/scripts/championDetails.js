
import { getChampionDetails } from './fetchChampionDetails.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const championKey = urlParams.get('champion');

  if (!championKey) {
    document.getElementById('champion-details').innerHTML = '<p>Champion not found.</p>';
    return;
  }

  const details = await getChampionDetails(championKey);

  if (!details) {
    document.getElementById('champion-details').innerHTML = '<p>Failed to load champion details.</p>';
    return;
  }

  const { name, title, shortBio, tacticalInfo = {}, playstyleInfo = {}, roles = [] } = details;
  const highResImageUrl = `https://cdn.communitydragon.org/latest/champion/${championKey}/splash-art`;

  document.getElementById('champion-details').innerHTML = `
    <div class="modal-content">
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
    </div>
  `;
});