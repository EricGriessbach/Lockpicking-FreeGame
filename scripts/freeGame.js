import { Game } from './GameClass.js'; 


const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const newGame = new Game(canvas, gameContainer);
window.addEventListener('resize', newGame.adjustCanvasSize.bind(newGame));

let learningDimensions = [1, 1, 1, 1];
newGame.breakTime = 10;
newGame.maxTrials = 16;
newGame.maxBlocks = 20;
newGame.showMapping = false;
newGame.experimentalPhase = 'FreeGame';

newGame.relevantDimensions = newGame.filterCombinations(learningDimensions, newGame.relevantDimensions);
newGame.drawInstructions = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /2.8;
    let line = 0;
    newGame.drawTextHeading("Free Game", centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText(`The free game mode is similar to the learning phase.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`But you can do as many blocks as you want.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`The locks are configured so that they  always require to control 4 circles.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`There will be a highscore list specific for free games.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`This will be the ultimate challenge, as there is no limit how much you can train the task.`, centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`If you are ready, press Space to start a Free Game.`, centerW, centerH - start + line*inbetween ); line = line + 1;
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
    /*
    newGame.fetchDataFromServerById(newGame.ID, newGame.experimentalPhase, data => {
        const userEntries = data.user || [];
        // Convert session_Date to just date (YYYY-MM-DD)
        newGame.allTimeEntries = userEntries.map(entry => entry.performance);
      });
    */
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
