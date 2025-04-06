// --- START OF FILE game.js ---

import * as config from './config.js';
import * as drake from './drake.js'; // Imports the updated drake module
import * as grid from './grid.js';
import * as ui from './ui.js'; // Will update ui.js next
import * as saveLoad from './saveLoad.js';
import * as audio from './audio.js';

// Default game state structure V2
const getDefaultGameState = () => ({
    resources: 50,
    gridSlots: Array(config.GRID_SIZE).fill(null),
    highestDrakeLevel: -1,
    // Add other top-level state if needed later (e.g., research, combat)
});

let gameState = getDefaultGameState();
let passiveIncomeInterval = null;

// Initialization: Loads save or starts fresh
export function initGame(loadSave = true) {
    console.log("Initializing game (V2)...");
    let loadedState = null;
    if (loadSave) {
        // Use the new save key from config.js
        loadedState = saveLoad.loadGame(config.SAVE_KEY);
    }

    if (loadedState && loadedState.gridSlots) { // Basic check if loaded state seems valid
        // TODO: Add more robust validation/migration logic if save structure changes drastically later
        gameState = { ...getDefaultGameState(), ...loadedState }; // Merge loaded state over defaults
        console.log("Game loaded from save (V2).");

        // Find the highest drake ID from the loaded grid *before* initializing grid module
        const maxId = findHighestDrakeId(gameState.gridSlots);
        drake.resetDrakeIdCounter(maxId);

    } else {
        gameState = getDefaultGameState(); // Start fresh
        drake.resetDrakeIdCounter(-1); // Reset IDs from scratch
        console.log("Initialized new game state (V2).");
    }

    // Ensure gridSlots array is the correct size, even if save was malformed
    if (!gameState.gridSlots || gameState.gridSlots.length !== config.GRID_SIZE) {
         console.warn("Loaded grid data mismatch or missing. Resetting grid.");
         gameState.gridSlots = Array(config.GRID_SIZE).fill(null);
    }

    // Initialize grid module with the potentially loaded state
    grid.initGrid(gameState.gridSlots);
    gameState.gridSlots = grid.getGridSlots(); // Ensure game state uses the grid module's copy

    // Initial UI updates
    ui.updateResourceDisplay(gameState.resources);
    ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel); // Update based on loaded/default level
    ui.renderGrid(gameState.gridSlots); // Render the grid with potentially complex drakes
    ui.updateBuyButton(gameState.resources, grid.isGridFull());
    // Update highest level display *after* rendering, in case loaded state was missing it
    updateHighestDrakeLevel(); // Recalculate and potentially update display

    startPassiveIncome();
    audio.updateMusicButtonUI(audio.isAudioPlaying());
}

// Helper to find the max ID among drakes in a grid array
function findHighestDrakeId(gridSlots) {
    let maxId = -1;
    gridSlots.forEach(d => {
        if (d && typeof d.id === 'number' && d.id > maxId) {
            maxId = d.id;
        }
    });
    return maxId;
}


// Starts the passive income generation loop
function startPassiveIncome() {
    if (passiveIncomeInterval) clearInterval(passiveIncomeInterval);

    passiveIncomeInterval = setInterval(() => {
        let totalIncome = 0;
        gameState.gridSlots.forEach(d => {
            if (d && d.passiveIncomeBase > 0 && d.stats && typeof d.stats.foc === 'number') {
                // Calculate income: Base * (1 + Focus modifier)
                // Example: Focus of 100 means +100% (doubled income)
                const focusMultiplier = 1 + (d.stats.foc / 100);
                totalIncome += d.passiveIncomeBase * focusMultiplier;
            }
        });

        if (totalIncome > 0) {
            addResources(Math.round(totalIncome)); // Round income to avoid fractions of resources
        }
    }, config.INCOME_INTERVAL);
}

// Adds resources and updates UI
export function addResources(amount) {
    gameState.resources += amount;
    ui.updateResourceDisplay(gameState.resources);
    // Update buy button only if state might change
    if (gameState.resources >= config.BASE_DRAKE_COST || gameState.resources - amount < config.BASE_DRAKE_COST) {
         ui.updateBuyButton(gameState.resources, grid.isGridFull());
    }
}

