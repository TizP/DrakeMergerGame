// --- START OF FILE ui.js ---

import { GRID_ROWS, GRID_COLS, BASE_DRAKE_COST, DRAKE_LEVELS } from './config.js';

// ... (keep existing const declarations for elements)
const resourceCountEl = document.getElementById('resource-count');
const highestDrakeEl = document.getElementById('highest-drake');
const gameGridEl = document.getElementById('game-grid');
const buyDrakeBtn = document.getElementById('buy-drake-btn');
const buyCostSpan = document.getElementById('buy-cost');
const messageBoxEl = document.getElementById('message-box');
const musicToggleBtn = document.getElementById('music-toggle-btn');


// ... (keep existing state variables and stored handlers)
let draggedDrakeElement = null;
let draggedDrakeIndex = -1;
let _buyClickHandler;
let _dragStartHandler;
let _dragEndHandler;
let _dropHandler;
let _dragOverHandler;
let _dragLeaveHandler;


// ... (keep initUI function as it is from the previous fix)
export function initUI(buyClickHandler, dragStartHandler, dragEndHandler, dropHandler, dragOverHandler, dragLeaveHandler) {
    // Setup Grid visual structure
    gameGridEl.innerHTML = ''; // Clear previous grid
    gameGridEl.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
    gameGridEl.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;

    for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
        const slot = document.createElement('div');
        slot.classList.add('grid-slot');
        slot.dataset.index = i; // Store index for easy access

        // Add drop target listeners (using stored handlers)
        slot.addEventListener('dragover', (event) => _dragOverHandler(event));
        slot.addEventListener('dragleave', (event) => _dragLeaveHandler(event));
        slot.addEventListener('drop', (event) => _dropHandler(event));

        gameGridEl.appendChild(slot);
    }

    // Store the handlers passed in from main.js for later use
    _buyClickHandler = buyClickHandler;
    _dragStartHandler = dragStartHandler;
    _dragEndHandler = dragEndHandler;
    _dropHandler = dropHandler;
    _dragOverHandler = dragOverHandler;
    _dragLeaveHandler = dragLeaveHandler;

    // Attach listener to the Buy button
    buyDrakeBtn.addEventListener('click', _buyClickHandler);

    // Update initial buy cost display and button state
    buyCostSpan.textContent = BASE_DRAKE_COST; // Set initial cost text
    updateBuyButton(0, false); // Assume 0 resources initially, grid not full
}


// --- MODIFIED renderGrid function ---
export function renderGrid(gridSlots) {
    const slotElements = gameGridEl.querySelectorAll('.grid-slot');
    slotElements.forEach((slotEl, index) => {
        const drake = gridSlots[index];
        slotEl.innerHTML = ''; // Clear previous content (drake image or empty)

        if (drake) {
            // If a drake exists in this slot, create its container div
            const drakeEl = document.createElement('div');
            // Keep the level-specific class for potential styling (like borders later?)
            // but primary visual will be the image.
            drakeEl.classList.add('drake', drake.colorClass);
            drakeEl.draggable = true;           // Make the container draggable
            drakeEl.dataset.drakeId = drake.id; // Store unique ID

            // --- Create the image element ---
            const imgEl = document.createElement('img');
            imgEl.src = drake.imageSrc; // Use the path from config.js
            imgEl.alt = drake.name;     // Set alt text for accessibility
            imgEl.classList.add('drake-image'); // Add class for easier CSS targeting
            // Prevent browser's default image drag behavior which can interfere
            imgEl.ondragstart = () => false;

            // Append the image inside the drake container div
            drakeEl.appendChild(imgEl);
            // --------------------------------

            // Add drag source listeners to the main drake container div
            drakeEl.addEventListener('dragstart', (event) => {
                const parentSlot = event.target.closest('.grid-slot');
                if (parentSlot && parentSlot.dataset.index) {
                    const currentDrakeIndex = parseInt(parentSlot.dataset.index, 10);
                    if (typeof _dragStartHandler === 'function') {
                         _dragStartHandler(event, currentDrakeIndex);
                    }
                } else {
                    console.error("Could not find parent slot index for dragstart");
                }
            });

            if (typeof _dragEndHandler === 'function') {
                 drakeEl.addEventListener('dragend', _dragEndHandler);
            }

            // Add the complete drake container (with image inside) to the grid slot
            slotEl.appendChild(drakeEl);
        }
    });
}
// --- END OF MODIFIED renderGrid ---


// ... (keep the rest of the functions: updateResourceDisplay, updateHighestDrakeDisplay, updateBuyButton, showMessage, drag/drop UI feedback, updateMusicButtonText)
export function updateResourceDisplay(amount) {
    resourceCountEl.textContent = amount;
}

export function updateHighestDrakeDisplay(level) {
    highestDrakeEl.textContent = level >= 0 && level < DRAKE_LEVELS.length ? DRAKE_LEVELS[level].name : 'None';
}

export function updateBuyButton(currentResources, isGridFull) {
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
    messageBoxEl.textContent = text;
    messageBoxEl.style.opacity = 1;

    clearTimeout(messageTimeout);
    if (duration > 0) {
        messageTimeout = setTimeout(() => {
            messageBoxEl.style.opacity = 0;
        }, duration);
    }
}

export function setDraggedElement(element, index) {
    draggedDrakeElement = element;
    draggedDrakeIndex = index;
    if (draggedDrakeElement) {
        setTimeout(() => {
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
    if (targetSlot && targetSlot.classList) {
        targetSlot.classList.add('drag-over');
    }
}

export function removeDragOverHighlight(targetSlot) {
     if (targetSlot && targetSlot.classList) {
         targetSlot.classList.remove('drag-over');
     }
}

export function removeAllDragOverHighlights() {
    gameGridEl.querySelectorAll('.grid-slot.drag-over').forEach(el => el.classList.remove('drag-over'));
}

export function updateMusicButtonText(isPlaying) {
     musicToggleBtn.textContent = isPlaying ? "Pause Music" : "Play Music";
}

// --- END OF FILE ui.js ---