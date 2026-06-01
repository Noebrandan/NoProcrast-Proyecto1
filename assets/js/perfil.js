import {
  getName,
  setName,
  getEssence,
  getMissions,
  getCollection,
  resetAll,
} from './storage.js';

import { calculateRank, RANGOS } from './misiones.js';

const profileName    = document.getElementById('profile-name');
const profileBadge   = document.getElementById('profile-badge');
const profileAvatar  = document.getElementById('profile-avatar');

const progressFill    = document.getElementById('progress-fill');
const progressLabel   = document.getElementById('progress-label');
const progressNumbers = document.getElementById('progress-numbers');
const progressBar     = document.querySelector('.progress-bar');

const statEsencia   = document.getElementById('stat-esencia');
const statSelladas  = document.getElementById('stat-selladas');
const statPendientes = document.getElementById('stat-pendientes');
const statTotal     = document.getElementById('stat-total');

const logrosGrid    = document.getElementById('logros-grid');
const coleccionGrid = document.getElementById('coleccion-grid');
const coleccionSubtitulo = document.getElementById('coleccion-subtitulo');

const editBtn   = document.getElementById('edit-btn');
const editCard  = document.getElementById('edit-card');
const editInput = document.getElementById('edit-input');
const saveBtn   = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const resetBtn  = document.getElementById('reset-btn');


const LOGROS = [
  {
    id: 'primera-mision',
    icono: '🎯',
    nombre: 'Primera misión',
    descripcion: 'Sellaste tu primera misión',
    check: ({ selladas }) => selladas >= 1,
  },
  {
    id: 'tres-misiones',
    icono: '🔥',
    nombre: 'Llama encendida',
    descripcion: 'Sellaste 3 misiones',
    check: ({ selladas }) => selladas >= 3,
  },
  {
    id: 'diez-misiones',
    icono: '💀',
    nombre: 'Iniciado de la cueva',
    descripcion: 'Sellaste 10 misiones',
    check: ({ selladas }) => selladas >= 10,
  },
  {
    id: 'iniciado',
    icono: '👁️',
    nombre: 'Iniciado',
    descripcion: 'Alcanzaste el rango Iniciado',
    check: ({ esencia }) => esencia >= 125,
  },
  {
    id: 'guardian',
    icono: '🔥',
    nombre: 'Guardián',
    descripcion: 'Alcanzaste el rango Guardián',
    check: ({ esencia }) => esencia >= 360,
  },
  {
    id: 'brujo',
    icono: '🌙',
    nombre: 'Brujo',
    descripcion: 'Alcanzaste el rango Brujo',
    check: ({ esencia }) => esencia >= 715,
  },
  {
    id: 'primera-carta',
    icono: '🃏',
    nombre: 'La primera figura',
    descripcion: 'Obtuviste tu primera carta',
    check: ({ cartas }) => cartas >= 1,
  },
  {
    id: 'leyenda',
    icono: '⚔️',
    nombre: 'Leyenda',
    descripcion: 'Alcanzaste el rango Leyenda',
    check: ({ esencia }) => esencia >= 1205,
  },
];

function loadProfile() {
  const name     = getName();
  const essence  = getEssence();
  const missions = getMissions();
  const collection = getCollection();
  const rank     = calculateRank(essence);

  const sealed   = missions.filter((m) => m.estado === 'sellada').length;
  const pending  = missions.length - sealed;

  profileName.textContent = name || 'Desconocido';
  if (editInput) editInput.value = name || '';

  profileBadge.textContent  = `${rank.icono} ${rank.nombre}`;
  profileAvatar.textContent = rank.icono;
  statEsencia.textContent   = essence;
  statSelladas.textContent  = sealed;
  statPendientes.textContent = pending;
  statTotal.textContent     = missions.length;
  updateProgressBar(essence, rank);
  renderLogros({ esencia: essence, selladas: sealed, cartas: collection.length });
  renderColeccion(collection);
}