// Buys a level 0 drake (Egg)
export function buyDrake() {
    const cost = config.BASE_DRAKE_COST;
    const isFull = grid.isGridFull();

    if (gameState.resources >= cost && !isFull) {
        const emptyIndex = grid.findEmptySlot();
        if (emptyIndex !== -1) {
            gameState.resources -= cost;
            const newDrake = drake.createDrake(0); // createDrake now adds stats/rarity etc.
            if (newDrake && grid.placeDrake(newDrake, emptyIndex)) {
                gameState.gridSlots = grid.getGridSlots();
                ui.updateResourceDisplay(gameState.resources);
                ui.renderGrid(gameState.gridSlots);
                ui.updateBuyButton(gameState.resources, grid.isGridFull());
                ui.showMessage(`Purchased ${newDrake.rarity} ${newDrake.element} Egg!`, 2500);
                // Don't need updateHighestDrakeLevel here, as level 0 can't be highest initially
            } else {
                 gameState.resources += cost; // Refund if placement failed
                 ui.showMessage("Error placing drake.", 3000);
                 console.error("Failed to place newly created drake:", newDrake);
            }
        }
    } else if (isFull) {
        ui.showMessage("Grid is full!", 3000);
    } else {
        ui.showMessage(`Not enough resources! Need ${cost}.`, 3000);
    }
     ui.updateBuyButton(gameState.resources, grid.isGridFull()); // Ensure button state is correct
}

// --- MERGE LOGIC OVERHAULED ---
export function attemptMerge(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    const drake1 = grid.getDrakeAt(fromIndex); // Drake being dragged
    const drake2 = grid.getDrakeAt(toIndex);   // Drake being dropped onto

    if (!drake1 || !drake2) {
        console.warn("Merge attempt failed: One or both slots empty.");
        return;
    }

    if (drake1.level === drake2.level) {
        const currentLevel = drake1.level;
        if (currentLevel < config.MAX_DRAKE_LEVEL) {

            // Calculate the result of the merge using the new drake module function
            const mergedDrakeData = drake.calculateMergedDrakeStats(drake1, drake2);

            if (mergedDrakeData) {
                // Remove old drakes
                grid.removeDrake(fromIndex);
                grid.removeDrake(toIndex);

                // Place the new merged drake (usually in the target slot)
                if (grid.placeDrake(mergedDrakeData, toIndex)) {
                    gameState.gridSlots = grid.getGridSlots(); // Update local state copy
                    updateHighestDrakeLevel(); // Check if this merge created a new highest level
                    ui.renderGrid(gameState.gridSlots); // Re-render the grid
                    ui.updateBuyButton(gameState.resources, grid.isGridFull()); // Grid might have space now
                    ui.showMessage(`Merged into Lvl ${mergedDrakeData.level} ${mergedDrakeData.rarity} ${mergedDrakeData.element} ${mergedDrakeData.name}!`, 3000);
                } else {
                    // Should not happen if slots were cleared, but handle potential errors
                    console.error("Failed to place merged drake!", mergedDrakeData);
                    ui.showMessage("Merge error: Failed to place result!", 3000);
                    // Attempt to restore parents? Difficult state to recover reliably.
                    // For now, drakes are lost. Consider better error recovery if this happens often.
                    gameState.gridSlots = grid.getGridSlots(); // Update state even on error
                    ui.renderGrid(gameState.gridSlots);
                }
            } else {
                // calculateMergedDrakeStats returned null (e.g., max level reached calculation)
                 ui.showMessage("Cannot merge further at this level.", 2000);
            }

        } else {
            ui.showMessage("Already at max level!", 2000);
            // Optional: Allow merging max level for resources/essence later
        }
    } else {
        ui.showMessage("Drakes must be the same level to merge!", 2500);
    }
}


// Checks and updates the highest level drake achieved
function updateHighestDrakeLevel() {
    let maxLevel = -1;
    gameState.gridSlots.forEach(d => {
        if (d && d.level > maxLevel) {
            maxLevel = d.level;
        }
    });

    // Only update if the level actually changed
    if (maxLevel !== gameState.highestDrakeLevel) {
         // Ensure level is within bounds of defined levels before trying to get name
        if (maxLevel >= 0 && maxLevel < config.DRAKE_LEVELS.length) {
             if(maxLevel > gameState.highestDrakeLevel) {
                ui.showMessage(`New highest drake achieved: ${config.DRAKE_LEVELS[maxLevel].name} (Lvl ${maxLevel})!`, 3500);
             }
             gameState.highestDrakeLevel = maxLevel;
             ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
        } else if (maxLevel === -1) { // Handle case where grid becomes empty
             gameState.highestDrakeLevel = -1;
             ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
        } else {
             console.warn(`Calculated maxLevel ${maxLevel} is out of bounds.`);
             // Optionally set to known max or keep previous highest
             gameState.highestDrakeLevel = Math.min(maxLevel, config.MAX_DRAKE_LEVEL);
              ui.updateHighestDrakeDisplay(gameState.highestDrakeLevel);
        }
    }
}


