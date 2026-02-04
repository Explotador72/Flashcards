let flashcardsData = [];
let originalData = []; // Guardamos todas las flashcards
let currentIndex = 0;
let selectedCategories = new Set(); // Para almacenar categorias seleccionadas
let recentIds = [];

const STORAGE_PROGRESS_KEY = "flashcards_progress_v1";
const STORAGE_SETTINGS_KEY = "flashcards_settings_v1";

let progress = loadProgress();
let settings = loadSettings();

// ======================
// FUNCION PARA INICIALIZAR LA WEB
function initFlashcards(data) {
  // Filtramos filas vacias o mal formadas
  const cleanData = data.filter(card => card.question && card.answer);
  cleanData.forEach(card => {
    card._id = createCardId(card);
    if (!progress[card._id]) {
      progress[card._id] = { correct: 0, wrong: 0, seen: 0 };
    }
  });

  flashcardsData = cleanData;
  originalData = cleanData;
  
  initCategories();
  shuffleFlashcards(); // Barajar al inicializar
  applySettingsToUI();
  updateNextButtonText();
  showFlashcard();
}

// ======================
// BARAJAR FLASHCARDS (algoritmo Fisher-Yates)
function shuffleFlashcards() {
  for (let i = flashcardsData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcardsData[i], flashcardsData[j]] = [flashcardsData[j], flashcardsData[i]];
  }
  currentIndex = 0; // Reiniciar indice despues de barajar
}

// ======================
// PARSEADOR CSV robusto: soporta comillas, comas internas y celdas vacias
function parseCSV(csvText) {
  // Quitar BOM si existe
  if (csvText.charCodeAt(0) === 0xFEFF) csvText = csvText.slice(1);

  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (!lines.length) return [];

  // Parse headers usando la misma funcion de linea
  const headers = parseCSVLine(lines[0]).map(h => h.trim());

  const rows = lines.slice(1).map(line => {
    const cols = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cols[i] || "").trim();
    });
    return obj;
  });

  return rows;
}

// parsea una linea CSV respetando comillas dobles y comas internas
function parseCSVLine(line) {
  const result = [];
  let cur = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"' ) {
      // si es una comilla y la siguiente tambien es comilla -> escapada -> anadimos una comilla
      if (insideQuotes && line[i+1] === '"') {
        cur += '"';
        i++; // saltar la comilla escapada
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (ch === ',' && !insideQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

// ======================
// CARGA DESDE GOOGLE SHEETS (CSV) con fallback a JSON local
fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSNGZwo-97c1vhJdxEzrS4-RBL5PJuoPu_KGw5gdaTYIO61YwgkB76YSeDmuOKFXr7o9y_41LLYMFAf/pub?gid=0&single=true&output=csv")
  .then(res => res.text())
  .then(csv => {
    const parsed = parseCSV(csv);
    initFlashcards(parsed);
  })
  .catch(() => {
    console.warn("Google Sheets no disponible. Usando JSON local...");

    fetch("data.json")
      .then(res => res.json())
      .then(data => initFlashcards(data))
      .catch(err => console.error("Error al cargar JSON de fallback:", err));
  });

// ======================
// ELEMENTOS DEL DOM
const flashcardEl = document.getElementById('flashcard');
const frontEl = flashcardEl.querySelector('.front');
const backEl = flashcardEl.querySelector('.back');
const nextBtn = document.getElementById('nextBtn');
const categorySelect = document.getElementById('categorySelect');
const modeSelect = document.getElementById('modeSelect');
const randomnessSelect = document.getElementById('randomnessSelect');
const avoidRepeatCheckbox = document.getElementById('avoidRepeat');
const markCorrectBtn = document.getElementById('markCorrect');
const markWrongBtn = document.getElementById('markWrong');
const resetProgressBtn = document.getElementById('resetProgress');
const statsText = document.getElementById('statsText');

// ======================
// MOSTRAR TARJETA ACTUAL
function showFlashcard() {
  if (!flashcardsData.length) {
    frontEl.textContent = "No hay tarjetas en las categorias seleccionadas";
    backEl.textContent = "";
    updateStatsUI();
    return;
  }
  const card = flashcardsData[currentIndex];
  frontEl.textContent = card.question;
  backEl.textContent = card.answer;
  flashcardEl.classList.remove('flipped');

  registerSeen(card);
  rememberRecent(card._id);
  updateStatsUI();
}

// ======================
// VOLTEAR TARJETA
flashcardEl.addEventListener('click', () => toggleFlip());
flashcardEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleFlip();
  }
});

