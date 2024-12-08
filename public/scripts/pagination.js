export function setupPagination(totalPages, currentPage, onPageChange) {
    const paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = ""; // Clear existing controls
  
    const createButton = (page) => {
      if (typeof onPageChange !== "function") {
        console.error("onPageChange parameter is not defined or not a function.");
        return null;
      }
  
      const button = document.createElement("button");
      button.textContent = page;
      button.classList.add("pagination-button");
      if (page === currentPage) button.classList.add("active");
  
      button.addEventListener("click", () => {
        try {
          onPageChange(page);
        } catch (error) {
          console.error("Error executing onPageChange callback:", error);
        }
      });
      return button;
    };
  
    // Add a "Previous" button if not on the first page
    if (currentPage > 1) {
      const prevButton = createButton(currentPage - 1);
      if (prevButton) {
        prevButton.textContent = "Previous";
        paginationControls.appendChild(prevButton);
      }
    }
  
    // Add page number buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = createButton(i);
      if (pageButton) paginationControls.appendChild(pageButton);
    }
  
    // Add a "Next" button if not on the last page
    if (currentPage < totalPages) {
      const nextButton = createButton(currentPage + 1);
      if (nextButton) {
        nextButton.textContent = "Next";
        paginationControls.appendChild(nextButton);
      }
    }
  }
  
  export function calculatePaginationData(totalItems, itemsPerPage, currentPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems); // Ensure it doesn’t exceed total items
    return { startIndex, endIndex };
  }
  
  function setupPaginationControls() {
    if (typeof totalPages === "undefined" || typeof currentPage === "undefined") {
      console.error("totalPages or currentPage is not defined.");
      return;
    }
  
    setupPagination(totalPages, currentPage, (page) => {
      currentPage = page;
      displayCurrentPage();
    });
  }
  
  async function displayCurrentPage() {
    if (!validChampions || !maxChampionsPerPage) {
      console.error("validChampions or maxChampionsPerPage is not defined.");
      return;
    }
  
    const championGrid = document.getElementById("champion-grid");
    const { startIndex, endIndex } = calculatePaginationData(validChampions.length, maxChampionsPerPage, currentPage);
    const championsToDisplay = validChampions.slice(startIndex, endIndex);
  
    try {
      championGrid.innerHTML = await displayChampions(championsToDisplay);
    } catch (error) {
      console.error("Error displaying champions:", error);
      championGrid.innerHTML = `<p>Failed to display champions. Please try again later.</p>`;
    }
  }
  