// --- Save/Load/Delete ---
export function handleSave() {
    // Use the new save key
    if (saveLoad.saveGame(gameState, config.SAVE_KEY)) {
        ui.showMessage("Game Saved!", 2000);
    } else {
        ui.showMessage("Failed to save game!", 3000);
    }
}

export function handleLoad() {
    clearInterval(passiveIncomeInterval); // Stop income before potential state change
    passiveIncomeInterval = null;

    initGame(true); // Re-initialize, attempting load with the new save key

     // Check if load was successful (e.g., resources != default) - slightly indirect check
     if(saveLoad.hasSaveData(config.SAVE_KEY) && gameState.resources !== getDefaultGameState().resources){
        ui.showMessage("Game Loaded!", 2000);
     } else if (saveLoad.hasSaveData(config.SAVE_KEY)) {
         // Loaded data might have been minimal or matched default
         ui.showMessage("Loaded save data.", 2000);
     }
     else {
        ui.showMessage("No save data found. Started new game.", 3000);
     }
}

export function handleDelete() {
    if (confirm("Are you sure you want to delete your saved game? This cannot be undone.")) {
        // Use the new save key
        if (saveLoad.deleteSave(config.SAVE_KEY)) {
            ui.showMessage("Save data deleted.", 2000);
            // Optionally reset the current game state to default immediately
            clearInterval(passiveIncomeInterval); passiveIncomeInterval = null;
            initGame(false); // Re-initialize without loading
        } else {
            ui.showMessage("Failed to delete save data.", 3000);
        }
    }
}

// --- Drag and Drop Logic Handling ---
// Mostly unchanged, but ensure drake objects passed around are the new complex ones

export function handleDragStart(event, index) {
    const drakeEl = event.target.closest('.drake'); // Ensure targeting the main drake container
    if (!drakeEl) return;

    const drakeData = grid.getDrakeAt(index);
    if (!drakeData) return;

    ui.setDraggedElement(drakeEl, index);
    // Use drake ID for data transfer - good practice
    event.dataTransfer.setData('text/plain', drakeData.id.toString());
    event.dataTransfer.effectAllowed = 'move';
}

export function handleDragEnd() {
    ui.clearDraggedElement();
    ui.removeAllDragOverHighlights();
}

export function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const targetSlot = event.target.closest('.grid-slot');
    if (targetSlot) {
        ui.removeAllDragOverHighlights();
        ui.addDragOverHighlight(targetSlot);
    }
}

export function handleDragLeave(event) {
     const targetSlot = event.target.closest('.grid-slot');
     if(targetSlot){
        if (!targetSlot.contains(event.relatedTarget)) {
            ui.removeDragOverHighlight(targetSlot);
        }
     } else {
         // If leaving the grid entirely while over empty space
         ui.removeAllDragOverHighlights();
     }
}

export function handleDrop(event) {
    event.preventDefault();
    ui.removeAllDragOverHighlights();

    const fromIndex = ui.getDraggedIndex();
    if (fromIndex === -1) return;

    const targetSlot = event.target.closest('.grid-slot');
    if (!targetSlot) return; // Dropped outside a valid slot

    const toIndex = parseInt(targetSlot.dataset.index, 10);
    if (isNaN(toIndex)) return; // Invalid index

    const drakeAtTarget = grid.getDrakeAt(toIndex);

    if (drakeAtTarget !== null) {
        // Target slot is occupied - attempt merge
        attemptMerge(fromIndex, toIndex);
    } else {
        // Target slot is empty - move drake
        const moveResult = grid.moveDrake(fromIndex, toIndex);
        if (moveResult && moveResult.moved) {
             gameState.gridSlots = grid.getGridSlots(); // Update state
             ui.renderGrid(gameState.gridSlots); // Re-render
             // ui.showMessage("Drake moved.", 1500); // Optional message for move
        }
    }
    // DragEnd handler clears dragging state
}

// --- Click Handling for Drake Details ---
// This function will be passed to ui.js during init
export function handleDrakeClick(index) {
    const drakeData = grid.getDrakeAt(index);
    if (drakeData) {
        console.log(`Clicked on drake at index ${index}:`, drakeData);
        ui.showDrakeDetails(drakeData); // Tell UI module to show details
    } else {
        // Clicked on an empty slot or something went wrong
        ui.hideDrakeDetails(); // Hide details if showing
    }
}


// --- END OF FILE game.js ---