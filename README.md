# Ejercicio 3 - Pokédex con Scroll Infinito y Filtros

## 📝 Descripción
Mini Pokédex (enciclopedia electrónica) que muestra una cuadrícula de Pokémon con scroll infinito, filtros por tipo, y modal con detalles completos utilizando el componente flip card del Ejercicio 2.

## ✨ Características Implementadas

### Requisitos Funcionales ✅

1. **Cuadrícula de Pokémon**
   - Cards pequeñas con imagen + nombre + tipos
   - Diseño responsive con Grid CSS
   - Animaciones hover para mejor UX

2. **Scroll Infinito**
   - Carga inicial de 20 Pokémon
   - Carga automática al llegar al final de la página
   - Indicador de carga mientras se obtienen datos
   - Mensaje al llegar al final de la Pokédex

3. **Filtrado por Tipo**
   - Select con todos los tipos de Pokémon (18 tipos)
   - Filtrado en cliente para rendimiento óptimo
   - Opción "Todos los tipos" para ver todos
   - Botón "Resetear" para volver al estado inicial

4. **Modal con Detalles**
   - Reutilización del componente flip card del Ejercicio 2
   - Cara frontal: imagen, nombre, tipos, peso, altura, habilidades
   - Cara trasera: estadísticas base con barras visuales
   - Click en la card para voltear (flip animation)
   - Cerrar con botón X, click fuera del modal, o tecla ESC

### Requisitos Técnicos ✅

- **HTML5**: Estructura semántica
- **CSS3 Puro**: 
  - Grid Layout para la cuadrícula
  - Flexbox para componentes
  - Animaciones y transiciones
  - Modal con backdrop blur
  - Diseño responsive
- **JavaScript Puro**: Sin frameworks
- **Optimizaciones**:
  - `Promise.all()` para cargar múltiples Pokémon en paralelo
  - Lazy loading de imágenes (`loading="lazy"`)
  - Cache en memoria para detalles de Pokémon
  - Fragmentos de documento para renderizado eficiente
- **Loader**: Spinner animado durante cargas
- **Reutilización**: Funciones y componentes del Ejercicio 2

## 🚀 Cómo Usar

1. **Abrir la aplicación**
   ```
   Abre index.html en tu navegador
   ```

2. **Explorar Pokémon**
   - Scroll hacia abajo para cargar más Pokémon automáticamente
   - Se cargan 20 Pokémon por vez

3. **Filtrar por Tipo**
   - Selecciona un tipo en el dropdown (Fuego, Agua, Planta, etc.)
   - La lista se filtrará automáticamente
   - Click en "Resetear" para volver al inicio

4. **Ver Detalles**
   - Click en cualquier card
   - Se abre un modal con información completa
   - Click en la card del modal para ver estadísticas
   - Cerrar con X, click fuera, o ESC

## 🎨 Características de Diseño

### Interfaz
- **Gradiente moderno** en el fondo
- **Cards con hover effects** (elevación y borde animado)
- **Colores por tipo** para identificación visual
- **Modal con backdrop blur** para enfoque

### Animaciones
- **Scroll suave** al cargar nuevos elementos
- **Fade in** del modal
- **Slide up** del contenido del modal
- **Flip 3D** de la card de detalles
- **Hover states** en todos los elementos interactivos

### Responsive
- **Desktop**: Grid de 5-6 columnas
- **Tablet**: Grid de 3-4 columnas
- **Mobile**: Grid de 2 columnas
- Adaptación automática de tamaños de fuente y espaciados

## 📊 Endpoints Utilizados

1. **Lista de Pokémon** (con paginación)
   ```
   GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
   ```

2. **Detalles de Pokémon**
   ```
   GET https://pokeapi.co/api/v2/pokemon/{id}
   ```

3. **Lista de Tipos**
   ```
   GET https://pokeapi.co/api/v2/type
   ```

## 🎯 Tipos de Pokémon Soportados

Los 18 tipos oficiales con colores distintivos:
- Normal, Fire, Water, Electric
- Grass, Ice, Fighting, Poison
- Ground, Flying, Psychic, Bug
- Rock, Ghost, Dragon, Dark
- Steel, Fairy

## 🔧 Tecnologías y Técnicas

### JavaScript ES6+
- `async/await` para manejo asíncrono
- `Promise.all()` para peticiones paralelas
- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Array methods (map, filter, forEach, slice, some)

### CSS3 Avanzado
- CSS Grid
- Flexbox
- Transform 3D
- Transitions
- Animations (@keyframes)
- CSS Variables
- Backdrop filters
- Box shadows
- Media queries

### Optimizaciones
- **Fragment API**: Para renderizado eficiente
- **Event delegation**: Para mejor rendimiento
- **Lazy loading**: Imágenes con loading="lazy"
- **Debouncing**: En el scroll handler
- **Caching**: De datos de Pokémon

## 💾 Estado Global

La aplicación mantiene un estado centralizado:
```javascript
{
  pokemonList: [],      // Lista completa cargada
  filteredList: [],     // Lista después de filtros
  types: [],            // Tipos disponibles
  currentOffset: 0,     // Paginación
  limit: 20,            // Por página
  isLoading: false,     // Estado de carga
  hasMorePokemon: true, // Más disponibles
  selectedType: 'all',  // Filtro activo
  pokemonCache: {}      // Cache de detalles
}
```

## 🎮 Funcionalidades Extra

- **Contador dinámico**: Muestra cuántos Pokémon están visibles
- **Fin de lista**: Mensaje cuando se llega al límite
- **Escape key**: Cerrar modal con ESC
- **Click outside**: Cerrar modal clickeando fuera
- **Loading states**: Feedback visual en todo momento
- **Error handling**: Manejo robusto de errores de red

## 📱 Compatibilidad

- Chrome, Firefox, Safari, Edge (versiones modernas)
- IE11+ (con polyfills adicionales)
- Responsive: Desktop, Tablet, Mobile
- Touch-friendly para dispositivos móviles

## 🔄 Flujo de Datos

1. **Inicialización**
   - Cargar tipos de Pokémon
   - Cargar primeros 20 Pokémon
   - Setup event listeners

2. **Scroll Infinito**
   - Detectar proximidad al final
   - Cargar siguiente batch
   - Renderizar nuevos elementos

3. **Filtrado**
   - Aplicar filtro a lista completa
   - Re-renderizar grilla
   - Actualizar contador

4. **Modal**
   - Click en card → Abrir modal
   - Mostrar detalles con flip card
   - Cerrar con múltiples métodos

## 🏆 Mejores Prácticas Implementadas

- ✅ Separación de concerns (estado, UI, datos)
- ✅ Código modular y reutilizable
- ✅ Nombres descriptivos de funciones
- ✅ Comentarios JSDoc
- ✅ Manejo de errores
- ✅ Accesibilidad básica
- ✅ Performance optimizations
- ✅ Clean code principles

---

**Powered by [PokéAPI](https://pokeapi.co/)**



