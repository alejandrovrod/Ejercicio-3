// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const state = {
    pokemonList: [],           // Lista completa de Pokémon cargados
    filteredList: [],          // Lista filtrada
    types: [],                 // Lista de tipos disponibles
    currentOffset: 0,          // Offset actual para paginación
    limit: 20,                 // Cantidad por carga
    isLoading: false,          // Estado de carga
    hasMorePokemon: true,      // Hay más Pokémon para cargar
    selectedType: 'all',       // Tipo seleccionado
    pokemonCache: {}           // Cache de detalles de Pokémon
};

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const elements = {
    pokemonGrid: document.getElementById('pokemonGrid'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    endMessage: document.getElementById('endMessage'),
    typeFilter: document.getElementById('typeFilter'),
    resetBtn: document.getElementById('resetBtn'),
    pokemonCount: document.getElementById('pokemonCount'),
    modal: document.getElementById('pokemonModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    modalCard: document.getElementById('modalPokemonCard'),
    // Modal elements
    modalPokemonNumber: document.getElementById('modalPokemonNumber'),
    modalPokemonImage: document.getElementById('modalPokemonImage'),
    modalPokemonName: document.getElementById('modalPokemonName'),
    modalPokemonTypes: document.getElementById('modalPokemonTypes'),
    modalPokemonWeight: document.getElementById('modalPokemonWeight'),
    modalPokemonHeight: document.getElementById('modalPokemonHeight'),
    modalPokemonAbilities: document.getElementById('modalPokemonAbilities'),
    modalStatsContainer: document.getElementById('modalStatsContainer')
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
async function init() {
    console.log('Inicializando Pokédex...');
    
    // Cargar tipos de Pokémon
    await loadPokemonTypes();
    
    // Cargar primeros 20 Pokémon
    await loadPokemon();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Pokédex inicializada correctamente');
}

// ==========================================
// CARGA DE DATOS
// ==========================================

/**
 * Carga los tipos de Pokémon desde la API
 */
async function loadPokemonTypes() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        
        state.types = data.results.filter(type => {
            // Filtrar tipos especiales que no son de Pokémon normales
            return !['unknown', 'shadow'].includes(type.name);
        });
        
        // Popular el select de tipos
        populateTypeFilter();
        
    } catch (error) {
        console.error('Error al cargar tipos:', error);
    }
}

/**
 * Popula el select de filtro con los tipos
 */
function populateTypeFilter() {
    const fragment = document.createDocumentFragment();
    
    state.types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = capitalizeFirst(type.name);
        fragment.appendChild(option);
    });
    
    elements.typeFilter.appendChild(fragment);
}

/**
 * Carga la lista de Pokémon desde la API
 */
async function loadPokemon() {
    if (state.isLoading || !state.hasMorePokemon) return;
    
    state.isLoading = true;
    showLoading();
    
    try {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.currentOffset}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Si no hay más resultados
        if (data.results.length === 0) {
            state.hasMorePokemon = false;
            showEndMessage();
            return;
        }
        
        // Cargar detalles de todos los Pokémon en paralelo
        const pokemonDetails = await Promise.all(
            data.results.map(pokemon => fetchPokemonDetails(pokemon.url))
        );
        
        // Agregar a la lista
        state.pokemonList = [...state.pokemonList, ...pokemonDetails];
        
        // Aplicar filtro si hay uno activo
        if (state.selectedType === 'all') {
            state.filteredList = [...state.pokemonList];
        } else {
            applyFilter();
        }
        
        // Actualizar offset
        state.currentOffset += state.limit;
        
        // Renderizar nuevos Pokémon
        renderPokemonGrid();
        
        // Verificar si llegamos al final (máximo ~1000 Pokémon)
        if (state.currentOffset >= 1000) {
            state.hasMorePokemon = false;
            showEndMessage();
        }
        
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        alert('Error al cargar Pokémon. Por favor, intenta de nuevo.');
    } finally {
        state.isLoading = false;
        hideLoading();
    }
}

/**
 * Obtiene los detalles de un Pokémon
 * @param {string} url - URL del Pokémon
 */
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Guardar en caché
        state.pokemonCache[data.id] = data;
        state.pokemonCache[data.name] = data;
        
        return data;
    } catch (error) {
        console.error('Error al cargar detalles:', error);
        return null;
    }
}

// ==========================================
// RENDERIZADO
// ==========================================

/**
 * Renderiza la grilla de Pokémon
 */
function renderPokemonGrid() {
    // Si es un filtrado, limpiar la grilla
    if (state.selectedType !== 'all' && state.currentOffset === state.limit) {
        elements.pokemonGrid.innerHTML = '';
    }
    
    const fragment = document.createDocumentFragment();
    const startIndex = elements.pokemonGrid.children.length;
    
    state.filteredList.slice(startIndex).forEach(pokemon => {
        if (!pokemon) return;
        
        const card = createPokemonCard(pokemon);
        fragment.appendChild(card);
    });
    
    elements.pokemonGrid.appendChild(fragment);
    updatePokemonCount();
}

/**
 * Crea una tarjeta de Pokémon para la grilla
 * @param {Object} pokemon - Datos del Pokémon
 */
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card-small';
    card.dataset.pokemonId = pokemon.id;
    
    const number = String(pokemon.id).padStart(3, '0');
    const imageUrl = pokemon.sprites.front_default || 'https://via.placeholder.com/120?text=No+Image';
    
    card.innerHTML = `
        <span class="card-number">#${number}</span>
        <img class="card-image" src="${imageUrl}" alt="${pokemon.name}" loading="lazy">
        <h3 class="card-name">${pokemon.name}</h3>
        <div class="card-types">
            ${pokemon.types.map(t => `
                <span class="type-badge-small type-${t.type.name}">${t.type.name}</span>
            `).join('')}
        </div>
    `;
    
    // Event listener para abrir modal
    card.addEventListener('click', () => openModal(pokemon));
    
    return card;
}

