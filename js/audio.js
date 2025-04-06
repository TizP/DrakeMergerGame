const audioElement = document.getElementById('background-music');
let isPlaying = false;
let userInteracted = false; // Track if user has interacted (for autoplay policy)

export function initAudio() {
    // Browsers often block autoplay until user interaction
    document.body.addEventListener('click', () => {
        userInteracted = true;
    }, { once: true }); // Remove listener after first click

     // Set initial button text based on paused state (usually true initially)
     updateMusicButtonUI(audioElement.paused);
}

export function toggleMusic() {
    if (!userInteracted) {
        console.log("Audio cannot play yet. Click somewhere on the page first.");
         // Optionally show a message to the user
        return;
    }

    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        audioElement.play().then(() => {
            isPlaying = true;
             updateMusicButtonUI(false); // Update UI after successful play
        }).catch(error => {
            console.error("Audio playback failed:", error);
            isPlaying = false; // Ensure state is correct even on failure
            updateMusicButtonUI(true);
        });
    }
     updateMusicButtonUI(isPlaying); // Update UI immediately for pause
}

export function playMusic() {
     if (!isPlaying && userInteracted) {
         toggleMusic();
     }
}
export function pauseMusic() {
    if (isPlaying) {
         toggleMusic();
    }
}


// Separate function to update UI - called from game.js or main.js
export function updateMusicButtonUI(playing) {
    // This function needs access to the UI module or the button element directly
    // Let's assume ui.js exports a function for this
    // import { updateMusicButtonText } from './ui.js'; // Import in the calling module (e.g., main.js)
    // updateMusicButtonText(playing); // Call the UI update function
    isPlaying = playing; // Keep internal state synced
}

export function isAudioPlaying() {
    return isPlaying;
}