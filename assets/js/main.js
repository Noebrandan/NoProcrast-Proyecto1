import { getName, setName, getEssence, getMissions } from './storage.js';
import { calculateRank } from './misiones.js';

// Elementos del Dom

const welcomeScreen = document.getElementById('welcome-screen');
const nameInput     = document.getElementById('name-input');
const enterBtn      = document.getElementById('enter-btn');

const statEssence   = document.getElementById('total-essence');
const statSealed    = document.getElementById('sealed-missions');
const statRank      = document.getElementById('current-rank');


// Función para la bienvenida, una especie de "inicio de sesión" solo con el nobre

function initWelcome() {
  const savedName = getName();

  if (savedName) {
    welcomeScreen.style.display = 'none';
  } else {
    welcomeScreen.style.display = 'flex';
    enterBtn.addEventListener('click', saveName);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveName();
    });
  }
}



// Acá se valida el nombre, se guarda en localStorage y se oculta la pantalla de bienvenida


function saveName() {
  const name = nameInput.value.trim();

  if (!name) {
    showWelcomeError('Ingresá tu nombre para continuar.');
    return;
  }

  if (name.length > 30) {
    showWelcomeError('El nombre no puede tener más de 30 caracteres.');
    return;
  }

  setName(name);
  hideWelcome();
}



//Efectitoooo de salida para la biuenvenida 

function hideWelcome() {
  welcomeScreen.classList.add('fade-out');
  welcomeScreen.addEventListener('animationend', () => {
    welcomeScreen.style.display = 'none';
    welcomeScreen.classList.remove('fade-out');
  }, { once: true });
}

// Mensajito de error x si hay duplicado

function showWelcomeError(message) {
  const existing = welcomeScreen.querySelector('.welcome-error');
  if (existing) existing.remove();

  const error = document.createElement('p');
  error.className = 'welcome-error';
  error.textContent = message;
  error.setAttribute('role', 'alert');

  enterBtn.insertAdjacentElement('afterend', error);

  setTimeout(() => error.remove(), 3000);
}

// Funciones para estadísticas


function updateStats() {
  const essence  = getEssence();
  const missions = getMissions();
  const sealed   = missions.filter((m) => m.estado === 'sellada').length;
  const rank     = calculateRank(essence);
    // Animación de conteo para los números
  animateCounter(statEssence, essence);
  animateCounter(statSealed,  sealed);

  statRank.textContent = rank.nombre;
}

//Anima un elemento de texto contando desde 0 hasta el valor objetivo. 
// Si el valor es 0, lo escribe directamente sin animación. 
// @param {HTMLElement} element - El elemento a animar.
// @param {number} target - El número final.

function animateCounter(element, target) {
  if (target === 0) {
    element.textContent = '0';
    return;
  }

  const duration = 800; 
  const steps    = 30;
  const interval = duration / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    const progress    = step / steps;
    const currentValue = Math.round(target * (1 - Math.pow(1 - progress, 2)));
    element.textContent = currentValue;

    if (step >= steps) {
      clearInterval(timer);
      element.textContent = target; 
    }
  }, interval);
}

// Inicialización

document.addEventListener('DOMContentLoaded', () => {
  initWelcome();
  updateStats();
});