import {
  getMissions,
  setMissions,
  addEssence,
  getEssence,
  addCard,
  getCollection,
} from './storage.js';

export const RANGOS = [
  { nombre: 'Aprendiz', icono: '🌱', esenciaMin: 0    },
  { nombre: 'Iniciado', icono: '👁️',  esenciaMin: 125  },
  { nombre: 'Guardián', icono: '🔥', esenciaMin: 360  },
  { nombre: 'Brujo',    icono: '🌙', esenciaMin: 715  },
  { nombre: 'Leyenda',  icono: '⚔️',  esenciaMin: 1205 },
];

const CARTAS = [
  { nombre: 'Cóndor Andino',               archivo: 'Andino.png'           },
  { nombre: 'Carpincho',                   archivo: 'Carpincho.png'         },
  { nombre: 'Guanaco',                     archivo: 'Guanaco.png'           },
  { nombre: 'Aguará Guazú',               archivo: 'Guara.png'             },
  { nombre: 'Hornero',                     archivo: 'Hornero.png'           },
  { nombre: 'Mariposa Bandera Argentina',  archivo: 'Mariposa.png'          },
  { nombre: 'Picaflor',                    archivo: 'Picaflor.png'          },
  { nombre: 'Araña Pollito',               archivo: 'Pollito.png'           },
  { nombre: 'Yacaré',                      archivo: 'Yacaré.png'            },
  { nombre: 'Yaguareté',                   archivo: 'Yaguarete.png'         },
  { nombre: 'Chancho con Cadenas',         archivo: 'Chanchaconcadenas.png' },
  { nombre: 'La Difunta Correa',           archivo: 'Difuntacorrea.png'     },
  { nombre: 'El Familiar',                archivo: 'Familiar.png'          },
  { nombre: 'Gauchito Gil',               archivo: 'Gauchito.png'          },
  { nombre: 'El Lobizón',                 archivo: 'Lobizon.png'           },
  { nombre: 'Luz Mala',                    archivo: 'Luzmala.png'           },
  { nombre: 'Nahuelito',                   archivo: 'Nahuel.png'            },
  { nombre: 'El Pombero',                 archivo: 'Pompero.png'           },
  { nombre: 'El Mikilo',                   archivo: 'Mikilo.png'            },
  { nombre: 'La Salamanca',               archivo: 'Salamanca.png'         },
];

// ─── Helpers de rango ─────────────────────────────────────────────

export function calculateRank(essence) {
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (essence >= RANGOS[i].esenciaMin) {
      return RANGOS[i];
    }
  }
  return RANGOS[0];
}

// Devuelve el índice numérico de un rango por nombre (Aprendiz=0, …, Leyenda=4)
function rankIndex(nombreRango) {
  return RANGOS.findIndex((r) => r.nombre === nombreRango);
}

// ─── Drop de carta ────────────────────────────────────────────────

// Sortea una carta aleatoria y la guarda en localStorage.
// Evita repetir cartas que el usuario ya tiene.
// Devuelve la carta dropeada para mostrar feedback.
export function dropCard() {
  const collection = getCollection();
  // Obtener archivos de cartas ya obtenidas
  const cartasObtenidas = new Set(collection.map((c) => c.archivo));
  
  // Filtrar cartas no obtenidas
  const cartasDisponibles = CARTAS.filter((c) => !cartasObtenidas.has(c.archivo));
  
  // Si ya tiene todas, elegir de todas; si no, elegir de las disponibles
  const cartasParaElegir = cartasDisponibles.length > 0 ? cartasDisponibles : CARTAS;
  
  const carta = cartasParaElegir[Math.floor(Math.random() * cartasParaElegir.length)];
  addCard(carta);
  return carta;
}

// ─── Init ────────────────────────────────────────────────────────────────────

const container = document.getElementById('misiones-container');

if (container) {
  initMissions();
}

async function initMissions() {
  let missions = getMissions();

  if (missions.length === 0) {
    const response = await fetch('../assets/data/misiones.json');
    missions = await response.json();
    setMissions(missions);
  }

  renderMissions();
}

