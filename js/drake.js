// --- START OF FILE drake.js ---

import { DRAKE_LEVELS } from './config.js';

let nextDrakeId = 0;

// --- MODIFIED createDrake function ---
export function createDrake(level) {
    if (level < 0 || level >= DRAKE_LEVELS.length) {
        console.error(`Invalid drake level requested: ${level}`);
        return null;
    }
    // Get the configuration data for the requested level
    const drakeData = DRAKE_LEVELS[level];

    // Check if drakeData and its imageSrc exist, provide a fallback or warning
    if (!drakeData) {
        console.error(`Could not find drake data for level: ${level}`);
        return null;
    }
    // Optional: Check specifically for imageSrc if you want stricter checks
    // if (!drakeData.imageSrc) {
    //     console.warn(`Missing imageSrc in config.js for drake level: ${level}`);
    // }


    // Create the new drake object, copying all necessary properties
    return {
        id: nextDrakeId++, // Unique ID
        level: level,
        name: drakeData.name,
        colorClass: drakeData.colorClass,
        passiveIncome: drakeData.passiveIncome,
        imageSrc: drakeData.imageSrc // <-- ADDED THIS LINE
    };
}
// --- END OF MODIFIED createDrake ---


// Function to get details (like name) without creating a full drake instance
export function getDrakeDetails(level) {
     if (level < 0 || level >= DRAKE_LEVELS.length) return null;
     // Return the config entry directly, which now includes imageSrc
     return DRAKE_LEVELS[level];
}

// Call this when loading a game to avoid ID collisions
export function resetDrakeIdCounter(highestId = 0) {
    // Ensure the counter starts above the highest loaded ID
    nextDrakeId = Math.max(nextDrakeId, highestId + 1);
}

// --- END OF FILE drake.js ---