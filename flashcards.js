const flashcardEl = document.getElementById('flashcard');
const frontEl = flashcardEl.querySelector('.front');
const backEl = flashcardEl.querySelector('.back');
const nextBtn = document.getElementById('nextBtn');

const flashcards = [
  { question: "¿Cuál es la capital de Francia?", answer: "París" },
  { question: "¿Cuál es el símbolo del agua?", answer: "H₂O" },
  { question: "¿Quién escribió 'Cien años de soledad'?", answer: "Gabriel García Márquez" },
];

let currentIndex = 0;

// Función para mostrar la tarjeta actual
function showFlashcard() {
  frontEl.textContent = flashcards[currentIndex].question;
  backEl.textContent = flashcards[currentIndex].answer;
  flashcardEl.classList.remove('flipped');
}

// Al hacer clic, se da la vuelta
flashcardEl.addEventListener('click', () => {
  flashcardEl.classList.toggle('flipped');
});

// Siguiente tarjeta
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showFlashcard();
});

// Mostrar primera tarjeta
showFlashcard();
