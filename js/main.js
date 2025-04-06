// --- START OF FILE main.js ---

import * as game from './game.js';
import * as ui from './ui.js';
import * as saveLoad from './saveLoad.js';
import * as audio from './audio.js';
import * as tutorial from './tutorial.js';

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Initializing (V2)...");

    // Initialize UI - Pass ALL necessary handlers from game logic
    ui.initUI(
        game.buyDrake,            // Handler for buy button click
        game.handleDragStart,     // Handler for drag start on a drake
        game.handleDragEnd,       // Handler for drag end on a drake
        game.handleDrop,          // Handler for drop on a grid slot
        game.handleDragOver,      // Handler for drag over a grid slot
        game.handleDragLeave,     // Handler for drag leave from a grid slot
        game.handleDrakeClick     // <<-- ADDED: Handler for clicking a drake/slot
    );

    // Initialize other modules
    audio.initAudio();
    tutorial.initTutorial(); // Assumes tutorial.js is compatible or updated separately

    // Initialize Core Game Logic (V2 - attempts to load new save key)
    game.initGame();

    // --- Connect Control Buttons ---
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const deleteSaveBtn = document.getElementById('delete-save-btn');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    const creditsBtn = document.getElementById('credits-btn');
    const creditsBox = document.getElementById('credits-box');
    const creditsCloseBtn = document.getElementById('credits-close-btn');

    // Standard Buttons
    if(saveBtn) saveBtn.addEventListener('click', game.handleSave);
    if(loadBtn) loadBtn.addEventListener('click', game.handleLoad);
    if(deleteSaveBtn) deleteSaveBtn.addEventListener('click', game.handleDelete);

    if(musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            audio.toggleMusic();
            ui.updateMusicButtonText(audio.isAudioPlaying());
        });
        ui.updateMusicButtonText(audio.isAudioPlaying()); // Set initial text
    }

    if(tutorialBtn) tutorialBtn.addEventListener('click', tutorial.startTutorial);

    // Credits Button Listeners
    if (creditsBtn && creditsBox && creditsCloseBtn) {
        creditsBtn.addEventListener('click', () => {
            creditsBox.classList.remove('hidden');
        });
        creditsCloseBtn.addEventListener('click', () => {
            creditsBox.classList.add('hidden');
        });
    } else {
        console.error("Error setting up Credits button: Elements not found.", { creditsBtn, creditsBox, creditsCloseBtn });
    }

    // --- Drake Details Panel Interaction ---
    // The logic to show/hide the panel is now within ui.js, triggered by game.handleDrakeClick
    // We might need a listener here if we add ways to close the panel other than its own button
    // (e.g., clicking outside the panel), but the explicit close button is handled in ui.initUI.

    console.log("Initialization complete (V2). Game running.");
});
// --- END OF FILE main.js ---