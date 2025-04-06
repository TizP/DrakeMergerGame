// --- START OF FILE main.js ---

import * as game from './game.js';
import * as ui from './ui.js';
import * as saveLoad from './saveLoad.js';
import * as audio from './audio.js';
import * as tutorial from './tutorial.js';

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Initializing...");

    // Initialize UI (pass event handlers from game logic)
    ui.initUI(
        game.buyDrake,
        game.handleDragStart,
        game.handleDragEnd,
        game.handleDrop,
        game.handleDragOver,
        game.handleDragLeave
    );

    // Initialize other modules
    audio.initAudio();
    tutorial.initTutorial(); // Make sure tutorial.js is correctly initializing its buttons too

    // Initialize Core Game Logic
    game.initGame();

    // --- Connect Control Buttons ---
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const deleteSaveBtn = document.getElementById('delete-save-btn');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const tutorialBtn = document.getElementById('tutorial-btn');
    // === Get references for Credits ===
    const creditsBtn = document.getElementById('credits-btn'); // Reference to the button itself
    const creditsBox = document.getElementById('credits-box'); // Reference to the overlay div
    const creditsCloseBtn = document.getElementById('credits-close-btn'); // Reference to the close button inside overlay
    // ================================

    // Standard Buttons
    if(saveBtn) saveBtn.addEventListener('click', game.handleSave);
    if(loadBtn) loadBtn.addEventListener('click', game.handleLoad);
    if(deleteSaveBtn) deleteSaveBtn.addEventListener('click', game.handleDelete);

    if(musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            audio.toggleMusic();
            ui.updateMusicButtonText(audio.isAudioPlaying());
        });
        // Set initial text
        ui.updateMusicButtonText(audio.isAudioPlaying());
    }

    if(tutorialBtn) tutorialBtn.addEventListener('click', tutorial.startTutorial);

    // === Add Event Listeners for Credits ===
    // Check if ALL necessary elements were found
    if (creditsBtn && creditsBox && creditsCloseBtn) {
        // Listener for the main "Show Credits" button
        creditsBtn.addEventListener('click', () => {
            console.log("Credits button clicked"); // Add console log for debugging
            creditsBox.classList.remove('hidden'); // Show the credits box
        });

        // Listener for the "Close" button inside the credits box
        creditsCloseBtn.addEventListener('click', () => {
             console.log("Credits close button clicked"); // Add console log for debugging
            creditsBox.classList.add('hidden'); // Hide the credits box
        });
    } else {
        // Log which element might be missing if setup fails
        console.error("Error setting up Credits button: One or more elements not found.", {
             creditsBtnFound: !!creditsBtn,
             creditsBoxFound: !!creditsBox,
             creditsCloseBtnFound: !!creditsCloseBtn
         });
    }
    // =====================================

    console.log("Initialization complete. Game running.");
});
// --- END OF FILE main.js ---