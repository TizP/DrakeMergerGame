import * as config from './config.js';
import * as drake from './drake.js';
import * as grid from './grid.js';
import * as ui from './ui.js';
import * as saveLoad from './saveLoad.js';
import * as audio from './audio.js'; // Import audio

let gameState = {
    resources: 50, // Start with some resources
    gridSlots: [],
    highestDrakeLevel: -1,
};

let passiveIncomeInterval = null;

export function initGame(loadSave = true) {
    console.log("Initializing game...");
    let loadedState = null;
    if (loadSave) {
        loadedState = saveLoad.loadGame();
    }

    if (loadedState) {
        gameState = loadedState;
         // Ensure gridSlots is initialized correctly even if save was partial/old
         if (!gameState.gridSlots || gameState.gridSlots.length !== config.GRID_SIZE) {
             gameState.gridSlots = Array(config.GRID_SIZE).fill(null);
             console.warn("Loaded grid data mismatch or missing. Resetting grid.");
         }
         // Reset drake ID counter based on loaded drakes
         const maxId = grid.getHighestDrakeIdOnGrid(); // Check grid *before* initializing grid module
         drake.resetDrakeIdCounter(maxId);
         console.log("Game loaded from save.");
    } else {
        // Initialize default state if no save loaded
        gameState = {
            resources: 50,
            gridSlots: Array(config.GRID_SIZE).fill(null),
            highestDrakeLevel: -1,
        };
        drake.resetDrakeIdCounter(); // Start IDs from 0
        console.log("Initialized new game state.");
    }

    // Initialize modules with potentially loaded state
    grid.initGrid(gameState.gridSlots); // Init grid module *after* loading state
    gameState.gridSlots = grid.getGridSlots(); // Ensure game state has the grid module's copy

    ui.updateResourceDisplay(gameState.resources);
    ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
    ui.renderGrid(gameState.gridSlots);
    ui.updateBuyButton(gameState.resources, grid.isGridFull());

    startPassiveIncome();

    // Initial audio UI update
    audio.updateMusicButtonUI(audio.isAudioPlaying());
}

function startPassiveIncome() {
    if (passiveIncomeInterval) clearInterval(passiveIncomeInterval); // Clear existing interval

    passiveIncomeInterval = setInterval(() => {
        let income = 0;
        gameState.gridSlots.forEach(d => {
            if (d && d.passiveIncome > 0) {
                income += d.passiveIncome;
            }
        });

        if (income > 0) {
            addResources(income);
            // Optional: Show floating income text or subtle animation
        }
    }, config.INCOME_INTERVAL);
}

export function addResources(amount) {
    gameState.resources += amount;
    ui.updateResourceDisplay(gameState.resources);
    // Update buy button state only if it might change (affordability)
    if (gameState.resources >= config.BASE_DRAKE_COST || gameState.resources - amount < config.BASE_DRAKE_COST) {
         ui.updateBuyButton(gameState.resources, grid.isGridFull());
    }
}

export function buyDrake() {
    const cost = config.BASE_DRAKE_COST;
    const isFull = grid.isGridFull();

    if (gameState.resources >= cost && !isFull) {
        const emptyIndex = grid.findEmptySlot();
        if (emptyIndex !== -1) {
            gameState.resources -= cost;
            const newDrake = drake.createDrake(0); // Create level 0 drake (Egg)
            if (grid.placeDrake(newDrake, emptyIndex)) {
                gameState.gridSlots = grid.getGridSlots(); // Update local state copy
                ui.updateResourceDisplay(gameState.resources);
                ui.renderGrid(gameState.gridSlots);
                ui.updateBuyButton(gameState.resources, grid.isGridFull());
                ui.showMessage("Drake Egg purchased!", 2000);
                updateHighestDrakeLevel(); // Check if highest level changed (unlikely here, but good practice)
            } else {
                 // Should not happen if findEmptySlot worked, but good to handle
                 gameState.resources += cost; // Refund
                 ui.showMessage("Error placing drake.", 3000);
            }
        }
        // No need for else here, isFull check already done
    } else if (isFull) {
        ui.showMessage("Grid is full!", 3000);
    } else {
        ui.showMessage(`Not enough resources! Need ${cost}.`, 3000);
    }
     ui.updateBuyButton(gameState.resources, grid.isGridFull()); // Ensure button state is correct
}

export function attemptMerge(fromIndex, toIndex) {
    if (fromIndex === toIndex) return; // Cannot merge onto self

    const drake1 = grid.getDrakeAt(fromIndex);
    const drake2 = grid.getDrakeAt(toIndex);

    if (!drake1 || !drake2) {
        console.warn("Merge attempt failed: One or both slots empty.");
        return; // Should not happen with proper drag/drop logic, but check anyway
    }

    if (drake1.level === drake2.level) {
        const currentLevel = drake1.level;
        if (currentLevel < config.MAX_DRAKE_LEVEL) {
            const nextLevel = currentLevel + 1;
            const mergedDrake = drake.createDrake(nextLevel);

            // Remove old drakes, place new one (typically in the target slot)
            grid.removeDrake(fromIndex);
            grid.removeDrake(toIndex); // Remove the target drake as well
            grid.placeDrake(mergedDrake, toIndex); // Place the new drake in the target slot

            gameState.gridSlots = grid.getGridSlots(); // Update local state copy
            updateHighestDrakeLevel(); // Check if this merge created a new highest
            ui.renderGrid(gameState.gridSlots); // Re-render the grid
            ui.updateBuyButton(gameState.resources, grid.isGridFull()); // Grid might not be full anymore
             ui.showMessage(`${drake.getDrakeDetails(nextLevel).name} created!`, 2500);

        } else {
            ui.showMessage("Already at max level!", 2000);
            // Optionally allow merging max level for points/resources?
        }
    } else {
        ui.showMessage("Drakes must be the same level to merge!", 2500);
        // Don't move the drake if merge fails - drag/drop handles this visually
    }
}