/**
 * Actualiza el contador de Pokémon
 */
function updatePokemonCount() {
    const count = state.filteredList.length;
    elements.pokemonCount.textContent = `Mostrando ${count} Pokémon`;
}

// ==========================================
// FILTRADO
// ==========================================

/**
 * Aplica el filtro por tipo
 */
function applyFilter() {
    const selectedType = state.selectedType;
    
    if (selectedType === 'all') {
        state.filteredList = [...state.pokemonList];
    } else {
        state.filteredList = state.pokemonList.filter(pokemon => {
            return pokemon.types.some(t => t.type.name === selectedType);
        });
    }
    
    // Limpiar grilla y renderizar de nuevo
    elements.pokemonGrid.innerHTML = '';
    renderPokemonGrid();
}

/**
 * Resetea el filtro y recarga
 */
function resetFilter() {
    // Resetear estado
    state.pokemonList = [];
    state.filteredList = [];
    state.currentOffset = 0;
    state.hasMorePokemon = true;
    state.selectedType = 'all';
    
    // Resetear UI
    elements.typeFilter.value = 'all';
    elements.pokemonGrid.innerHTML = '';
    elements.endMessage.classList.add('hidden');
    
    // Recargar
    loadPokemon();
}

// ==========================================
// MODAL
// ==========================================

/**
 * Abre el modal con los detalles del Pokémon
 * @param {Object} pokemon - Datos del Pokémon
 */
function openModal(pokemon) {
    // Asegurar que la tarjeta no esté volteada
    elements.modalCard.classList.remove('flipped');
    
    // Número del Pokémon
    elements.modalPokemonNumber.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    
    // Imagen
    elements.modalPokemonImage.src = pokemon.sprites.front_default || 'https://via.placeholder.com/180?text=No+Image';
    elements.modalPokemonImage.alt = pokemon.name;
    
    // Nombre
    elements.modalPokemonName.textContent = pokemon.name;
    
    // Tipos
    elements.modalPokemonTypes.innerHTML = '';
    pokemon.types.forEach(typeInfo => {
        const typeBadge = document.createElement('span');
        typeBadge.className = `type-badge type-${typeInfo.type.name}`;
        typeBadge.textContent = typeInfo.type.name;
        elements.modalPokemonTypes.appendChild(typeBadge);
    });
    
    // Peso (hectogramos a kg)
    const weightKg = (pokemon.weight / 10).toFixed(1);
    elements.modalPokemonWeight.textContent = `${weightKg} kg`;
    
    // Altura (decímetros a metros)
    const heightM = (pokemon.height / 10).toFixed(1);
    elements.modalPokemonHeight.textContent = `${heightM} m`;
    
    // Habilidades
    elements.modalPokemonAbilities.innerHTML = '';
    pokemon.abilities.forEach(abilityInfo => {
        const abilityBadge = document.createElement('span');
        abilityBadge.className = 'ability-badge';
        abilityBadge.textContent = abilityInfo.ability.name.replace('-', ' ');
        elements.modalPokemonAbilities.appendChild(abilityBadge);
    });
    
    // Estadísticas
    displayStats(pokemon.stats);
    
    // Mostrar modal
    elements.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal
 */
function closeModal() {
    elements.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Resetear flip si estaba volteada
    elements.modalCard.classList.remove('flipped');
}

/**
 * Muestra las estadísticas del Pokémon en el modal
 * @param {Array} stats - Array de estadísticas
 */
function displayStats(stats) {
    elements.modalStatsContainer.innerHTML = '';
    
    const statNames = {
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Attack',
        'special-defense': 'Sp. Defense',
        'speed': 'Speed'
    };
    
    stats.forEach(statInfo => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        
        const statName = statNames[statInfo.stat.name] || statInfo.stat.name;
        const statValue = statInfo.base_stat;
        const statPercentage = Math.min((statValue / 200) * 100, 100);
        
        statItem.innerHTML = `
            <div class="stat-header">
                <span class="stat-name">${statName}</span>
                <span class="stat-value">${statValue}</span>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${statPercentage}%"></div>
            </div>
        `;
        
        elements.modalStatsContainer.appendChild(statItem);
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Infinite scroll
    window.addEventListener('scroll', handleScroll);
    
    // Filtro por tipo
    elements.typeFilter.addEventListener('change', (e) => {
        state.selectedType = e.target.value;
        applyFilter();
    });
    
    // Botón resetear
    elements.resetBtn.addEventListener('click', resetFilter);
    
    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    
    // Flip card en modal
    elements.modalCard.addEventListener('click', () => {
        elements.modalCard.classList.toggle('flipped');
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/**
 * Maneja el evento de scroll para infinite scroll
 */
function handleScroll() {
    // Si ya está cargando o no hay más, salir
    if (state.isLoading || !state.hasMorePokemon) return;
    
    // Si hay un filtro activo que no sea "all", no cargar más
    if (state.selectedType !== 'all') return;
    
    // Calcular si llegamos cerca del final
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Cargar cuando estemos a 300px del final
    if (scrollTop + windowHeight >= documentHeight - 300) {
        loadPokemon();
    }
}

// ==========================================
// UTILIDADES
// ==========================================

function showLoading() {
    elements.loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingSpinner.classList.add('hidden');
}

function showEndMessage() {
    elements.endMessage.classList.remove('hidden');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// INICIO DE LA APLICACIÓN
// ==========================================
window.addEventListener('DOMContentLoaded', init);



