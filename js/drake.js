// --- START OF FILE drake.js ---

import {
    DRAKE_LEVELS,
    RARITY_LEVELS,
    ELEMENTS,
    ELEMENT_KEYS,
    // STAT_RANGES, // <<--- REMOVE THIS LINE ---<<
    getRandomRarity,
    getStatRangeForLevel, // We use this helper instead of STAT_RANGES directly
    randomInRange
} from './config.js';

let nextDrakeId = 0;

// Creates a *new* drake instance with generated stats, rarity, element
export function createDrake(level) {
    if (level < 0 || level >= DRAKE_LEVELS.length) {
        console.error(`Invalid drake level requested: ${level}`);
        return null;
    }
    const baseData = DRAKE_LEVELS[level];
    if (!baseData) {
        console.error(`Could not find base data for drake level: ${level}`);
        return null;
    }

    // 1. Determine Rarity
    const rarityKey = getRandomRarity();
    const rarityData = RARITY_LEVELS[rarityKey];

    // 2. Determine Element
    const elementKey = ELEMENT_KEYS[randomInRange(0, ELEMENT_KEYS.length - 1)];
    const elementData = ELEMENTS[elementKey];

    // 3. Generate Stats (using the helper function from config)
    const stats = generateStats(level, rarityData);

    // 4. Generate Potential (based on rarity)
    const potential = randomInRange(rarityData.potentialRange[0], rarityData.potentialRange[1]);

    // 5. Final Drake Object
    const newDrake = {
        id: nextDrakeId++,
        level: level,
        name: baseData.name,
        imageSrc: baseData.imageSrc,
        rarity: rarityKey,
        rarityClass: rarityData.colorClass,
        element: elementKey,
        elementIcon: elementData.icon,
        stats: stats,
        potential: potential,
        passiveIncomeBase: baseData.passiveIncomeBase * (elementData.incomeMod || 1.0),
    };

    return newDrake;
}

// Generates stats for a new drake based on level and rarity
function generateStats(level, rarityData) {
    const levelScaleMultiplier = 1 + (level * 0.5) + (level * level * 0.1);
    const baseStatValue = 5 * levelScaleMultiplier;
    const statRange = getStatRangeForLevel(level); // Use the helper function

    const stats = {
        str: Math.round((baseStatValue + randomInRange(statRange.str[0], statRange.str[1])) * rarityData.statMultiplier),
        vit: Math.round((baseStatValue + randomInRange(statRange.vit[0], statRange.vit[1])) * rarityData.statMultiplier),
        agi: Math.round((baseStatValue + randomInRange(statRange.agi[0], statRange.agi[1])) * rarityData.statMultiplier),
        foc: Math.round((baseStatValue + randomInRange(statRange.foc[0], statRange.foc[1])) * rarityData.statMultiplier),
    };

    stats.str = Math.max(1, stats.str);
    stats.vit = Math.max(1, stats.vit);
    stats.agi = Math.max(1, stats.agi);
    stats.foc = Math.max(0, stats.foc);

    return stats;
}


// Calculates the properties of a drake resulting from merging two parents
export function calculateMergedDrakeStats(parent1, parent2) {
    if (!parent1 || !parent2 || parent1.level !== parent2.level) {
        console.error("Invalid parents for merge calculation.");
        return null;
    }

    const currentLevel = parent1.level;
    const nextLevel = currentLevel + 1;

    if (nextLevel >= DRAKE_LEVELS.length) {
        return null;
    }
    const baseData = DRAKE_LEVELS[nextLevel];

    // 1. Determine Merged Rarity
    const rarityKeys = Object.keys(RARITY_LEVELS);
    const p1RarityIndex = rarityKeys.indexOf(parent1.rarity);
    const p2RarityIndex = rarityKeys.indexOf(parent2.rarity);
    let mergedRarityIndex = Math.max(p1RarityIndex, p2RarityIndex);
    if (Math.random() < 0.10 && mergedRarityIndex < rarityKeys.length - 1) {
        mergedRarityIndex++;
    }
    const mergedRarityKey = rarityKeys[mergedRarityIndex];
    const mergedRarityData = RARITY_LEVELS[mergedRarityKey];

    // 2. Determine Merged Element
    const mergedElementKey = parent1.element; // Inherit element from parent1
    const mergedElementData = ELEMENTS[mergedElementKey];

    // 3. Calculate Merged Potential
    const mergedPotential = Math.round((parent1.potential + parent2.potential) / 2) + randomInRange(0, 1);

    // 4. Calculate Merged Base Stats
    const mergedStats = {
        str: Math.round(((parent1.stats.str + parent2.stats.str) / 2) + (parent1.potential + parent2.potential) * 0.5),
        vit: Math.round(((parent1.stats.vit + parent2.stats.vit) / 2) + (parent1.potential + parent2.potential) * 0.5),
        agi: Math.round(((parent1.stats.agi + parent2.stats.agi) / 2) + (parent1.potential + parent2.potential) * 0.25),
        foc: Math.round(((parent1.stats.foc + parent2.stats.foc) / 2) + (parent1.potential + parent2.potential) * 0.75),
    };

     // Apply merged rarity multiplier after averaging
     mergedStats.str = Math.round(mergedStats.str * mergedRarityData.statMultiplier * 0.9);
     mergedStats.vit = Math.round(mergedStats.vit * mergedRarityData.statMultiplier * 0.9);
     mergedStats.agi = Math.round(mergedStats.agi * mergedRarityData.statMultiplier * 0.9);
     mergedStats.foc = Math.round(mergedStats.foc * mergedRarityData.statMultiplier * 0.9);

    // Ensure stats are at least 1
    mergedStats.str = Math.max(1, mergedStats.str);
    mergedStats.vit = Math.max(1, mergedStats.vit);
    mergedStats.agi = Math.max(1, mergedStats.agi);
    mergedStats.foc = Math.max(0, mergedStats.foc);

    // 5. Construct the new drake object data directly
    const mergedDrake = {
        id: nextDrakeId++,
        level: nextLevel,
        name: baseData.name,
        imageSrc: baseData.imageSrc,
        rarity: mergedRarityKey,
        rarityClass: mergedRarityData.colorClass,
        element: mergedElementKey,
        elementIcon: mergedElementData.icon,
        stats: mergedStats,
        potential: mergedPotential,
        passiveIncomeBase: baseData.passiveIncomeBase * (mergedElementData.incomeMod || 1.0),
    };

    return mergedDrake;
}


// Kept for potential use, but less useful now details are per-instance
export function getDrakeDetails(level) {
     if (level < 0 || level >= DRAKE_LEVELS.length) return null;
     return DRAKE_LEVELS[level]; // Returns only base name, image, base income
}

// Reset ID counter
export function resetDrakeIdCounter(highestId = -1) {
    console.log(`Resetting drake ID counter. Highest found ID: ${highestId}`);
    nextDrakeId = Math.max(0, highestId + 1);
    console.log(`Next drake ID set to: ${nextDrakeId}`);
}

// --- END OF FILE drake.js ---