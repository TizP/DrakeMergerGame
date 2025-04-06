import { GRID_SIZE } from './config.js';

let gridSlots = Array(GRID_SIZE).fill(null); // Represents the state of the grid

export function initGrid(loadedSlots = null) {
    if (loadedSlots && loadedSlots.length === GRID_SIZE) {
        // Deep copy might be needed if drakes are complex objects, but here null/simple objects are fine
        gridSlots = [...loadedSlots];
    } else {
        gridSlots = Array(GRID_SIZE).fill(null);
    }
}

export function getGridSlots() {
    return [...gridSlots]; // Return a copy to prevent direct modification
}

export function findEmptySlot() {
    return gridSlots.findIndex(slot => slot === null);
}

export function isGridFull() {
    return findEmptySlot() === -1;
}

export function placeDrake(drake, index) {
    if (index >= 0 && index < GRID_SIZE && gridSlots[index] === null) {
        gridSlots[index] = drake;
        return true;
    }
    console.warn(`Failed to place drake at index ${index}. Slot occupied or invalid.`);
    return false;
}

export function removeDrake(index) {
    if (index >= 0 && index < GRID_SIZE) {
        const removedDrake = gridSlots[index];
        gridSlots[index] = null;
        return removedDrake; // Return the drake that was removed (or null)
    }
    return null;
}

export function getDrakeAt(index) {
    if (index >= 0 && index < GRID_SIZE) {
        return gridSlots[index];
    }
    return null;
}

export function moveDrake(fromIndex, toIndex) {
    if (fromIndex === toIndex) return false; // No move needed
    if (fromIndex < 0 || fromIndex >= GRID_SIZE || toIndex < 0 || toIndex >= GRID_SIZE) return false;

    const drakeToMove = gridSlots[fromIndex];
    const targetContent = gridSlots[toIndex];

    if (!drakeToMove) return false; // Trying to move nothing

    // Simple move to empty slot
    if (targetContent === null) {
        gridSlots[toIndex] = drakeToMove;
        gridSlots[fromIndex] = null;
        return { moved: true, merged: false, fromIndex, toIndex };
    }
    // Potential merge condition handled by game.js merge logic
    else {
         // Cannot move onto an occupied slot (merge logic is separate)
         console.log("Target slot occupied. Merge attempt needed.");
         return { moved: false, merged: false }; // Indicate no move occurred here
    }
}

// Helper to find the highest drake ID currently on the grid (used for save/load)
export function getHighestDrakeIdOnGrid() {
    let maxId = -1;
    gridSlots.forEach(drake => {
        if (drake && drake.id > maxId) {
            maxId = drake.id;
        }
    });
    return maxId;
}