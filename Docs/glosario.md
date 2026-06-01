Voy a explicar algunas cosas, porque me olvido y quizás lo necesiten. Puse "GLosario" pero nada que ver...

Sepan que mi inglés es bantante pobre, si falla algo, capaz sea pq está en espaniglish.

Profe, si lo llega a leer, no soy buena explicando. No lo tome en cuenta jaja <3
-----------------------------------------------

JSON lista de datos, no hace nada, solo guarda información. Siempre con [] y adentro con llaves {}

{
  "id": 1,           → número único, el JS lo usa para guardar en localStorage
  "titulo": "...",   → lo que aparece como título en la card
  "descripcion":".", → el texto descriptivo de la card
  "esencia": 10,     → cuántos puntos suma al completarla
  "estado": "LATENTE", → empieza siempre en "LATENTE", el JS lo cambia a "SELLADA"
  "rango": "Aprendiz",   → para los filtros por rango en misiones.html
  "icono": "🌳"      → decorativo, aparece en la card
}

----------------------------------------------------

HTML Semántico  -> Las etiquetas que reemplazan al div
En vez de...                 Usá...         Por qué

<div class="header">       <header>         "Header" → cabecera de página o sección
<div class="nav">          <nav>            "Navigation" → barra de navegación
<div class="main">         <main>           "Main" → contenido principal
<div class="footer">       <footer>         "Footer" → pie de página
<div class="section">      <section>        "Section" → sección temática
<div class="article">      <article>        "Article" → contenido independiente (una card, una misión)
<div class="aside">        <aside>          "Aside" → contenido secundario, lateral
<div class="button">       <button>         "Button" → botón interactivo

--------------------------------------------------

MISIONES.JS ----> Tareas Latente (pendiente) // Invocada (Activo) // Sellada (Completada)

NO SE OLVIDEN, sino el JSON no va a funcionar el filtro.

--------------------------------------------------

Index ---> Tiene una "bienvenida" integrada, una vez que se ingresa el nombre, se guarda en el localstorage y queda registrada el progreso (se supone que asi debe funcionar)

----------------------------------------------------

