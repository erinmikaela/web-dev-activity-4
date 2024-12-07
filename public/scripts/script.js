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
    textDiv.classList.add("text-wrapper-6");
    textDiv.textContent = champion.name.toUpperCase();
    spanDiv.appendChild(textDiv);
    overlapDiv.appendChild(imgDiv);
    overlapDiv.appendChild(spanDiv);
    cardDiv.appendChild(overlapDiv);
    championCardsContainer.appendChild(cardDiv);
  });
});

document.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 0) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
