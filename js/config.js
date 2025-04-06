// --- START OF FILE config.js ---

export const GRID_ROWS = 4; export const GRID_COLS = 4; export const GRID_SIZE = GRID_ROWS * GRID_COLS;
export const BASE_DRAKE_COST = 10; export const SAVE_KEY = 'drakeMergerSaveData_v2';

export const RARITY_LEVELS = { COMMON: { name: 'Common', chance: 0.70, colorClass: 'rarity-common', statMultiplier: 1.0, potentialRange: [1, 3] }, UNCOMMON: { name: 'Uncommon', chance: 0.20, colorClass: 'rarity-uncommon', statMultiplier: 1.1, potentialRange: [2, 4] }, RARE: { name: 'Rare', chance: 0.08, colorClass: 'rarity-rare', statMultiplier: 1.3, potentialRange: [3, 6] }, EPIC: { name: 'Epic', chance: 0.02, colorClass: 'rarity-epic', statMultiplier: 1.6, potentialRange: [5, 8] }, };
export function getRandomRarity() { const roll = Math.random(); let cumulativeChance = 0; for (const key in RARITY_LEVELS) { const rarity = RARITY_LEVELS[key]; cumulativeChance += rarity.chance; if (roll < cumulativeChance) return key; } return 'COMMON'; }
export const ELEMENTS = { FIRE: { name: 'Fire', icon: '🔥', incomeMod: 1.0 }, WATER: { name: 'Water', icon: '💧', incomeMod: 1.0 }, EARTH: { name: 'Earth', icon: '🌍', incomeMod: 1.1 }, AIR: { name: 'Air', icon: '💨', incomeMod: 0.9 }, SPIRIT: { name: 'Spirit', icon: '✨', incomeMod: 1.0 }, SHADOW: { name: 'Shadow', icon: '💀', incomeMod: 1.0 }, };
export const ELEMENT_KEYS = Object.keys(ELEMENTS);
const STAT_RANGES = { level_0: { str: [0, 0], vit: [1, 1], agi: [0, 0], foc: [0, 0] }, level_1: { str: [1, 3], vit: [2, 4], agi: [1, 2], foc: [1, 1] }, level_2: { str: [2, 5], vit: [3, 6], agi: [1, 3], foc: [2, 3] }, level_3: { str: [4, 8], vit: [5, 10], agi: [2, 4], foc: [3, 5] }, level_4: { str: [7, 12], vit: [8, 15], agi: [3, 6], foc: [5, 8] }, level_5: { str: [10, 18], vit: [12, 22], agi: [4, 8], foc: [8, 13] }, level_6: { str: [15, 25], vit: [18, 30], agi: [6, 10], foc: [12, 20] }, level_7: { str: [22, 35], vit: [25, 40], agi: [8, 14], foc: [18, 30] }, };
export function getStatRangeForLevel(level) { return STAT_RANGES[`level_${level}`] || STAT_RANGES.level_1; }
export function randomInRange(min, max) { const rMin = Math.min(min, max); const rMax = Math.max(min, max); return Math.floor(Math.random() * (rMax - rMin + 1)) + rMin; }
export const DRAKE_LEVELS = [ { name: 'Egg', passiveIncomeBase: 0, imageSrc: 'images/egg.png' }, { name: 'Hatchling', passiveIncomeBase: 1, imageSrc: 'images/hatchling.png' }, { name: 'Whelp', passiveIncomeBase: 5, imageSrc: 'images/whelp.png' }, { name: 'Juvenile', passiveIncomeBase: 20, imageSrc: 'images/juvenile.png' }, { name: 'Adult', passiveIncomeBase: 80, imageSrc: 'images/adult.png' }, { name: 'Elder', passiveIncomeBase: 300, imageSrc: 'images/elder.png' }, { name: 'Ancient', passiveIncomeBase: 1200, imageSrc: 'images/ancient.png' }, { name: 'Mythic', passiveIncomeBase: 5000, imageSrc: 'images/mythic.png' }, ];
export const MAX_DRAKE_LEVEL = DRAKE_LEVELS.length - 1;
export const INCOME_INTERVAL = 1000;
export const COMBAT_TEAM_SIZE = 3;
export const ENEMIES = [ { id: 'slime', name: "Slime", image: "images/slime.jpeg", elementType: 'WATER', baseHp: 50, baseDefense: 1, baseAttack: 5, rewardEssence: 5, rewardShards: 1 }, { id: 'goblin', name: "Goblin", image: "images/goblin.jpeg", elementType: 'EARTH', baseHp: 80, baseDefense: 3, baseAttack: 8, rewardEssence: 8, rewardShards: 1 }, { id: 'orc', name: "Orc", image: "images/orc.jpeg", elementType: 'FIRE', baseHp: 150, baseDefense: 5, baseAttack: 12, rewardEssence: 15, rewardShards: 2 }, { id: 'golem', name: "Golem", image: "images/golem.jpeg", elementType: 'EARTH', baseHp: 250, baseDefense: 8, baseAttack: 10, rewardEssence: 25, rewardShards: 3 }, { id: 'imp', name: "Imp", image: "images/imp.jpeg", elementType: 'SHADOW', baseHp: 120, baseDefense: 4, baseAttack: 15, rewardEssence: 20, rewardShards: 2 }, ];
export const ENEMY_SCALING = { hpMultiplier: 1.15, defenseMultiplier: 1.08, attackMultiplier: 1.10, rewardMultiplier: 1.1 };
export const ELEMENTAL_CHART = { FIRE: { WATER: 0.5, EARTH: 1.5, FIRE: 1.0, AIR: 1.0, SPIRIT: 1.0, SHADOW: 1.0 }, WATER: { FIRE: 1.5, EARTH: 0.5, WATER: 1.0, AIR: 1.0, SPIRIT: 1.0, SHADOW: 1.0 }, EARTH: { AIR: 1.5, WATER: 0.5, FIRE: 0.5, EARTH: 1.0, SPIRIT: 1.0, SHADOW: 1.0 }, AIR: { EARTH: 1.5, FIRE: 1.0, WATER: 1.0, AIR: 1.0, SPIRIT: 1.5, SHADOW: 1.0 }, SPIRIT: { SHADOW: 1.5, AIR: 0.5, FIRE: 1.0, WATER: 1.0, EARTH: 1.0, SPIRIT: 1.0 }, SHADOW: { SPIRIT: 1.5, FIRE: 1.0, WATER: 1.0, EARTH: 1.0, AIR: 1.0, SHADOW: 1.0 }, };
export const BASE_ELEMENTAL_MODIFIER = 1.0;
export const COMBAT_TICK_INTERVAL = 1500; export const ENEMY_ATTACK_TICKS = 2;
export const BASE_CRIT_CHANCE = 0.05; export const AGILITY_CRIT_SCALING = 0.001; export const CRIT_DAMAGE_MULTIPLIER = 1.5;
export const BASE_DODGE_CHANCE = 0.02; export const AGILITY_DODGE_SCALING = 0.0008;
export const VITALITY_HP_MULTIPLIER = 5; export const BASE_DRAKE_HP = 20;
export const RESOURCE_ESSENCE = 'Drake Essence'; export const RESOURCE_SHARDS = 'Shards';

// --- END OF FILE config.js ---