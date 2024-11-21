import { Game } from './GameClass.js'; 


const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const newGame = new Game(canvas, gameContainer);
window.addEventListener('resize', newGame.adjustCanvasSize.bind(newGame));
let maxSessionNumber = 0;
let currentSessionNumber = 0;
let remainingSessions = 0;
if (newGame.ID[newGame.ID.length - 1] == 1) {
    maxSessionNumber = 2;
} else {
    maxSessionNumber = 4;
}
let learningDimensions = localStorage.getItem('Dimensions');
learningDimensions = JSON.parse(learningDimensions);
learningDimensions = Object.values(learningDimensions);
//let learningDimensions = [1, 1, 1, 1];
newGame.breakTime = 10;
newGame.maxTrials = 16;
newGame.maxBlocks = 20;
newGame.showMapping = false;
newGame.experimentalPhase = 'Learning';

newGame.relevantDimensions = newGame.filterCombinations(learningDimensions, newGame.relevantDimensions);
newGame.drawInstructions = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /2.8;
    let line = 0;
    newGame.drawTextHeading("The learning phase", centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText(`In the learning phase, only a subset of lock combinations will come up.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Even if some combinations will not come up, remain with both hands on the keyboard.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`1. Use your left hand for keys "${newGame.Key1[0]}", "${newGame.Key2[0]}", ${newGame.Key3[0]}, and "${newGame.Key4[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`2. Use your right hand for keys "${newGame.Key5[0]}", "${newGame.Key6[0]}", "${newGame.Key7[0]}", and "${newGame.Key8[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Each learning block entails 16 locks.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`There will be 20 blocks per learning session.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`You will get also performance feedback for this subset`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`of combinations after finishing the last test.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Press Space to start the learning phase.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.ctx.drawImage(newGame.padlockImage, canvas.width*0.05, canvas.height*0.05, canvas.height*0.14, canvas.height*0.12);
    newGame.ctx.drawImage(newGame.lockImage, canvas.width*0.90, canvas.height*0.05, canvas.height*0.14, canvas.height*0.08);
};

newGame.drawBreakInfo = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /2.8;
    let line = 5;
    newGame.drawText('Good job!', centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Time needed: ${newGame.formatTimeFullPrecision(newGame.bestTime.slice(-1))}`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Your fastest time this session: ${newGame.formatTimeFullPrecision(Math.min(...newGame.bestTime))}`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.relevantDimensions = newGame.generateRelevantDimensions();
    newGame.relevantDimensions = newGame.filterCombinations(learningDimensions, newGame.relevantDimensions);
    if (newGame.bestTime.slice(-1) < Math.min(...newGame.allTimeEntries.slice(0, -1))) {
        if (newGame.hasPlayedHighscoreSound === false) {
            newGame.playHighscoreSound();
            newGame.hasPlayedHighscoreSound = true;
        }

        // Use the current time to decide whether to draw the text or not
        const currentTime = new Date();
        if (Math.floor(currentTime.getSeconds() % 2) === 0) {
            newGame.drawText('New Highscore!', centerW, centerH - start + line * inbetween);
        }
        line = line + 1;
    }
    if (newGame.gameState == 'Finished') {
        newGame.drawText(`You finished all blocks for today. There are ${remainingSessions + 1} sessions left.`, centerW, centerH - start + line * inbetween); line = line + 1;
        newGame.drawText(`See you tomorrow! You can close the window now.`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    } else {
        newGame.drawText(`Break Time Remaining: ${newGame.breakTime}s`, centerW,  centerH - start + line*inbetween ); line = line + 1;
        if (newGame.breakTime <= 0) {
            newGame.drawText("Press Space to begin", centerW, centerH - start + line*inbetween ); line = line + 1;
        }
    }
};

  
newGame.padlockImage.onload = function() {
    newGame.adjustCanvasSize();
    newGame.drawInstructions();

    // Get past performance data for this user
    newGame.fetchDataFromServerById(newGame.ID, newGame.experimentalPhase, data => {
        const userEntries = data.user || [];
        // Convert session_Date to just date (YYYY-MM-DD)
        const uniqueDays = Array.from(new Set(userEntries.map(entry => entry.session_Date.slice(0, 10)))).sort();
    
        // The most recent session date would be the last element in uniqueDays
        const mostRecentSessionDate = uniqueDays[uniqueDays.length - 1];

        // Your current session number would be the length of uniqueDays
        currentSessionNumber = uniqueDays.length;

        // Get today's date as a string in YYYY-MM-DD format
        const today = new Date().toLocaleDateString('en-CA'); 

        if (mostRecentSessionDate !== today) {
            currentSessionNumber += 1;  // If the most recent session is not today, increment session count
        }

        remainingSessions = maxSessionNumber - currentSessionNumber;
        // Redirect if more than maxSessionNumber unique learning sessions on individual days
        if (currentSessionNumber > maxSessionNumber) {
            window.location.href = "./posttest.html";
            return; // Exit the function to avoid further processing
        }
        // Filter data to only include blocks from the last 12 hours
        let date = new Date();
        date.setHours(date.getHours() - 12);
        let timeString = date.toLocaleString('en-CA', { hour12: false }).replace(',', ''); // Replace to adjust the format

        const lastTenHourBlocks = userEntries.filter(entry => entry.session_Date >= timeString);

        // Now lastTenHourBlocks contains entries only from the last 10 hours.
        newGame.blockNumber = lastTenHourBlocks.length + 1;
        newGame.blockCountDisplay.textContent = `Block: ${newGame.blockNumber}/${newGame.maxBlocks}`; // Increment the trial count and update the lock count display to show the total number of trials
          // Gather Time values into bestTime array
         
        newGame.allTimeEntries = userEntries.map(entry => entry.performance);

        newGame.bestTime = lastTenHourBlocks.map(entry => entry.performance);
        if (newGame.blockNumber > newGame.maxBlocks) {
            newGame.gameState = 'Finished';
            newGame.clearCanvas();
            newGame.drawBreakInfo();
            newGame.ID = null;
        }
      });
};

// Starts the game
document.addEventListener('keydown', (event) => {
    const key = event.key;
    newGame.lastKeyPressTimestamp = performance.now(); // Update the timestamp
    if (newGame.mapping[key] !== undefined) {
        newGame.keys[key] = true;
    }
    if (event.code === 'Space') {
        if (newGame.gameState == 'NotStarted') {
            newGame.gameState = 'Running';
            newGame.clearCanvas();
            newGame.resetTrial();
            newGame.startTimer();  // Start the game timer after initializing everything
            newGame.update();
        } else if (newGame.gameState == 'Break' && newGame.breakTime <= 0 && newGame.blockNumber - 1 < newGame.maxBlocks) {
            newGame.hasPlayedHighscoreSound = false;
            newGame.gameState = 'Running';
            newGame.breakTime = newGame.breakDuration;
            newGame.timerDisplay.style.backgroundColor = '';
            newGame.timerDisplay.style.animation = '';
            newGame.blockCountDisplay.textContent = `Block: ${newGame.blockNumber}/${newGame.maxBlocks}`; // Increment the trial count and update the lock count display to show the total number of trials
            newGame.lockOpened = 0; // Reset the game start time
            newGame.clearCanvas();
            newGame.resetTrial();
            newGame.startTimer();  // Start the game timer after initializing everything
        }
    }
}
);

document.addEventListener('keyup', (event) => {
    if (newGame.mapping[event.key] !== undefined) {
        delete newGame.keys[event.key];
    }
});