// Function to check and update the highest level drake achieved
function updateHighestDrakeLevel() {
    let maxLevel = -1;
    gameState.gridSlots.forEach(d => {
        if (d && d.level > maxLevel) {
            maxLevel = d.level;
        }
    });

    if (maxLevel > gameState.highestDrakeLevel) {
        gameState.highestDrakeLevel = maxLevel;
        ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
        // Optional: Trigger an achievement or special message
         ui.showMessage(`New highest drake achieved: ${drake.getDrakeDetails(maxLevel).name}!`, 3500);
    } else if (maxLevel < gameState.highestDrakeLevel) {
         // This can happen if the only highest level drake was merged or removed somehow
         gameState.highestDrakeLevel = maxLevel;
          ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
    }
}


// --- Save/Load/Delete ---
export function handleSave() {
    if (saveLoad.saveGame(gameState)) {
        ui.showMessage("Game Saved!", 2000);
    } else {
        ui.showMessage("Failed to save game!", 3000);
    }
}

export function handleLoad() {
    // Stop income before potentially changing state
    clearInterval(passiveIncomeInterval);
    passiveIncomeInterval = null;

    initGame(true); // Re-initialize the game, forcing a load attempt

     // Check if load was successful (e.g., by seeing if default resources are used)
     // This is a bit indirect; saveLoad.loadGame now returns null on failure/no save
     if(saveLoad.hasSaveData()){ // We can rely on checking if data existed before initGame tried loading
        ui.showMessage("Game Loaded!", 2000);
     } else {
        ui.showMessage("No save data found. Started new game.", 3000);
     }
     // initGame already restarts passive income and updates UI
}

export function handleDelete() {
    if (confirm("Are you sure you want to delete your saved game? This cannot be undone.")) {
        if (saveLoad.deleteSave()) {
            ui.showMessage("Save data deleted.", 2000);
            // Optional: Reset the current game state to default immediately
            // clearInterval(passiveIncomeInterval); passiveIncomeInterval = null;
            // initGame(false); // Re-initialize without loading
        } else {
            ui.showMessage("Failed to delete save data.", 3000);
        }
    }
}

// --- Drag and Drop Logic Handling ---
export function handleDragStart(event, index) {
    const drakeEl = event.target;
    if (!drakeEl.classList.contains('drake')) return; // Make sure we're dragging a drake

    const drakeData = grid.getDrakeAt(index);
    if (!drakeData) return; // Safety check

    ui.setDraggedElement(drakeEl, index);
    // Optional: Set drag data (though we rely on internal state `draggedDrakeIndex`)
    event.dataTransfer.setData('text/plain', drakeData.id); // Required for Firefox
    event.dataTransfer.effectAllowed = 'move';
}

export function handleDragEnd() {
    // Clean up visual styles regardless of drop success
    ui.clearDraggedElement();
    ui.removeAllDragOverHighlights();
}

export function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = 'move';

    const targetSlot = event.target.closest('.grid-slot');
    if (targetSlot) {
        ui.removeAllDragOverHighlights(); // Clear previous highlights
        ui.addDragOverHighlight(targetSlot);
    }
}

export function handleDragLeave(event) {
     const targetSlot = event.target.closest('.grid-slot');
     if(targetSlot){
        // Only remove highlight if the mouse truly left the slot,
        // not just moving over drake inside it. Check relatedTarget.
        if (!targetSlot.contains(event.relatedTarget)) {
            ui.removeDragOverHighlight(targetSlot);
        }
     }
}


export function handleDrop(event) {
    event.preventDefault();
    ui.removeAllDragOverHighlights(); // Clean up highlight on drop

    const fromIndex = ui.getDraggedIndex();
    if (fromIndex === -1) return; // No valid drake was being dragged

    const targetSlot = event.target.closest('.grid-slot');
    if (!targetSlot) return; // Dropped outside the grid or on non-slot element

    const toIndex = parseInt(targetSlot.dataset.index, 10);

    const drakeAtTarget = grid.getDrakeAt(toIndex);

    if (drakeAtTarget !== null) {
        // Attempt merge if target slot is occupied
        attemptMerge(fromIndex, toIndex);
    } else {
        // Move drake to empty slot
        const moveResult = grid.moveDrake(fromIndex, toIndex);
        if (moveResult && moveResult.moved) {
             gameState.gridSlots = grid.getGridSlots(); // Update state
             ui.renderGrid(gameState.gridSlots); // Re-render
             ui.showMessage("Drake moved.", 1500);
        }
    }

    // DragEnd handler will clear the dragging state (ui.clearDraggedElement)
}