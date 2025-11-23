const flashcardEl = document.getElementById('flashcard');
const frontEl = flashcardEl.querySelector('.front');
const backEl = flashcardEl.querySelector('.back');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function showFlashcard() {
  frontEl.textContent = flashcardsData[currentIndex].question;
  backEl.textContent = flashcardsData[currentIndex].answer;
  flashcardEl.classList.remove('flipped');
}

// Voltear tarjeta al hacer click
flashcardEl.addEventListener('click', (event) => {
  if (event.ctrlKey) {
    // Ctrl + click → siguiente tarjeta
    nextFlashcard();
  } else {
    // Solo click → voltear
    flashcardEl.classList.toggle('flipped');
  }
});

// Función para pasar a la siguiente tarjeta
function nextFlashcard() {
  currentIndex = (currentIndex + 1) % flashcardsData.length;
  showFlashcard();
}

// Botón “Siguiente”
nextBtn.addEventListener('click', nextFlashcard);

// Mostrar la primera tarjeta
showFlashcard();
