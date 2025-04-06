// --- START OF FILE saveLoad.js ---

export function saveGame(gameState,saveKey){if(!gameState||!saveKey){console.error("Save fail: Invalid state/key.");return false;} try{const stateString=JSON.stringify(gameState);localStorage.setItem(saveKey,stateString);console.log(`Saved key: ${saveKey}`);return true;}catch(error){console.error("Save Error:",error);if(error.name==='QuotaExceededError'){alert("Save failed: Storage limit exceeded.");}return false;}}
export function loadGame(saveKey){if(!saveKey){console.error("Load fail: Invalid key.");return null;} try{const stateString=localStorage.getItem(saveKey);if(stateString){const loaded=JSON.parse(stateString);console.log(`Loaded key: ${saveKey}`);return loaded;}console.log(`No save data for key: ${saveKey}`);return null;}catch(error){console.error(`Load Error key ${saveKey}:`,error);return null;}}
export function deleteSave(saveKey){if(!saveKey){console.error("Delete fail: Invalid key.");return false;} try{localStorage.removeItem(saveKey);console.log(`Deleted key: ${saveKey}`);return true;}catch(error){console.error("Delete Error:",error);return false;}}
export function hasSaveData(saveKey){if(!saveKey)return false;return localStorage.getItem(saveKey)!==null;}

// --- END OF FILE saveLoad.js ---