function renderMissions() {
  const missions  = getMissions();
  const essence   = getEssence();
  const userRank  = calculateRank(essence);
  const userLevel = rankIndex(userRank.nombre);

  container.innerHTML = '';

  missions.forEach((mission) => {
    const missionLevel = rankIndex(mission.rango);
    const bloqueada    = missionLevel > userLevel;

    const card    = document.createElement('article');
    const titleId = `mission-title-${mission.id}`;

    // Determinar clase de estado visual
    let estadoClase;
    if (mission.estado === 'sellada') {
      estadoClase = 'sellada';
    } else if (bloqueada) {
      estadoClase = 'bloqueada';
    } else {
      estadoClase = 'latente';
    }

    card.className = `card-mision estado-${estadoClase}`;
    card.setAttribute('aria-labelledby', titleId);
    card.dataset.estado = mission.estado;
    card.dataset.rango  = mission.rango;

    // Badge de estado
    let badgeHTML;
    if (mission.estado === 'sellada') {
      badgeHTML = `<div class="card-mision-estado estado-badge estado-sellada">✦ Sellada</div>`;
    } else if (bloqueada) {
      badgeHTML = `<div class="card-mision-estado estado-badge estado-bloqueada">🔒 Requiere ${mission.rango}</div>`;
    } else {
      badgeHTML = `<div class="card-mision-estado estado-badge estado-latente">🔓 Latente</div>`;
    }

    // Botón "Sellar" solo si la misión es latente Y el rango es suficiente
    const botonHTML = (!bloqueada && mission.estado !== 'sellada')
      ? `<button
           type="button"
           class="btn-sellar"
           data-id="${mission.id}"
           aria-label="Completar misión ${mission.titulo}">
           Sellar misión
         </button>`
      : '';

    card.innerHTML = `
      <div class="card-mision-icono">${mission.icono || '✦'}</div>

      <h3 id="${titleId}">${mission.titulo}</h3>

      <p class="card-mision-desc">${mission.descripcion}</p>

      <div class="card-mision-meta">
        <span class="meta-tag meta-esencia">✨ ${mission.esencia} esencia</span>
        <span class="meta-tag meta-rango">${mission.rango}</span>
      </div>

      ${badgeHTML}
      ${botonHTML}
    `;

    container.appendChild(card);
  });

  activateButtons();
}

function activateButtons() {
  const buttons = document.querySelectorAll('.card-mision .btn-sellar');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      completeMission(Number(button.dataset.id));
    });
  });
}

function completeMission(id) {
  const missions = getMissions();
  const mission  = missions.find((m) => m.id === id);

  if (!mission || mission.estado === 'sellada') return;

  // Guardar rango ANTES de sumar esencia
  const rankAntes = calculateRank(getEssence());
  // Contar misiones selladas ANTES
  const selldasAntes = missions.filter((m) => m.estado === 'sellada').length;

  // Completar misión y sumar esencia
  mission.estado = 'sellada';
  addEssence(Number(mission.esencia));
  setMissions(missions);

  // Calcular rango DESPUÉS de sumar esencia
  const rankDespues = calculateRank(getEssence());
  // Contar misiones selladas DESPUÉS
  const selladasDespues = missions.filter((m) => m.estado === 'sellada').length;
  const todasCompletadas = selladasDespues === missions.length;

  // Drop de carta SOLO si el usuario subió de rango
  if (rankDespues.nombre !== rankAntes.nombre) {
    const carta = dropCard();
    showCardDrop(carta, rankDespues);
  } else if (todasCompletadas) {
    // Drop de carta especial si completó todas las misiones
    const carta = dropCard();
    showCardDropFinal(carta);
  }

  renderMissions();
}

// ─── Animación de drop de carta ───────────────────────────────────────────────

function showCardDrop(carta, nuevoRango) {
  // Eliminar overlay anterior si existe
  const existing = document.getElementById('card-drop-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'card-drop-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Carta obtenida: ${carta.nombre}`);

  overlay.innerHTML = `
    <div class="card-drop-backdrop"></div>
    <div class="card-drop-modal">
      <p class="card-drop-subtitulo">Subiste de rango: ${nuevoRango.icono} ${nuevoRango.nombre}</p>
      <h2 class="card-drop-titulo">${carta.nombre}</h2>
      <div class="card-drop-imagen-wrap">
        <img
          src="../assets/img/${carta.archivo}"
          alt="${carta.nombre}"
          class="card-drop-imagen"
          onerror="this.style.display='none'"
        >
      </div>
      <p class="card-drop-mensaje">La cueva te revela una figura — guardada en tu colección</p>
      <button class="card-drop-cerrar" type="button" aria-label="Cerrar">
        Continuar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Forzar reflow para que la animación de entrada funcione
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });

  overlay.querySelector('.card-drop-cerrar').addEventListener('click', () => {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  });

  // También cerrar haciendo clic fuera del modal
  overlay.querySelector('.card-drop-backdrop').addEventListener('click', () => {
    overlay.querySelector('.card-drop-cerrar').click();
  });
}

// Variante de showCardDrop para cuando se completan TODAS las misiones
function showCardDropFinal(carta) {
  // Eliminar overlay anterior si existe
  const existing = document.getElementById('card-drop-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'card-drop-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Carta final obtenida: ${carta.nombre}`);

  overlay.innerHTML = `
    <div class="card-drop-backdrop"></div>
    <div class="card-drop-modal">
      <p class="card-drop-subtitulo">¡Completaste todas las misiones!</p>
      <h2 class="card-drop-titulo">${carta.nombre}</h2>
      <div class="card-drop-imagen-wrap">
        <img
          src="../assets/img/${carta.archivo}"
          alt="${carta.nombre}"
          class="card-drop-imagen"
          onerror="this.style.display='none'"
        >
      </div>
      <p class="card-drop-mensaje">La cueva te revela una figura final — guardada en tu colección</p>
      <button class="card-drop-cerrar" type="button" aria-label="Cerrar">
        Continuar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Forzar reflow para que la animación de entrada funcione
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
  });

  overlay.querySelector('.card-drop-cerrar').addEventListener('click', () => {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  });

  // También cerrar haciendo clic fuera del modal
  overlay.querySelector('.card-drop-backdrop').addEventListener('click', () => {
    overlay.querySelector('.card-drop-cerrar').click();
  });
}
