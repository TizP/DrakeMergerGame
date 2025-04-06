// --- START OF FILE grid.js ---

import { GRID_SIZE } from './config.js';

let gridSlots = Array(GRID_SIZE).fill(null);

export function initGrid(loadedSlots = null) {
    if (loadedSlots?.length === GRID_SIZE) { // Simpler check
        gridSlots = [...loadedSlots];
        // console.log("Grid initialized with loaded data.");
    } else {
        gridSlots = Array(GRID_SIZE).fill(null);
        if (loadedSlots) console.warn("Loaded grid data invalid, initializing empty grid.");
        // else console.log("Grid initialized empty.");
    }
}
export function getGridSlots() { return [...gridSlots]; }
export function findEmptySlot() { return gridSlots.findIndex(slot => slot === null); }
export function isGridFull() { return findEmptySlot() === -1; }
export function placeDrake(drake, index) {
    if (index >= 0 && index < GRID_SIZE && gridSlots[index] === null) {
        gridSlots[index] = drake; return true;
    }
    console.warn(`Failed to place drake at grid index ${index}.`); return false;
}
export function removeDrake(index) {
    if (index >= 0 && index < GRID_SIZE) {
        const removedDrake = gridSlots[index]; gridSlots[index] = null; return removedDrake;
    }
    return null;
}
export function getDrakeAt(index) { if (index >= 0 && index < GRID_SIZE) return gridSlots[index]; return null; }
export function moveDrake(fromIndex, toIndex) {
    if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= GRID_SIZE || toIndex < 0 || toIndex >= GRID_SIZE) return { moved: false };
    const drakeToMove = gridSlots[fromIndex];
    if (!drakeToMove || gridSlots[toIndex] !== null) {
        if (gridSlots[toIndex] !== null) console.log(`Move fail: Target ${toIndex} occupied.`);
        return { moved: false };
    }
    gridSlots[toIndex] = drakeToMove; gridSlots[fromIndex] = null; return { moved: true };
}

// --- END OF FILE grid.js ---