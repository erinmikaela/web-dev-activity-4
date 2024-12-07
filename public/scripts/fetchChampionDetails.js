const patch = "latest";

/**
 * Fetch detailed data for a single champion by their key
 * @param {string} championKey - The champion key (e.g., "ahri")
 * @returns {Promise<object>} - Detailed data for the champion
 */
export async function getChampionDetails(championKey) {
  const apiUrl = `https://cdn.communitydragon.org/${patch}/champion/${championKey}/data`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch data for champion: ${championKey}`);
    const championData = await response.json();
    return championData;
  } catch (error) {
    console.error(`Error fetching details for champion ${championKey}:`, error);
    return null;
  }
}