function toggleFlip() {
  flashcardEl.classList.toggle('flipped');
}

// ======================
// SIGUIENTE TARJETA (ALEATORIA)
nextBtn.addEventListener('click', nextFlashcard);
function nextFlashcard() {
  if (!flashcardsData.length) return;
  currentIndex = pickNextIndex();
  showFlashcard();
}

// ======================
// CATEGORIAS AUTOMATICAS
function initCategories() {
  // filtrar categorias validas (no undefined ni vacias)
  const cats = originalData.map(card => card.category).filter(Boolean);
  const categories = ["Todas", ...new Set(cats)];
  
  // limpiar select si ya tiene opciones
  categorySelect.innerHTML = "";
  
  // Hacer el select multiple
  categorySelect.setAttribute('multiple', 'true');
  categorySelect.size = Math.min(6, categories.length); // Mostrar maximo 6 opciones a la vez
  
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat === "Todas" ? "all" : cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
  
  // Seleccionar "Todas" por defecto
  selectedCategories.add("all");
  categorySelect.querySelector('option[value="all"]').selected = true;
  
  categorySelect.addEventListener("change", handleCategorySelection);
}

// ======================
// MANEJAR SELECCION MULTIPLE DE CATEGORIAS
function handleCategorySelection() {
  const selectedOptions = Array.from(categorySelect.selectedOptions);
  const selectedValues = selectedOptions.map(opt => opt.value);
  
  // Manejar logica de seleccion
  if (selectedValues.includes("all")) {
    // Si se selecciona "Todas", deseleccionar todo lo demas
    selectedCategories.clear();
    selectedCategories.add("all");
    Array.from(categorySelect.options).forEach(opt => {
      opt.selected = opt.value === "all";
    });
  } else {
    // Si se selecciona cualquier otra categoria, quitar "Todas"
    selectedCategories.delete("all");
    if (selectedValues.length === 0) {
      // Si no hay nada seleccionado, seleccionar "Todas" por defecto
      selectedCategories.add("all");
      categorySelect.querySelector('option[value="all"]').selected = true;
    } else {
      // Agregar las categorias seleccionadas
      selectedCategories.clear();
      selectedValues.forEach(val => selectedCategories.add(val));
    }
  }
  
  filterByCategories();
}

// ======================
// FILTRAR POR MULTIPLES CATEGORIAS
function filterByCategories() {
  if (selectedCategories.has("all")) {
    flashcardsData = [...originalData];
  } else {
    flashcardsData = originalData.filter(c => 
      c.category && selectedCategories.has(c.category)
    );
  }
  shuffleFlashcards(); // Barajar al cambiar categorias
  showFlashcard();
  
  // Actualizar texto del boton para mostrar cantidad
  updateNextButtonText();
}

// ======================
// ACTUALIZAR TEXTO DEL BOTON SIGUIENTE
function updateNextButtonText() {
  const count = flashcardsData.length;
  if (count === 0) {
    nextBtn.textContent = "Siguiente (0)";
    nextBtn.disabled = true;
  } else {
    nextBtn.textContent = `Siguiente (${count})`;
    nextBtn.disabled = false;
  }
}

// ======================
// CONTROLES DE PROGRESO Y MODO
modeSelect.addEventListener('change', () => {
  settings.mode = modeSelect.value;
  saveSettings();
});

randomnessSelect.addEventListener('change', () => {
  settings.randomness = randomnessSelect.value;
  saveSettings();
});

avoidRepeatCheckbox.addEventListener('change', () => {
  settings.avoidRepeat = avoidRepeatCheckbox.checked;
  saveSettings();
});

markCorrectBtn.addEventListener('click', () => markAnswer(true));
markWrongBtn.addEventListener('click', () => markAnswer(false));

resetProgressBtn.addEventListener('click', () => {
  progress = {};
  originalData.forEach(card => {
    progress[card._id] = { correct: 0, wrong: 0, seen: 0 };
  });
  saveProgress();
  updateStatsUI();
});

