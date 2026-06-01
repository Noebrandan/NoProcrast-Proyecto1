# Salamanca-Proyecto1

### **¿Qué es Salamanca?**

Es una **aplicación web gamificada** diseñada para combatir la procrastinación mediante mecánicas de juego. La plataforma convierte tareas cotidianas en "misiones" que los usuarios pueden completar para ganar puntos, subir de nivel y desbloquear colecciones de figuras argentinas.

---

### **Temática: "La Cueva"**

El proyecto tiene una temática inmersiva de aventura inspirada en la mitología y leyendas argentinas:
- Se llama **"Salamanca"** (referencia a una leyenda argentina)
- Los usuarios son "aventureros en una cueva"
- Las tareas completadas ganan **"Esencia"** (puntos)
- Hay 5 rangos progresivos: Aprendiz → Iniciado → Guardián → Brujo → Leyenda
- Se desbloquean 20 cartas con figuras argentinas (animales nativos y leyendas locales)

---

### **Estructura del Proyecto**

```
📁 Carpeta principal
├── 📄 index.html (Página de inicio)
├── 📁 pages/
│   ├── misiones.html (Gestión de misiones)
│   └── perfil.html (Perfil del usuario)
├── 📁 assets/
│   ├── css/ (Estilos)
│   ├── data/ (misiones.json - base de datos de tareas)
│   ├── img/ (Imágenes de cartas)
│   └── js/ (Lógica de la aplicación)
└── 📁 Docs/ (Documentación)
```

---

### **Características Principales**

#### **1. Sistema de Autenticación Ligera**
- Los usuarios ingresan su nombre (máx. 30 caracteres)
- Se guarda en `localStorage` con la clave `salamanca_nombre`
- Pantalla de bienvenida personalizada

#### **2. Gestión de Misiones**
- **5 misiones iniciales** con temática de productividad:
  - "Resistir el monte" (cerrar pestañas innecesarias) - 10 Esencia
  - "Sellar el caos" (ordenar espacio) - 10 Esencia
  - "Encender el fogón" (preparar bebida) - 15 Esencia
  - "Marcar el sendero" (establecer meta) - 15 Esencia
  - "Guardar el talismán" (alejarse del celular) - 15 Esencia

- Estados de misiones: `latente` (sin realizar), `sellada` (completada)
- Las misiones se desbloquean según el rango del usuario

#### **3. Sistema de Rangos Dinámicos**
| Rango | Esencia Mín. | Ícono |
|-------|-------------|-------|
| Aprendiz | 0   | 🌱 |
| Iniciado | 125 | 👁️ |
| Guardián | 360 | 🔥  |
| Brujo    | 715 | 🌙 |
| Leyenda  | 1205| ⚔️ |

#### **4. Colección de Cartas**
- 20 figuras argentinas que se desbloquean al completar misiones
- Incluyen animales: Cóndor Andino, Yaguareté, Capincho, Picaflor
- Y leyendas: Gauchito Gil, La Difunta Correa, El Lobizón, La Salamanca

#### **5. Sistema de Logros**
- "Primera misión" (1 misión completada)
- "Llama encendida" (3 misiones)
- "Iniciado de la cueva" (10 misiones)
- Logros por alcanzar cada rango

---

### **Tecnología Utilizada**

**Frontend:**
- **HTML5 semántico** con atributos ARIA para accesibilidad
- **CSS3** con diseño responsive
- **JavaScript ES6+ módulos** para código organizado
- **localStorage** para persistencia de datos

**Organización del código:**
- main.js - Lógica de la página de inicio y estadísticas
- misiones.js - Gestión de misiones, rangos y colección de cartas
- perfil.js - Panel de usuario, progreso y logros
- storage.js - Sistema centralizado de almacenamiento local
- `filtros.js` - Filtrado de misiones 

---

### **Flujo de Usuario**

1. **Ingreso:** El usuario abre la app y completa su nombre
2. **Inicio:** Ve sus estadísticas (Esencia, Misiones Completadas, Rango)
3. **Misiones:** Accede a la lista de misiones disponibles según su rango
4. **Completar:** Al completar una misión, gana Esencia y puede desbloquear nuevas
5. **Progresión:** Sube de rango al acumular Esencia
6. **Recompensas:** Desbloquea nuevas misiones y cartas de figuras argentinas
7. **Perfil:** Ve su colección, logros desbloqueados y estadísticas

---

### **Decisiones de Diseño Importantes**

 **Temática Argentina:** Usa leyendas y fauna local para crear conexión cultural
 **Accesibilidad:** Implementa ARIA labels, navegación por teclado
 **Persistencia:** Todos los datos se guardan localmente sin backend
 **Progresión Gradual:** Sistema de rangos que motiva a seguir avanzando
 **Recompensas Visuales:** Colección de cartas como motivación adicional

---

### **Uso de IA en el Proyecto**

la IA se utilizó para:
- Mejorar estructura HTML semántica
- Implementar accesibilidad
- Resolver dudas sobre JavaScript
- Organización de archivos
- Redacción de documentación

Pero todas las decisiones de diseño, temática y funcionalidades fueron creadas por el equipo.

---
