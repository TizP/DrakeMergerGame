// --- START OF FILE tutorial.js ---

const tutorialBox = document.getElementById('tutorial-box');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialContent = document.getElementById('tutorial-content');
const nextBtn = document.getElementById('tutorial-next-btn');
const closeBtn = document.getElementById('tutorial-close-btn');

// Updated Tutorial Steps including RPG mechanics
const tutorialSteps = [
    { title: "Welcome!", content: "Welcome to Drake Merger RPG! The goal is to merge drakes to create powerful, unique evolutions." },
    { title: "Buying Drakes", content: "Click 'Buy Drake Egg' to get started. Each egg costs Resources." },
    { title: "Resources", content: "Drakes generate Resources automatically over time (starting from Hatchlings). Higher levels and better stats generate more!" },
    { title: "Merging", content: "Drag a drake onto another of the *same level*. They merge into a higher-level drake, potentially inheriting traits from both parents." },
    { title: "Grid Space", content: "Space is limited! Merging frees up slots for more drakes and strategic placement." },

    // --- NEW RPG EXPLANATIONS ---
    { title: "Rarity", content: "Drakes now have Rarity (Common, Uncommon, Rare, Epic)! Look at the border color. Rarer drakes generally have better stats and potential. Merging parents gives a chance for an even rarer result!" },
    { title: "Elements", content: "Each drake has an Element (Fire 🔥, Water 💧, Earth 🌍, etc.), shown by the icon. Elements slightly affect base income and will be important for future combat mechanics!" },
    { title: "Stats", content: "Drakes have RPG stats! \n • Focus boosts passive resource income.\n • Strength, Vitality, and Agility will affect combat performance later. Click a drake to see its details!" },
    { title: "Potential", content: "Potential determines how much stats can improve when a drake is merged into the next level. Higher potential means better growth!" },
    // -----------------------------

    { title: "Drake Details", content: "Curious about a specific drake? Click on it! A panel will pop up showing its Level, Rarity, Element, Stats, Potential, and effective income." },
    { title: "Saving", content: "Progress isn't saved automatically. Use the 'Save Game' button often and 'Load Game' to continue later. Note: Saves from older versions might not work." },
    { title: "That's It!", content: "You know the basics. Merge drakes, discover rare combinations, manage your resources, and aim for the most powerful drakes! Good luck!" }
];


let currentStep = 0;
let tutorialActive = false;

export function initTutorial() {
    // Ensure buttons exist before adding listeners
    if (nextBtn) nextBtn.addEventListener('click', nextTutorialStep);
    if (closeBtn) closeBtn.addEventListener('click', closeTutorial);
}

export function startTutorial() {
    currentStep = 0;
    tutorialActive = true;
    showStep(currentStep);
    if (tutorialBox) tutorialBox.classList.remove('hidden');
}

function nextTutorialStep() {
    currentStep++;
    if (currentStep < tutorialSteps.length) {
        showStep(currentStep);
    } else {
        closeTutorial(); // Auto-close after the last step
    }
}

function showStep(stepIndex) {
    // Ensure elements exist before modifying
    if (!tutorialTitle || !tutorialContent || !nextBtn) return;
    if (stepIndex < 0 || stepIndex >= tutorialSteps.length) return;

    const step = tutorialSteps[stepIndex];
    tutorialTitle.textContent = step.title;
    // Use innerHTML or textContent carefully - textContent is safer if content is purely text
    // Using innerHTML here allows the \n for line breaks in the Stats step. Sanitize if user input is ever involved.
    tutorialContent.innerHTML = step.content.replace(/\n/g, '<br>'); // Replace newline chars with <br> for HTML

    // Show/hide next button or change text
    if (stepIndex === tutorialSteps.length - 1) {
        nextBtn.textContent = "Finish";
    } else {
        nextBtn.textContent = "Next";
    }
}

function closeTutorial() {
    tutorialActive = false;
    if (tutorialBox) tutorialBox.classList.add('hidden');
     // Optional: Reset to first step for next time
     // currentStep = 0;
}

export function isTutorialActive() {
    return tutorialActive;
}

// --- END OF FILE tutorial.js ---