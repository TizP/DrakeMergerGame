// --- START OF FILE ui.js ---

// Import necessary items from config (DRAKE_LEVELS needed for highest display name)
import { GRID_ROWS, GRID_COLS, BASE_DRAKE_COST, DRAKE_LEVELS, RARITY_LEVELS } from './config.js';

// --- Element References ---
const resourceCountEl = document.getElementById('resource-count');
const highestDrakeEl = document.getElementById('highest-drake');
const gameGridEl = document.getElementById('game-grid');
const buyDrakeBtn = document.getElementById('buy-drake-btn');
const buyCostSpan = document.getElementById('buy-cost');
const messageBoxEl = document.getElementById('message-box');
const musicToggleBtn = document.getElementById('music-toggle-btn');
// Add reference for the details panel (will be null until added to HTML)
const drakeDetailsPanel = document.getElementById('drake-details-panel'); // Will be null until added to HTML

// --- State & Handler Storage ---
let draggedDrakeElement = null;
let draggedDrakeIndex = -1;

let _buyClickHandler;
let _dragStartHandler;
let _dragEndHandler;
let _dropHandler;
let _dragOverHandler;
let _dragLeaveHandler;
let _drakeClickHandler; // Handler for clicking a drake

// --- Initialization ---
export function initUI(
    buyClickHandler, dragStartHandler, dragEndHandler,
    dropHandler, dragOverHandler, dragLeaveHandler,
    drakeClickHandler // Add the new handler parameter
) {
    // Store handlers
    _buyClickHandler = buyClickHandler;
    _dragStartHandler = dragStartHandler;
    _dragEndHandler = dragEndHandler;
    _dropHandler = dropHandler;
    _dragOverHandler = dragOverHandler;
    _dragLeaveHandler = dragLeaveHandler;
    _drakeClickHandler = drakeClickHandler; // Store the click handler

    // Setup Grid visual structure
    gameGridEl.innerHTML = '';
    gameGridEl.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
    gameGridEl.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;

    for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
        const slot = document.createElement('div');
        slot.classList.add('grid-slot');
        slot.dataset.index = i;

        // Drag/Drop listeners for the slot itself
        slot.addEventListener('dragover', (event) => _dragOverHandler && _dragOverHandler(event));
        slot.addEventListener('dragleave', (event) => _dragLeaveHandler && _dragLeaveHandler(event));
        slot.addEventListener('drop', (event) => _dropHandler && _dropHandler(event));

        // Add click listener to the slot (to handle clicks on empty slots or potentially deselect)
        slot.addEventListener('click', (event) => {
             // Prevent triggering if clicking on a drake *inside* the slot
            if (event.target === slot && typeof _drakeClickHandler === 'function') {
                _drakeClickHandler(i); // Pass index, game logic knows it's empty
            }
        });

        gameGridEl.appendChild(slot);
    }

    // Attach listener to the Buy button
    if (buyDrakeBtn) buyDrakeBtn.addEventListener('click', _buyClickHandler);

    // Update initial UI state
    if (buyCostSpan) buyCostSpan.textContent = BASE_DRAKE_COST;
    updateBuyButton(0, false);

    // Add listener for closing the details panel (assuming a close button exists in HTML)
     const detailsCloseBtn = document.getElementById('drake-details-close-btn');
     if(detailsCloseBtn) {
        detailsCloseBtn.addEventListener('click', hideDrakeDetails);
     } else {
         // This might log initially until the details panel HTML is fully added/styled
         // console.warn("Drake details close button not found during init.");
     }
}

