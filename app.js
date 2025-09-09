// ================================
// Shiny Tracker App (app.js)
// ================================

// Data model: shinies stored per game
let shinyData = {
  Gold: [],
  Silver: [],
  Crystal: [],
  Ruby: [],
  Sapphire: [],
  Emerald: [],
  FireRed: [],
  LeafGreen: [],
  Diamond: [],
  Pearl: [],
  Platinum: [],
  HeartGold: [],
  SoulSilver: [],
  Black: [],
  "Black 2": [],
  White: [],
  "White 2": [],
  X: [],
  Y: [],
  "Omega Ruby": [],
  "Alpha Sapphire": [],
  Sun: [],
  Moon: [],
  "Ultra Sun": [],
  "Ultra Moon": [],
  Sword: [],
  Shield: [],
  "Brilliant Diamond": [],
  "Shining Pearl": [],
  "Legends: Arceus": [],
  Scarlet: [],
  Violet: [],
};

// Track current count
let currentCount = 0;

// ================================
// Event Listeners
// ================================

let debounceTimer;
window.onload = () => {
  loadData();
  loadActiveHunt();

  document
    .getElementById("increment")
    .addEventListener("click", () => updateCount(1));
  document
    .getElementById("decrement")
    .addEventListener("click", () => updateCount(-1));

  document
    .getElementById("resetCount")
    .addEventListener("click", () => resetCount());

  document.getElementById("foundShiny").addEventListener("click", saveShiny);

  document
    .getElementById("gameSelect")
    .addEventListener("change", renderShinyList);

  document.getElementById("pokemonName").addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePokemonSprite, 500);
    saveActiveHunt();
  });

  document.getElementById("nickname").addEventListener("input", saveActiveHunt);
};

// ================================
// Counter Logic
// ================================
function updateCount(amount) {
  currentCount += amount;
  if (currentCount < 0) currentCount = 0;
  document.getElementById("counter").textContent = currentCount;
  saveActiveHunt();
}

function resetCount() {
  currentCount = 0;
  document.getElementById("counter").textContent = currentCount;
  saveActiveHunt();
}

// ================================
// Save Shiny
// ================================
function saveShiny() {
  const game = document.getElementById("gameSelect").value;
  const name = document.getElementById("pokemonName").value.trim();
  const nickname = document.getElementById("nickname").value.trim();

  if (!name) {
    alert("Please enter a Pokémon name!");
    return;
  }

  shinyData[game].push({
    name,
    nickname: nickname || null,
    count: currentCount,
  });

  saveData();
  renderShinyList();

  // Reset for next hunt
  resetCount();
  document.getElementById("pokemonName").value = "";
  document.getElementById("nickname").value = "";
  updatePokemonSprite();

  saveActiveHunt();
}

// ================================
// Render Shinies
// ================================
function renderShinyList() {
  const game = document.getElementById("gameSelect").value;
  const list = document.getElementById("shinyList");
  list.innerHTML = "";

  if (!shinyData[game]) shinyData[game] = [];

  shinyData[game].forEach((shiny, index) => {
    const item = document.createElement("li");
    item.textContent = `${shiny.name} ${shiny.nickname ? "(" + shiny.nickname + ")" : ""} — ${shiny.count} resets`;

    // Optional delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      shinyData[game].splice(index, 1);
      saveData();
      renderShinyList();
    };

    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

// ================================
// Render Shiny Pokémon Image
// ================================
async function updatePokemonSprite() {
  const currentPokemonElement = document.getElementById("pokemonName");
  const pokemonImgElement = document.getElementById("pokemon-img");

  const name = currentPokemonElement.value.toLowerCase().trim();
  if (!name) {
    pokemonImgElement.src = "";
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokémon not found");

    const data = await response.json();
    const shinySprite =
      // data.sprites.other?.["official-artwork"]?.front_shiny ||
      data.sprites.front_shiny || data.sprites.front_default;

    pokemonImgElement.src = shinySprite || "";
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    pokemonImgElement.src = "";
  }
}

// ================================
// Local Storage
// ================================
function saveData() {
  localStorage.setItem("shinyTracker", JSON.stringify(shinyData));
}

function saveActiveHunt() {
  const game = document.getElementById("gameSelect").value;
  const name = document.getElementById("pokemonName").value.trim();
  const nickname = document.getElementById("nickname").value.trim();

  const activeHunt = {
    game,
    name,
    nickname,
    count: currentCount,
  };

  localStorage.setItem("activeHunt", JSON.stringify(activeHunt));
}

function loadData() {
  const data = localStorage.getItem("shinyTracker");
  if (data) {
    shinyData = JSON.parse(data);
  } else {
    // if nothing is saved yet, keep defaults
    shinyData = {
      Gold: [],
      Silver: [],
      Crystal: [],
      Ruby: [],
      Sapphire: [],
      Emerald: [],
      FireRed: [],
      LeafGreen: [],
      Diamond: [],
      Pearl: [],
      Platinum: [],
      HeartGold: [],
      SoulSilver: [],
      Black: [],
      "Black 2": [],
      White: [],
      "White 2": [],
      X: [],
      Y: [],
      "Omega Ruby": [],
      "Alpha Sapphire": [],
      Sun: [],
      Moon: [],
      "Ultra Sun": [],
      "Ultra Moon": [],
      Sword: [],
      Shield: [],
      "Brilliant Diamond": [],
      "Shining Pearl": [],
      "Legends: Arceus": [],
      Scarlet: [],
      Violet: [],
    };
  }
  renderShinyList();
}

function loadActiveHunt() {
  const data = localStorage.getItem("activeHunt");
  if (!data) return;

  const { game, name, nickname, count } = JSON.parse(data);

  // Restore dropdown, name, nickname, and count
  if (game && document.getElementById("gameSelect").value !== game) {
    document.getElementById("gameSelect").value = game;
    renderShinyList();
  }
  document.getElementById("pokemonName").value = name || "";
  document.getElementById("nickname").value = nickname || "";
  currentCount = count || 0;
  document.getElementById("counter").textContent = currentCount;

  // Update sprite if name is present
  if (name) updatePokemonSprite();
}
