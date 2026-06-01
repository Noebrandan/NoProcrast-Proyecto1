const estadoButtons = document.querySelectorAll('.filtro-btn');
const rangoButtons = document.querySelectorAll('.rango-btn');
const filtroStatus = document.getElementById('misiones-status');

let estadoActual = 'todos';
let rangoActual = 'todos';

estadoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    estadoActual = button.dataset.estado;
    updateFilterButtons(estadoButtons, estadoActual, 'estado');
    aplicarFiltros();
  });
});

rangoButtons.forEach((button) => {
  button.addEventListener('click', () => {
    rangoActual = button.dataset.rango;
    updateFilterButtons(rangoButtons, rangoActual, 'rango');
    aplicarFiltros();
  });
});

function updateFilterButtons(buttons, currentValue, dataAttribute) {
  buttons.forEach((button) => {
    const value = button.dataset[dataAttribute];
    const isActive = value === currentValue;
    button.setAttribute('aria-pressed', String(isActive));
    button.classList.toggle('activo', isActive);
  });
}

function aplicarFiltros() {
  const cards = document.querySelectorAll('.card-mision');
  if (cards.length === 0) return;

  let visibleCount = 0;

  cards.forEach((card) => {
    const estadoTexto = card.textContent.toLowerCase();
    let mostrar = true;

    if (estadoActual !== 'todos' && !estadoTexto.includes(estadoActual)) {
      mostrar = false;
    }

    if (rangoActual !== 'todos' && !estadoTexto.includes(rangoActual.toLowerCase())) {
      mostrar = false;
    }

    card.style.display = mostrar ? 'block' : 'none';
    card.setAttribute('aria-hidden', String(!mostrar));
    if (mostrar) visibleCount += 1;
  });

  actualizarEstado(visibleCount, cards.length);
}

function actualizarEstado(visibles, total) {
  if (!filtroStatus) return;

  if (visibles === total) {
    filtroStatus.textContent = `Mostrando todas las misiones. Total ${total}.`;
  } else {
    filtroStatus.textContent = `Mostrando ${visibles} de ${total} misiones.`;
  }
}

function iniciarFiltros() {
  updateFilterButtons(estadoButtons, estadoActual, 'estado');
  updateFilterButtons(rangoButtons, rangoActual, 'rango');
  aplicarFiltros();

  const container = document.getElementById('misiones-container');
  if (container) {
    const observer = new MutationObserver(() => aplicarFiltros());
    observer.observe(container, { childList: true });
  }
}

document.addEventListener('DOMContentLoaded', iniciarFiltros);
