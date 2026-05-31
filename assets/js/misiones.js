import {
  getMissions,
  setMissions,
  addEssence
} from './storage.js';

const RANGOS = [
  { nombre: 'Aprendiz', icono: '🌱', esenciaMin: 0 },
  { nombre: 'Iniciado', icono: '👁️', esenciaMin: 125 },
  { nombre: 'Guardián', icono: '🔥', esenciaMin: 360 },
  { nombre: 'Brujo', icono: '🌙', esenciaMin: 715 },
  { nombre: 'Leyenda', icono: '⚔️', esenciaMin: 1205 },
];

export function calculateRank(essence) {
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (essence >= RANGOS[i].esenciaMin) {
      return RANGOS[i];
    }
  }

  return RANGOS[0];
}

const container =
  document.getElementById('misiones-container');

if (container) {
  initMissions();
}

async function initMissions() {

  let missions = getMissions();

  if (missions.length === 0) {

    const response =
      await fetch('../assets/data/misiones.json');

    missions =
      await response.json();

    setMissions(missions);
  }

  renderMissions();
}

function renderMissions() {

  const missions = getMissions();

  container.innerHTML = '';

  missions.forEach((mission) => {
    const card = document.createElement('article');
    const titleId = `mission-title-${mission.id}`;

    card.className = `card-mision estado-${mission.estado}`;
    card.setAttribute('aria-labelledby', titleId);

    card.innerHTML = `
      <h3 id="${titleId}">${mission.titulo}</h3>

      <p>${mission.descripcion}</p>

      <p>
        <strong>Esencia:</strong>
        ${mission.esencia}
      </p>

      <p>
        <strong>Rango:</strong>
        ${mission.rango}
      </p>

      <p>
        <strong>Estado:</strong>
        ${mission.estado}
      </p>

      ${
        mission.estado !== 'sellada'
          ? `<button type="button" data-id="${mission.id}" aria-label="Completar misión ${mission.titulo}">
              Completar misión
             </button>`
          : ''
      }
    `;

    container.appendChild(card);
  });

  activateButtons();
}

function activateButtons() {

  const buttons =
    document.querySelectorAll('.card-mision button');

  buttons.forEach((button) => {

    button.addEventListener('click', () => {

      completeMission(
        Number(button.dataset.id)
      );

    });

  });
}

function completeMission(id) {

  const missions =
    getMissions();

  const mission =
    missions.find(
      (m) => m.id === id
    );

  if (!mission) return;

  if (mission.estado === 'sellada')
    return;

  mission.estado = 'sellada';

  addEssence(
    Number(mission.esencia)
  );

  setMissions(missions);

  renderMissions();
}
