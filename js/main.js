// --- START OF FILE main.js ---

import * as game from './game.js';
import * as ui from './ui.js';
import * as saveLoad from './saveLoad.js';
import * as audio from './audio.js';
import * as tutorial from './tutorial.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Initializing (V2 - Combat Update)...");

    ui.initUI(
        game.buyDrake,
        game.handleDragStart,
        game.handleDragEnd,
        game.handleDrop,
        null, // dragOver ignored
        null, // dragLeave ignored
        game.handleDrakeClick,
        game.toggleCombat,
        game.removeDrakeFromCombatTeam
    );

    audio.initAudio();
    tutorial.initTutorial();
    game.initGame(); // Handles load & initial UI

    // Connect OTHER buttons
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const deleteSaveBtn = document.getElementById('delete-save-btn');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const creditsBox = document.getElementById('credits-box');

    saveBtn?.addEventListener('click', game.handleSave);
    loadBtn?.addEventListener('click', game.handleLoad);
    deleteSaveBtn?.addEventListener('click', game.handleDelete);
    musicToggleBtn?.addEventListener('click', () => { audio.toggleMusic(); ui.updateMusicButtonText(audio.isAudioPlaying()); });
    tutorialBtn?.addEventListener('click', () => tutorial?.startTutorial?.()); // Safe call
    creditsBtn?.addEventListener('click', () => creditsBox?.classList.remove('hidden'));
    // Modal close buttons handled in ui.js

    console.log("Initialization complete (V2 - Combat). Game running.");
});
// --- END OF FILE main.js ---