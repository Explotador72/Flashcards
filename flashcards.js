let flashcardsData = [];
let originalData = []; // Guardamos todas las flashcards
let currentIndex = 0;
let selectedCategories = new Set(); // Para almacenar categorías seleccionadas

// ======================
// FUNCION PARA INICIALIZAR LA WEB
function initFlashcards(data) {
  // Filtramos filas vacías o mal formadas
  const cleanData = data.filter(card => card.question && card.answer);
  flashcardsData = cleanData;
  originalData = cleanData;
  initCategories();
  showFlashcard();
}

// ======================
// PARSEADOR CSV robusto: soporta comillas, comas internas y celdas vacías
function parseCSV(csvText) {
  // Quitar BOM si existe
  if (csvText.charCodeAt(0) === 0xFEFF) csvText = csvText.slice(1);

  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (!lines.length) return [];

  // Parse headers usando la misma función de línea
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

// parsea una línea CSV respetando comillas dobles y comas internas
function parseCSVLine(line) {
  const result = [];
  let cur = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"' ) {
      // si es una comilla y la siguiente también es comilla -> escapada -> añadimos una comilla
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
    console.warn("Google Sheets no disponible. Usando JSON local…");

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

// ======================
// MOSTRAR TARJETA ACTUAL
function showFlashcard() {
  if (!flashcardsData.length) {
    frontEl.textContent = "No hay tarjetas en las categorías seleccionadas";
    backEl.textContent = "";
    return;
  }
  const card = flashcardsData[currentIndex];
  frontEl.textContent = card.question;
  backEl.textContent = card.answer;
  flashcardEl.classList.remove('flipped');
}

// ======================
// VOLTEAR TARJETA
flashcardEl.addEventListener('click', () => flashcardEl.classList.toggle('flipped'));

// ======================
// SIGUIENTE TARJETA
nextBtn.addEventListener('click', nextFlashcard);
function nextFlashcard() {
  if (!flashcardsData.length) return;
  currentIndex = (currentIndex + 1) % flashcardsData.length;
  showFlashcard();
}

// ======================
// CATEGORÍAS AUTOMÁTICAS
function initCategories() {
  // filtrar categorías válidas (no undefined ni vacías)
  const cats = originalData.map(card => card.category).filter(Boolean);
  const categories = ["Todas", ...new Set(cats)];
  
  // limpiar select si ya tiene opciones
  categorySelect.innerHTML = "";
  
  // Hacer el select múltiple
  categorySelect.setAttribute('multiple', 'true');
  categorySelect.size = Math.min(6, categories.length); // Mostrar máximo 6 opciones a la vez
  
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
// MANEJAR SELECCIÓN MÚLTIPLE DE CATEGORÍAS
function handleCategorySelection() {
  const selectedOptions = Array.from(categorySelect.selectedOptions);
  const selectedValues = selectedOptions.map(opt => opt.value);
  
  // Manejar lógica de selección
  if (selectedValues.includes("all")) {
    // Si se selecciona "Todas", deseleccionar todo lo demás
    selectedCategories.clear();
    selectedCategories.add("all");
    Array.from(categorySelect.options).forEach(opt => {
      opt.selected = opt.value === "all";
    });
  } else {
    // Si se selecciona cualquier otra categoría, quitar "Todas"
    selectedCategories.delete("all");
    if (selectedValues.length === 0) {
      // Si no hay nada seleccionado, seleccionar "Todas" por defecto
      selectedCategories.add("all");
      categorySelect.querySelector('option[value="all"]').selected = true;
    } else {
      // Agregar las categorías seleccionadas
      selectedCategories.clear();
      selectedValues.forEach(val => selectedCategories.add(val));
    }
  }
  
  filterByCategories();
}

// ======================
// FILTRAR POR MÚLTIPLES CATEGORÍAS
function filterByCategories() {
  if (selectedCategories.has("all")) {
    flashcardsData = [...originalData];
  } else {
    flashcardsData = originalData.filter(c => 
      c.category && selectedCategories.has(c.category)
    );
  }
  currentIndex = 0;
  showFlashcard();
  
  // Actualizar texto del botón para mostrar cantidad
  updateNextButtonText();
}

// ======================
// ACTUALIZAR TEXTO DEL BOTÓN SIGUIENTE
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