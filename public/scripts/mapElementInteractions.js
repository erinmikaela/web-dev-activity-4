document.addEventListener("DOMContentLoaded", () => {
	console.log("Wild Rift Fandom loaded!");

	const champions = [
		{ name: "Aatrox", img: "img-16.png" },
		{ name: "Ahri", img: "img-42.png" },
		{ name: "Akali", img: "img-68.png" },
		{ name: "Akshan", img: "img-10.png" },
		{ name: "Alistar", img: "img-30.png" },
		{ name: "Ambessa", img: "img-5.png" },
		{ name: "Amumu", img: "img-83.png" },
		{ name: "Annie", img: "img-23.png" },
		// ...add other champions here
	];

	const championLinksContainer = document.getElementById("champion-links");
	const championCardsContainer = document.getElementById("champion-cards");

	champions.forEach((champion) => {
		// Create champion link
		const linkDiv = document.createElement("div");
		linkDiv.classList.add("a");
		const linkText = document.createElement("div");
		linkText.classList.add("text-wrapper-5");
		linkText.textContent = champion.name;
		linkDiv.appendChild(linkText);
		championLinksContainer.appendChild(linkDiv);

		// Create champion card
		const cardDiv = document.createElement("div");
		cardDiv.classList.add(`a-${champion.name.toLowerCase()}-wf-home`);
		const overlapDiv = document.createElement("div");
		overlapDiv.classList.add("overlap-2");
		const imgDiv = document.createElement("div");
		imgDiv.classList.add("img-6");
		imgDiv.style.backgroundImage = `url(./img/${champion.img})`;
		const spanDiv = document.createElement("div");
		spanDiv.classList.add("span-6");
		const textDiv = document.createElement("div");
		textDiv.classList.add("text-wrapper-6", "champion-name"); // Add champion-name class
		textDiv.textContent = champion.name.toUpperCase();
		spanDiv.appendChild(textDiv);
		overlapDiv.appendChild(imgDiv);
		overlapDiv.appendChild(spanDiv);
		cardDiv.appendChild(overlapDiv);
		championCardsContainer.appendChild(cardDiv);

		// Add click event to show champion details
		cardDiv.addEventListener("click", () => {
			document.getElementById("home").classList.add("hidden");
			document.getElementById("champions").classList.add("hidden");
			document.getElementById("champion-details").classList.remove("hidden");
			loadChampionDetails(champion.name.toLowerCase());
		});
	});

	const championsLink = document.querySelector('a[href="#champions"]');
	championsLink.addEventListener("click", (event) => {
		event.preventDefault();
		document.getElementById("home").classList.add("hidden");
		document.getElementById("champions").classList.remove("hidden");
	});

	const championGrid = document.getElementById("champion-grid");

	if (championGrid) {
		// Assuming you have some logic here to fetch and display champions
		// For example:
		fetchChampions()
			.then((champions) => {
				champions.forEach((champion) => {
					const championCard = document.createElement("div");
					championCard.className = "champion-card";
					championCard.innerHTML = `
          <img src="${champion.image}" alt="${champion.name}">
          <p>${champion.name}</p>
        `;
					championGrid.appendChild(championCard);
				});
			})
			.catch((error) => {
				console.error("Error fetching champions:", error);
			});
	} else {
		console.error("Element with ID 'champion-grid' not found.");
	}
});

document.addEventListener("scroll", () => {
	const header = document.querySelector("header");
	if (window.scrollY > 0) {
		header.classList.add("scrolled");
	} else {
		header.classList.remove("scrolled");
	}
});

function loadChampionDetails(championKey) {
	// Fetch and display champion details
	// This function should be implemented to fetch the details and update the #champion-details section
}