// --- Grid Rendering (V2) ---
export function renderGrid(gridSlots) {
    const slotElements = gameGridEl.querySelectorAll('.grid-slot');
    slotElements.forEach((slotEl, index) => {
        const drakeData = gridSlots[index];
        slotEl.innerHTML = ''; // Clear previous content

        if (drakeData) {
            // Main container for the drake visuals and interactions
            const drakeEl = document.createElement('div');
            drakeEl.classList.add('drake');
            // Add rarity class for styling (e.g., border color)
            if (drakeData.rarityClass) {
                drakeEl.classList.add(drakeData.rarityClass);
            }
            drakeEl.draggable = true;
            drakeEl.dataset.drakeId = drakeData.id;
            drakeEl.dataset.index = index; // Store index directly for click handler

            // --- Visual Elements Inside Drake Container ---

            // 1. Image
            const imgEl = document.createElement('img');
            imgEl.src = drakeData.imageSrc || 'images/placeholder.png'; // Fallback image
            imgEl.alt = drakeData.name || 'Drake';
            imgEl.classList.add('drake-image');
            imgEl.ondragstart = () => false; // Prevent default image drag
            drakeEl.appendChild(imgEl);

            // 2. Element Icon (positioned absolutely)
            const elementIconEl = document.createElement('span');
            elementIconEl.classList.add('drake-element-icon');
            elementIconEl.textContent = drakeData.elementIcon || '?';
            drakeEl.appendChild(elementIconEl);

            // 3. Level Indicator (positioned absolutely)
            const levelTextEl = document.createElement('span');
            levelTextEl.classList.add('drake-level-text');
            levelTextEl.textContent = `Lvl ${drakeData.level}`;
            drakeEl.appendChild(levelTextEl);

            // --- Event Listeners for the Drake Element ---

            // Drag Start
            drakeEl.addEventListener('dragstart', (event) => {
                 if (typeof _dragStartHandler === 'function') {
                    _dragStartHandler(event, index);
                 }
            });

            // Drag End
            drakeEl.addEventListener('dragend', (event) => {
                if(typeof _dragEndHandler === 'function') {
                    _dragEndHandler(event);
                }
            });

            // Click Listener to Show Details
            drakeEl.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from bubbling to the parent slot's listener
                if (typeof _drakeClickHandler === 'function') {
                    _drakeClickHandler(index); // Pass the index to the handler in game.js
                }
            });

            // Append the fully constructed drake element to the slot
            slotEl.appendChild(drakeEl);
        }
        // If drakeData is null, slot remains empty
    });
}

// --- Drake Details Panel Functions ---

// Shows the details panel and populates it with drake data
export function showDrakeDetails(drakeData) {
    const panel = document.getElementById('drake-details-panel'); // Get panel reference again
    if (!panel || !drakeData) {
        // Optionally hide if called with no data after being open
        if (panel) hideDrakeDetails();
        return;
    }


    // Populate panel elements (assuming specific IDs exist in HTML)
    const nameEl = panel.querySelector('#detail-name');
    const levelEl = panel.querySelector('#detail-level');
    const rarityEl = panel.querySelector('#detail-rarity');
    const elementEl = panel.querySelector('#detail-element');
    const imageEl = panel.querySelector('#detail-image');
    const statsEl = panel.querySelector('#detail-stats'); // A div/ul to list stats
    const potentialEl = panel.querySelector('#detail-potential');
    const incomeEl = panel.querySelector('#detail-income');

    if (nameEl) nameEl.textContent = drakeData.name;
    if (levelEl) levelEl.textContent = `Level: ${drakeData.level}`;
    if (rarityEl) {
        rarityEl.textContent = `Rarity: ${drakeData.rarity}`;
        // Also update class for potential color styling of the rarity text
        rarityEl.className = 'detail-rarity-text'; // Base class for potential default styling
        if (drakeData.rarityClass) {
            rarityEl.classList.add(drakeData.rarityClass + '-text'); // e.g., rarity-common-text
        }
    }
    if (elementEl) elementEl.textContent = `${drakeData.elementIcon} Element: ${drakeData.element}`;
    if (imageEl) {
        imageEl.src = drakeData.imageSrc || 'images/placeholder.png';
        imageEl.alt = drakeData.name;
    }
    if (potentialEl) potentialEl.textContent = `Potential: ${drakeData.potential}`;

    // Populate Stats List
    if (statsEl && drakeData.stats) {
        statsEl.innerHTML = `
            <li>Strength: ${drakeData.stats.str || '?'}</li>
            <li>Vitality: ${drakeData.stats.vit || '?'}</li>
            <li>Agility: ${drakeData.stats.agi || '?'}</li>
            <li>Focus: ${drakeData.stats.foc !== undefined ? drakeData.stats.foc : '?'}</li>
        `; // Added fallbacks
    } else if (statsEl) {
        statsEl.innerHTML = '<li>Stats not available.</li>'; // Placeholder if no stats
    }
     // Calculate and display effective passive income
    if (incomeEl && typeof drakeData.passiveIncomeBase === 'number' && drakeData.stats && typeof drakeData.stats.foc === 'number') {
         const focusMultiplier = 1 + (drakeData.stats.foc / 100);
         const effectiveIncome = Math.round(drakeData.passiveIncomeBase * focusMultiplier);
         incomeEl.textContent = `Passive Income: ${effectiveIncome}/sec`;
     } else if (incomeEl) {
         incomeEl.textContent = `Passive Income: 0/sec`; // For eggs or invalid data
     }


    panel.classList.remove('hidden'); // Make panel visible
}

