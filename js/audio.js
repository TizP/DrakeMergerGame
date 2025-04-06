// --- START OF FILE audio.js ---

const audioElement=document.getElementById('background-music');let isPlaying=false,userInteracted=false;
export function initAudio(){document.body.addEventListener('click',handleUserInteraction,{once:true});document.body.addEventListener('touchend',handleUserInteraction,{once:true});if(audioElement){isPlaying=!audioElement.paused;}else{console.error("Audio element missing!");}}
function handleUserInteraction(){console.log("User interaction detected.");userInteracted=true;}
export function toggleMusic(){if(!audioElement)return;if(!userInteracted){console.log("Audio Interaction Needed.");return;} if(isPlaying){audioElement.pause();updateMusicButtonUI(false);console.log("Music Paused");}else{audioElement.play().then(()=>{updateMusicButtonUI(true);console.log("Music Playing");}).catch(error=>{console.error("Audio playback failed:",error);updateMusicButtonUI(false);});}}
export function playMusic(){if(!isPlaying&&userInteracted&&audioElement)toggleMusic();}
export function pauseMusic(){if(isPlaying&&audioElement)toggleMusic();}
export function updateMusicButtonUI(playing){isPlaying=playing;} // Relies on ui.js for text update
export function isAudioPlaying(){return isPlaying;}

// --- END OF FILE audio.js ---