function updateProgressBar(essence, rank) {
  const rankIndex  = RANGOS.findIndex((r) => r.nombre === rank.nombre);
  const isMaxRank  = rankIndex === RANGOS.length - 1;

  if (isMaxRank) {
    progressLabel.textContent   = `Rango máximo alcanzado`;
    progressNumbers.textContent = `${essence} esencia acumulada`;
    progressFill.style.width    = '100%';
    progressBar.setAttribute('aria-valuenow', 100);
    return;
  }

  const currentMin = rank.esenciaMin;
  const nextRank   = RANGOS[rankIndex + 1];
  const nextMin    = nextRank.esenciaMin;
  const progress   = essence - currentMin;
  const needed     = nextMin - currentMin;
  const pct        = Math.min(Math.round((progress / needed) * 100), 100);

  progressLabel.textContent   = `Progreso hacia ${nextRank.icono} ${nextRank.nombre}`;
  progressNumbers.textContent = `${essence} / ${nextMin} esencia`;
  progressBar.setAttribute('aria-valuenow', pct);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressFill.style.width = `${pct}%`;
    });
  });
}

function renderLogros({ esencia, selladas, cartas }) {
  logrosGrid.innerHTML = '';

  LOGROS.forEach((logro) => {
    const unlocked = logro.check({ esencia, selladas, cartas });

    const el = document.createElement('div');
    el.className = `achievement ${unlocked ? 'unlocked' : 'locked'}`;
    el.setAttribute('title', logro.descripcion);

    el.innerHTML = `
      <div class="icon" aria-hidden="true">${logro.icono}</div>
      <span>${logro.nombre}</span>
      ${unlocked ? '' : '<div class="achievement-lock" aria-hidden="true">🔒</div>'}
    `;

    logrosGrid.appendChild(el);
  });
}

function renderColeccion(collection) {
  coleccionGrid.innerHTML = '';

  if (collection.length === 0) {
    coleccionSubtitulo.textContent = 'Completá misiones para que la cueva te revele sus figuras.';

    const empty = document.createElement('p');
    empty.className = 'collection-empty';
    empty.textContent = 'Ninguna figura ha sido revelada aún.';
    coleccionGrid.appendChild(empty);
    return;
  }

  const conteo = collection.reduce((acc, carta) => {
    const key = carta.archivo;
    if (!acc[key]) acc[key] = { ...carta, cantidad: 0 };
    acc[key].cantidad++;
    return acc;
  }, {});

  coleccionSubtitulo.textContent = `${Object.keys(conteo).length} figura${Object.keys(conteo).length !== 1 ? 's' : ''} revelada${Object.keys(conteo).length !== 1 ? 's' : ''} — ${collection.length} total obtenida${collection.length !== 1 ? 's' : ''}.`;

  Object.values(conteo).forEach((carta) => {
    const card = document.createElement('div');
    card.className = 'collection-card';

    card.innerHTML = `
      <div class="collection-card-img-wrap">
        <img
          src="../assets/img/${carta.archivo}"
          alt="${carta.nombre}"
          class="collection-card-img"
          loading="lazy"
          onerror="this.parentElement.innerHTML='<span class=\\'collection-card-fallback\\'>${carta.nombre[0]}</span>'"
        >
        ${carta.cantidad > 1 ? `<span class="collection-card-cantidad" aria-label="${carta.cantidad} copias">×${carta.cantidad}</span>` : ''}
      </div>
      <span class="collection-card-nombre">${carta.nombre}</span>
    `;

    coleccionGrid.appendChild(card);
  });
}

function showEdit() {
  editCard.style.display = 'block';
  editInput.focus();
}

function hideEdit() {
  editCard.style.display = 'none';
}

function saveNameHandler() {
  const name = editInput.value.trim();

  if (!name) {
    showProfileError('Ingresá un nombre válido.');
    editInput.focus();
    return;
  }

  if (name.length > 30) {
    showProfileError('El nombre no puede tener más de 30 caracteres.');
    editInput.focus();
    return;
  }

  setName(name);
  loadProfile();
  hideEdit();
}

function showProfileError(message) {
  const existing = editCard.querySelector('.profile-error');
  if (existing) existing.remove();

  const error = document.createElement('p');
  error.className = 'profile-error';
  error.textContent = message;
  error.setAttribute('role', 'alert');
  saveBtn.insertAdjacentElement('afterend', error);

  setTimeout(() => error.remove(), 3000);
}

function handleReset() {
  resetAll();
  window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  editBtn.addEventListener('click', showEdit);
  saveBtn.addEventListener('click', saveNameHandler);
  cancelBtn.addEventListener('click', hideEdit);
  resetBtn.addEventListener('click', handleReset);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveNameHandler();
    if (e.key === 'Escape') hideEdit();
  });
});