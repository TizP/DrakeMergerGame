import { SAVE_KEY } from './config.js';

export function saveGame(gameState) {
    try {
        const stateString = JSON.stringify(gameState);
        localStorage.setItem(SAVE_KEY, stateString);
        console.log("Game saved successfully.");
        return true;
    } catch (error) {
        console.error("Error saving game:", error);
        return false;
    }
}

export function loadGame() {
    try {
        const stateString = localStorage.getItem(SAVE_KEY);
        if (stateString) {
            const gameState = JSON.parse(stateString);
            console.log("Game loaded successfully.");
            return gameState;
        }
        console.log("No save data found.");
        return null; // Indicate no save found
    } catch (error) {
        console.error("Error loading game:", error);
        // Optionally delete corrupted save data
        // deleteSave();
        return null; // Indicate error or no save
    }
}

export function deleteSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log("Save data deleted.");
        return true;
    } catch (error) {
        console.error("Error deleting save data:", error);
        return false;
    }
}

export function hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
}