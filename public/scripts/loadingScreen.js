
function showLoadingScreen() {
	document.getElementById("loading-screen").style.display = "flex";
}

function hideLoadingScreen() {
	document.getElementById("loading-screen").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
	hideLoadingScreen();
});