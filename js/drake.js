// --- START OF FILE drake.js ---

import { DRAKE_LEVELS, RARITY_LEVELS, ELEMENTS, ELEMENT_KEYS, getRandomRarity, getStatRangeForLevel, randomInRange } from './config.js';

let nextDrakeId = 0;

export function createDrake(level) {
    if (level < 0 || level >= DRAKE_LEVELS.length) { console.error(`Invalid level: ${level}`); return null; }
    const baseData = DRAKE_LEVELS[level]; if (!baseData) { console.error(`No base data for level: ${level}`); return null; }
    const rarityKey = getRandomRarity(); const rarityData = RARITY_LEVELS[rarityKey];
    const elementKey = ELEMENT_KEYS[randomInRange(0, ELEMENT_KEYS.length - 1)]; const elementData = ELEMENTS[elementKey];
    const stats = generateStats(level, rarityData);
    const potential = randomInRange(rarityData.potentialRange[0], rarityData.potentialRange[1]);
    const newDrake = { id: nextDrakeId++, level: level, name: baseData.name, imageSrc: baseData.imageSrc, rarity: rarityKey, rarityClass: rarityData.colorClass, element: elementKey, elementIcon: elementData.icon, stats: stats, potential: potential, passiveIncomeBase: baseData.passiveIncomeBase * (elementData.incomeMod || 1.0), };
    return newDrake;
}

function generateStats(level, rarityData) {
    const levelScaleMultiplier = 1 + (level * 0.5) + (level * level * 0.1);
    const baseStatValue = 5 * levelScaleMultiplier;
    const statRange = getStatRangeForLevel(level);
    const stats = { str: Math.round((baseStatValue + randomInRange(statRange.str[0], statRange.str[1])) * rarityData.statMultiplier), vit: Math.round((baseStatValue + randomInRange(statRange.vit[0], statRange.vit[1])) * rarityData.statMultiplier), agi: Math.round((baseStatValue + randomInRange(statRange.agi[0], statRange.agi[1])) * rarityData.statMultiplier), foc: Math.round((baseStatValue + randomInRange(statRange.foc[0], statRange.foc[1])) * rarityData.statMultiplier), };
    stats.str = Math.max(1, stats.str || 1); stats.vit = Math.max(1, stats.vit || 1); stats.agi = Math.max(1, stats.agi || 1); stats.foc = Math.max(0, stats.foc || 0);
    return stats;
}

export function calculateMergedDrakeStats(parent1, parent2) {
    if (!parent1 || !parent2 || parent1.level !== parent2.level) { console.error("Invalid parents for merge."); return null; }
    const currentLevel = parent1.level; const nextLevel = currentLevel + 1;
    if (nextLevel >= DRAKE_LEVELS.length) { return null; }
    const baseData = DRAKE_LEVELS[nextLevel];
    const rarityKeys = Object.keys(RARITY_LEVELS); const p1RarityIndex = rarityKeys.indexOf(parent1.rarity); const p2RarityIndex = rarityKeys.indexOf(parent2.rarity); let mergedRarityIndex = Math.max(p1RarityIndex, p2RarityIndex); if (Math.random() < 0.10 && mergedRarityIndex < rarityKeys.length - 1) { mergedRarityIndex++; } const mergedRarityKey = rarityKeys[mergedRarityIndex]; const mergedRarityData = RARITY_LEVELS[mergedRarityKey];
    const mergedElementKey = parent1.element; const mergedElementData = ELEMENTS[mergedElementKey];
    const mergedPotential = Math.round((parent1.potential + parent2.potential) / 2) + randomInRange(0, 1);
    const potentialBonusMultiplier = 0.5;
    const mergedStats = { str: Math.round(((parent1.stats.str + parent2.stats.str) / 2) + (parent1.potential + parent2.potential) * potentialBonusMultiplier), vit: Math.round(((parent1.stats.vit + parent2.stats.vit) / 2) + (parent1.potential + parent2.potential) * potentialBonusMultiplier), agi: Math.round(((parent1.stats.agi + parent2.stats.agi) / 2) + (parent1.potential + parent2.potential) * potentialBonusMultiplier * 0.75), foc: Math.round(((parent1.stats.foc + parent2.stats.foc) / 2) + (parent1.potential + parent2.potential) * potentialBonusMultiplier * 1.25), };
    const mergeRarityFactor = 0.95;
    mergedStats.str = Math.round(mergedStats.str * mergedRarityData.statMultiplier * mergeRarityFactor); mergedStats.vit = Math.round(mergedStats.vit * mergedRarityData.statMultiplier * mergeRarityFactor); mergedStats.agi = Math.round(mergedStats.agi * mergedRarityData.statMultiplier * mergeRarityFactor); mergedStats.foc = Math.round(mergedStats.foc * mergedRarityData.statMultiplier * mergeRarityFactor);
    mergedStats.str = Math.max(1, mergedStats.str || 1); mergedStats.vit = Math.max(1, mergedStats.vit || 1); mergedStats.agi = Math.max(1, mergedStats.agi || 1); mergedStats.foc = Math.max(0, mergedStats.foc || 0);
    const mergedDrake = { id: nextDrakeId++, level: nextLevel, name: baseData.name, imageSrc: baseData.imageSrc, rarity: mergedRarityKey, rarityClass: mergedRarityData.colorClass, element: mergedElementKey, elementIcon: mergedElementData.icon, stats: mergedStats, potential: mergedPotential, passiveIncomeBase: baseData.passiveIncomeBase * (mergedElementData.incomeMod || 1.0), };
    return mergedDrake;
}

export function getDrakeDetails(level) { if (level < 0 || level >= DRAKE_LEVELS.length) return null; return DRAKE_LEVELS[level]; }
export function resetDrakeIdCounter(highestId = -1) { console.log(`Resetting drake ID counter. Highest: ${highestId}`); nextDrakeId = Math.max(0, highestId + 1); console.log(`Next ID: ${nextDrakeId}`); }

// --- END OF FILE drake.js ---