function markAnswer(isCorrect) {
  if (!flashcardsData.length) return;
  const card = flashcardsData[currentIndex];
  const stats = progress[card._id];
  if (isCorrect) {
    stats.correct += 1;
  } else {
    stats.wrong += 1;
  }
  saveProgress();
  updateStatsUI();
  nextFlashcard();
}

// ======================
// LOGICA DE ALEATORIEDAD INTELIGENTE
function pickNextIndex() {
  if (flashcardsData.length <= 1) return 0;

  const recentWindow = getRecentWindow();
  let candidates = flashcardsData.map((card, index) => ({ card, index }));

  if (settings.avoidRepeat && recentWindow > 0) {
    candidates = candidates.filter(c => !recentIds.includes(c.card._id));
    if (!candidates.length) {
      candidates = flashcardsData.map((card, index) => ({ card, index }));
    }
  }

  if (settings.mode === 'random') {
    const randomPick = Math.floor(Math.random() * candidates.length);
    return candidates[randomPick].index;
  }

  const weights = candidates.map(c => calcWeight(c.card));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i].index;
  }
  return candidates[candidates.length - 1].index;
}

function calcWeight(card) {
  const stats = progress[card._id] || { correct: 0, wrong: 0, seen: 0 };
  const score = stats.wrong - stats.correct;

  let weight = 1 + Math.max(0, score) * 3 + stats.wrong * 1.2;
  if (stats.seen === 0) weight += 2;

  const jitter = getRandomnessJitter();
  weight = Math.max(0.2, weight * jitter);
  return weight;
}

function getRandomnessJitter() {
  if (settings.randomness === 'soft') {
    return 1 + (Math.random() * 0.3 - 0.15);
  }
  if (settings.randomness === 'chaos') {
    return 1 + (Math.random() * 1.2 - 0.6);
  }
  return 1 + (Math.random() * 0.6 - 0.3);
}

function getRecentWindow() {
  if (!settings.avoidRepeat) return 0;
  if (settings.randomness === 'soft') return 2;
  if (settings.randomness === 'chaos') return 5;
  return 3;
}

function rememberRecent(id) {
  const limit = getRecentWindow();
  if (limit <= 0) return;
  recentIds = recentIds.filter(x => x !== id);
  recentIds.push(id);
  if (recentIds.length > limit) {
    recentIds = recentIds.slice(recentIds.length - limit);
  }
}

// ======================
// ESTADISTICAS
function updateStatsUI() {
  if (!flashcardsData.length) {
    statsText.textContent = "Sin tarjetas para mostrar";
    return;
  }

  const card = flashcardsData[currentIndex];
  const stats = progress[card._id] || { correct: 0, wrong: 0, seen: 0 };
  const score = stats.wrong - stats.correct;

  const totals = flashcardsData.reduce((acc, c) => {
    const s = progress[c._id] || { correct: 0, wrong: 0, seen: 0 };
    acc.correct += s.correct;
    acc.wrong += s.wrong;
    acc.seen += s.seen;
    return acc;
  }, { correct: 0, wrong: 0, seen: 0 });

  statsText.textContent = `Tarjetas: ${flashcardsData.length} | Vistas: ${totals.seen} | Aciertos: ${totals.correct} | Fallos: ${totals.wrong} | Actual score: ${score}`;
}

function registerSeen(card) {
  const stats = progress[card._id];
  stats.seen += 1;
  saveProgress();
}

// ======================
// STORAGE
function createCardId(card) {
  const raw = `${card.question}||${card.answer}||${card.category || ''}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `card_${Math.abs(hash)}`;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
}

function loadSettings() {
  const defaults = { mode: 'smart', randomness: 'normal', avoidRepeat: true };
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === 'random' ? 'random' : 'smart',
      randomness: ['soft', 'normal', 'chaos'].includes(parsed.randomness) ? parsed.randomness : 'normal',
      avoidRepeat: typeof parsed.avoidRepeat === 'boolean' ? parsed.avoidRepeat : true
    };
  } catch (e) {
    return defaults;
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
}

function applySettingsToUI() {
  modeSelect.value = settings.mode;
  randomnessSelect.value = settings.randomness;
  avoidRepeatCheckbox.checked = settings.avoidRepeat;
}
