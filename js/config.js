// --- START OF FILE config.js ---

export const GRID_ROWS = 4;
export const GRID_COLS = 4;
export const GRID_SIZE = GRID_ROWS * GRID_COLS;
export const BASE_DRAKE_COST = 10;
export const SAVE_KEY = 'drakeMergerSaveData';

export const DRAKE_LEVELS = [
    // Level 0
    { name: 'Egg', cost: BASE_DRAKE_COST, colorClass: 'drake-level-0', passiveIncome: 0, imageSrc: 'images/egg.png' }, // <-- ADD imageSrc
    // Level 1
    { name: 'Hatchling', cost: 0, colorClass: 'drake-level-1', passiveIncome: 1, imageSrc: 'images/hatchling.png' }, // <-- ADD imageSrc
    // Level 2
    { name: 'Whelp', cost: 0, colorClass: 'drake-level-2', passiveIncome: 5, imageSrc: 'images/whelp.png' },       // <-- ADD imageSrc
    // Level 3
    { name: 'Juvenile', cost: 0, colorClass: 'drake-level-3', passiveIncome: 20, imageSrc: 'images/juvenile.png' }, // <-- ADD imageSrc
    // Level 4
    { name: 'Adult', cost: 0, colorClass: 'drake-level-4', passiveIncome: 80, imageSrc: 'images/adult.png' },     // <-- ADD imageSrc
    // Level 5
    { name: 'Elder', cost: 0, colorClass: 'drake-level-5', passiveIncome: 300, imageSrc: 'images/elder.png' },     // <-- ADD imageSrc
    // Level 6
    { name: 'Ancient', cost: 0, colorClass: 'drake-level-6', passiveIncome: 1200, imageSrc: 'images/ancient.png' },  // <-- ADD imageSrc
     // Level 7
    { name: 'Mythic', cost: 0, colorClass: 'drake-level-7', passiveIncome: 5000, imageSrc: 'images/mythic.png' },   // <-- ADD imageSrc
    // Add more levels as needed, ensuring each has an imageSrc
];

// *** IMPORTANT: Adjust the filenames above (egg.png, hatchling.png, etc.) ***
// *** to match the actual names of your image files in the images folder. ***

export const MAX_DRAKE_LEVEL = DRAKE_LEVELS.length - 1;

// Time in milliseconds for passive income generation
export const INCOME_INTERVAL = 1000; // 1 second

// --- END OF FILE config.js ---