document.getElementById("enemy-nexus").addEventListener("click", () => {
	document.getElementById("media-title").textContent = "ENEMY NEXUS";
	document.getElementById("media-description").textContent =
		"Located in the enemy team's base, the enemy Nexus is just like yours. Destroying the enemy Nexus wins your team the game.";
	document.getElementById("nexus-visual").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/5bf342fa15ae8a7cc0eda852fdb0361c5d7dcbbf-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("your-nexus").addEventListener("click", () => {
	document.getElementById("media-title").textContent = "YOUR NEXUS";
	document.getElementById("media-description").textContent =
		"Your Nexus is where minions spawn. Behind your Nexus is the Fountain, where you can quickly replenish health and mana and access the Shop.";
	document.getElementById("nexus-visual").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/d79ab89872173d65758e134c07ef0645f7a0e504-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("inhibitors").addEventListener("click", () => {
	document.getElementById("media-title-clear-path").textContent = "INHIBITORS";
	document.getElementById("media-description-clear-path").textContent =
		"Inhibitors are structures that prevent the enemy team from spawning super minions. Destroying an inhibitor allows your team to spawn super minions in that lane.";
	document.getElementById("nexus-visual-clear-path").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/2c56d550aca55bcf28aeac0f2d9ecf35d7ff2c4f-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("turrets").addEventListener("click", () => {
	document.getElementById("media-title-clear-path").textContent = "TURRETS";
	document.getElementById("media-description-clear-path").textContent =
		"Turrets deal damage to enemy minions and champions, and provide limited vision from the Fog of War for their team. Attack these structures with minions ahead of you to avoid damage and charge ahead.";
	document.getElementById("nexus-visual-clear-path").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/351bb454c18a5f55dc1d47ba5674e246bfaa171b-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("baron-nashor").addEventListener("click", () => {
	document.getElementById("media-title-take-on-jungle").textContent = "BARON NASHOR";
	document.getElementById("media-description-take-on-jungle").textContent =
		"Baron Nashor is the most powerful monster in the jungle. Killing Baron grants the slayer's team bonus attack damage, ability power, empowered recall, and greatly increases the power of nearby minions.";
	document.getElementById("nexus-visual-take-on-jungle").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/ed4bef5c2369044d76cf535e038b6c1f8d323f13-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("drakes").addEventListener("click", () => {
	document.getElementById("media-title-take-on-jungle").textContent = "DRAKES";
	document.getElementById("media-description-take-on-jungle").textContent =
		"Drakes, or dragons, are powerful monsters that grant unique bonuses depending on the element of the drake your team slays. There are five Elemental Drakes and one Elder Dragon.";
	document.getElementById("nexus-visual-take-on-jungle").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/1faaf44ebe07ec29900a21db0810b130f4777342-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("top-lane").addEventListener("click", () => {
	document.getElementById("media-title-choose-your-lane").textContent = "TOP LANE";
	document.getElementById("media-description-choose-your-lane").textContent =
		"Champions in top lane are the tough solo fighters of the team. It's their job to protect their lane and focus on the enemy team's most powerful members.";
	document.getElementById("nexus-visual-choose-your-lane").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/fc8d0c8c803a8e91a1912df9054b3be90211a2d9-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("jungle").addEventListener("click", () => {
	document.getElementById("media-title-choose-your-lane").textContent = "JUNGLE";
	document.getElementById("media-description-choose-your-lane").textContent =
		"Junglers live for the hunt. Stalking between lanes with stealth and skill, they keep a close eye on the most important neutral monsters and pounce the moment an opponent lets their guard down.";
	document.getElementById("nexus-visual-choose-your-lane").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/eb84be329ef915096e908527267852ff26845bba-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("mid-lane").addEventListener("click", () => {
	document.getElementById("media-title-choose-your-lane").textContent = "MID LANE";
	document.getElementById("media-description-choose-your-lane").textContent =
		"Mid laners are your high burst damage champions who can do it all—solo and as a team. For them, combat is a dangerous dance where they're always looking for an opportunity to outplay their opponent.";
	document.getElementById("nexus-visual-choose-your-lane").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/245d81d16cb5fef638753ce7d83e137a4d2aaca7-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("bot-lane").addEventListener("click", () => {
	document.getElementById("media-title-choose-your-lane").textContent = "BOT LANE";
	document.getElementById("media-description-choose-your-lane").textContent =
		"Bot lane champions are the dynamite of the team. As precious cargo, they need to be protected early on before amassing enough gold and experience to carry the team to victory.";
	document.getElementById("nexus-visual-choose-your-lane").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/87489b0e450b3fa59e176a3189c61c8eb9092c78-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});

document.getElementById("support").addEventListener("click", () => {
	document.getElementById("media-title-choose-your-lane").textContent = "SUPPORT";
	document.getElementById("media-description-choose-your-lane").textContent =
		"Support champions are team guardians. They help keep teammates alive and primarily focus on setting up kills, protecting their teammate in bot lane until they become stronger.";
	document.getElementById("nexus-visual-choose-your-lane").src =
		"https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/ee41cd027bf8af85bebc07c8480b1304b793fc1e-3288x2100.png?auto=format&fit=fill&q=80&w=851";
});