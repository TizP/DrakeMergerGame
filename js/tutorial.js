const tutorialBox = document.getElementById('tutorial-box');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialContent = document.getElementById('tutorial-content');
const nextBtn = document.getElementById('tutorial-next-btn');
const closeBtn = document.getElementById('tutorial-close-btn');

const tutorialSteps = [
    { title: "Welcome!", content: "Welcome to Drake Merger! The goal is to merge drakes to create bigger and better evolutions." },
    { title: "Buying Drakes", content: "Click the 'Buy Drake Egg' button to purchase the most basic drake, the Egg. You need resources for this!" },
    { title: "Resources", content: "You gain resources automatically over time from your hatched drakes (Hatchling level and above). Higher level drakes give more resources." },
    { title: "Merging", content: "Drag a drake and drop it onto another drake of the *same level*. They will merge into one drake of the next level!" },
    { title: "Grid Space", content: "You have limited space on the grid. Merging helps free up space for more drakes." },
    { title: "Saving", content: "Your progress is NOT saved automatically. Click the 'Save Game' button to save. Use 'Load Game' to resume later." },
    { title: "That's It!", content: "Now you know the basics. Start merging and see how high you can evolve your drakes! Good luck!" }
];

let currentStep = 0;
let tutorialActive = false;

export function initTutorial() {
    nextBtn.addEventListener('click', nextTutorialStep);
    closeBtn.addEventListener('click', closeTutorial);
}

export function startTutorial() {
    currentStep = 0;
    tutorialActive = true;
    showStep(currentStep);
    tutorialBox.classList.remove('hidden');
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
    if (stepIndex < 0 || stepIndex >= tutorialSteps.length) return;

    const step = tutorialSteps[stepIndex];
    tutorialTitle.textContent = step.title;
    tutorialContent.textContent = step.content;

    // Show/hide next button
    if (stepIndex === tutorialSteps.length - 1) {
        nextBtn.textContent = "Finish"; // Or hide it: nextBtn.classList.add('hidden');
    } else {
        nextBtn.textContent = "Next";
        // nextBtn.classList.remove('hidden');
    }
}

function closeTutorial() {
    tutorialActive = false;
    tutorialBox.classList.add('hidden');
     // Optional: Reset to first step for next time
     // currentStep = 0;
}

export function isTutorialActive() {
    return tutorialActive;
}