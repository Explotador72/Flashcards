let flashcardsData = [];
let originalData = []; // Guardamos todas las flashcards
let currentIndex = 0;

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
// CARGA DESDE GOOGLE SHEETS (CSV)


// ======================
// CARGA DESDE JSON LOCAL
fetch('data.json')
  .then(res => res.json())
  .then(data => initFlashcards(data))
  .catch(err => console.error("Error al cargar JSON:", err));

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
  if (!flashcardsData.length) return;
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
  const categories = ["Todas", ...new Set(originalData.map(card => card.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat === "Todas" ? "all" : cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
  categorySelect.addEventListener("change", filterByCategory);
}

// ======================
// FILTRAR POR CATEGORÍA
function filterByCategory() {
  const cat = categorySelect.value;
  if (cat === "all") {
    flashcardsData = [...originalData];
  } else {
    flashcardsData = originalData.filter(c => c.category === cat);
  }
  currentIndex = 0;
  showFlashcard();
}
