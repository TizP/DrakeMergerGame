// --- START OF FILE config.js ---

export const GRID_ROWS = 4;
export const GRID_COLS = 4;
export const GRID_SIZE = GRID_ROWS * GRID_COLS;
export const BASE_DRAKE_COST = 10;
export const SAVE_KEY = 'drakeMergerSaveData_v2'; // Changed save key for new structure

// --- RPG Elements Configuration ---

export const RARITY_LEVELS = {
    COMMON:    { name: 'Common',    chance: 0.70, colorClass: 'rarity-common',    statMultiplier: 1.0, potentialRange: [1, 3] },
    UNCOMMON:  { name: 'Uncommon',  chance: 0.20, colorClass: 'rarity-uncommon',  statMultiplier: 1.1, potentialRange: [2, 4] },
    RARE:      { name: 'Rare',      chance: 0.08, colorClass: 'rarity-rare',      statMultiplier: 1.3, potentialRange: [3, 6] },
    EPIC:      { name: 'Epic',      chance: 0.02, colorClass: 'rarity-epic',      statMultiplier: 1.6, potentialRange: [5, 8] },
    // LEGENDARY: { name: 'Legendary', chance: 0.00, colorClass: 'rarity-legendary', statMultiplier: 2.0, potentialRange: [7, 10] } // Example for future
};

// Helper function to get rarity based on a random roll
export function getRandomRarity() {
    const roll = Math.random();
    let cumulativeChance = 0;
    for (const key in RARITY_LEVELS) {
        const rarity = RARITY_LEVELS[key];
        cumulativeChance += rarity.chance;
        if (roll < cumulativeChance) {
            return key; // Return the key (e.g., 'COMMON', 'RARE')
        }
    }
    return 'COMMON'; // Fallback
}

export const ELEMENTS = {
    FIRE:   { name: 'Fire',   icon: '🔥', incomeMod: 1.0 },
    WATER:  { name: 'Water',  icon: '💧', incomeMod: 1.0 },
    EARTH:  { name: 'Earth',  icon: '🌍', incomeMod: 1.1 }, // Earth slightly better income
    AIR:    { name: 'Air',    icon: '💨', incomeMod: 0.9 }, // Air slightly lower income
    SPIRIT: { name: 'Spirit', icon: '✨', incomeMod: 1.0 },
    SHADOW: { name: 'Shadow', icon: '💀', incomeMod: 1.0 },
};
export const ELEMENT_KEYS = Object.keys(ELEMENTS); // Get keys for random selection

// Base stat ranges per level (adjust these significantly for balance)
// These are *added* to a base value determined by level in drake.js
const STAT_RANGES = {
    level_0: { str: [0, 0], vit: [1, 1], agi: [0, 0], foc: [0, 0] }, // Eggs have fixed vitality maybe
    level_1: { str: [1, 3], vit: [2, 4], agi: [1, 2], foc: [1, 1] },
    level_2: { str: [2, 5], vit: [3, 6], agi: [1, 3], foc: [2, 3] },
    level_3: { str: [4, 8], vit: [5, 10], agi: [2, 4], foc: [3, 5] },
    level_4: { str: [7, 12], vit: [8, 15], agi: [3, 6], foc: [5, 8] },
    level_5: { str: [10, 18], vit: [12, 22], agi: [4, 8], foc: [8, 13] },
    level_6: { str: [15, 25], vit: [18, 30], agi: [6, 10], foc: [12, 20] },
    level_7: { str: [22, 35], vit: [25, 40], agi: [8, 14], foc: [18, 30] },
    // Add ranges for future levels
};

// Helper to get stat range for a level, with fallback
export function getStatRangeForLevel(level) {
    return STAT_RANGES[`level_${level}`] || STAT_RANGES.level_1; // Fallback to level 1 range if undefined
}

// Helper function for random number in range (inclusive)
export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Original Drake Level Data (Simplified) ---
// We mostly care about Name and Image now. Passive income base is modified by Focus.
// Color class removed as rarity will handle primary visual distinction.
export const DRAKE_LEVELS = [
    // Level 0
    { name: 'Egg',       passiveIncomeBase: 0,    imageSrc: 'images/egg.png' },
    // Level 1
    { name: 'Hatchling', passiveIncomeBase: 1,    imageSrc: 'images/hatchling.png' },
    // Level 2
    { name: 'Whelp',     passiveIncomeBase: 5,    imageSrc: 'images/whelp.png' },
    // Level 3
    { name: 'Juvenile',  passiveIncomeBase: 20,   imageSrc: 'images/juvenile.png' },
    // Level 4
    { name: 'Adult',     passiveIncomeBase: 80,   imageSrc: 'images/adult.png' },
    // Level 5
    { name: 'Elder',     passiveIncomeBase: 300,  imageSrc: 'images/elder.png' },
    // Level 6
    { name: 'Ancient',   passiveIncomeBase: 1200, imageSrc: 'images/ancient.png' },
     // Level 7
    { name: 'Mythic',    passiveIncomeBase: 5000, imageSrc: 'images/mythic.png' },
    // Add more levels (just name, base income, image)
];

export const MAX_DRAKE_LEVEL = DRAKE_LEVELS.length - 1;

// Time in milliseconds for passive income generation
export const INCOME_INTERVAL = 1000; // 1 second

// --- END OF FILE config.js ---