// Hides the details panel
export function hideDrakeDetails() {
    const panel = document.getElementById('drake-details-panel');
    if (panel) {
        panel.classList.add('hidden');
    }
}


// --- Other UI Update Functions ---

export function updateResourceDisplay(amount) {
    if (resourceCountEl) resourceCountEl.textContent = amount;
}

export function updateHighestDrakeDisplay(level) {
    if (!highestDrakeEl) return;
    // Use base DRAKE_LEVELS config for name lookup
    highestDrakeEl.textContent = level >= 0 && level < DRAKE_LEVELS.length ? DRAKE_LEVELS[level].name : 'None';
}

export function updateBuyButton(currentResources, isGridFull) {
    if (!buyDrakeBtn || !buyCostSpan) return;
    const cost = BASE_DRAKE_COST;
    const canAfford = currentResources >= cost;
    buyDrakeBtn.disabled = isGridFull || !canAfford;

    if (isGridFull) {
        buyDrakeBtn.title = "Grid is full!";
    } else if (!canAfford) {
        buyDrakeBtn.title = `Need ${cost} resources`;
    } else {
        buyDrakeBtn.title = "";
    }
    buyCostSpan.textContent = cost;
}

let messageTimeout = null;
export function showMessage(text, duration = 3000) {
    if (!messageBoxEl) return;
    messageBoxEl.textContent = text;
    messageBoxEl.style.opacity = 1;

    clearTimeout(messageTimeout);
    if (duration > 0) {
        messageTimeout = setTimeout(() => {
            // Check if element still exists before modifying
            if (messageBoxEl) {
                 messageBoxEl.style.opacity = 0;
            }
        }, duration);
    }
}

// --- Drag/Drop UI Feedback (Correct Single Instance) ---
export function setDraggedElement(element, index) {
    draggedDrakeElement = element;
    draggedDrakeIndex = index;
    if (draggedDrakeElement) {
        // Use timeout to ensure the class is added after the drag operation starts visually
        setTimeout(() => {
            // Check if still valid (drag didn't end instantly)
            if (draggedDrakeElement) {
                 draggedDrakeElement.classList.add('dragging');
            }
        }, 0);
    }
}
export function clearDraggedElement() {
    if (draggedDrakeElement) {
        draggedDrakeElement.classList.remove('dragging');
    }
    draggedDrakeElement = null;
    draggedDrakeIndex = -1;
}
export function getDraggedIndex() {
    return draggedDrakeIndex;
}
export function addDragOverHighlight(targetSlot) {
    // Check if targetSlot is valid before adding class
    if (targetSlot && targetSlot.classList) {
        targetSlot.classList.add('drag-over');
    }
}
export function removeDragOverHighlight(targetSlot) {
    // Check if targetSlot is valid before removing class
     if (targetSlot && targetSlot.classList) {
         targetSlot.classList.remove('drag-over');
     }
}
export function removeAllDragOverHighlights() {
    // Check if gameGridEl exists before querying
    if (gameGridEl) {
        gameGridEl.querySelectorAll('.grid-slot.drag-over').forEach(el => el.classList.remove('drag-over'));
    }
}


// --- Music Button Update ---
export function updateMusicButtonText(isPlaying) {
     if(musicToggleBtn) musicToggleBtn.textContent = isPlaying ? "Pause Music" : "Play Music";
}

// --- END OF FILE ui.js ---