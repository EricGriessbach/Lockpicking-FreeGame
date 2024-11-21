import { Game } from './GameClass.js'; 

const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const newGame = new Game(canvas, gameContainer);

window.addEventListener('resize', newGame.adjustCanvasSize.bind(newGame));
newGame.breakTime = 2;
let readInstruction = false;
newGame.maxTrials = 80;
newGame.blockNumber = 1;
newGame.showMapping = false;
newGame.experimentalPhase = 'Posttest';

newGame.drawInstructions = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /2.8;
    let line = 0;
    newGame.drawTextHeading("Lockpicking championship", centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText("Welcome to the last official session.", centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('Like in the first session, you will encounter a variety of ', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('different lock positions. Again, try to pick all the locks', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('as fast as possible. Afterward, you will have access to your', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('personal performance feedback and you can select the free game mode.', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText("Press the arrow key right for further instructions.", centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.ctx.drawImage(newGame.padlockImage, canvas.width*0.05, canvas.height*0.05, canvas.height*0.14, canvas.height*0.12);
    newGame.ctx.drawImage(newGame.lockImage, canvas.width*0.90, canvas.height*0.05, canvas.height*0.14, canvas.height*0.08);
};

let drawInstructions2 = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /3 - inbetween;
    let line = 0;
    newGame.drawTextHeading('Reminder of the task instructions', centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText(`1. Use your left hand for keys "${newGame.Key1[0]}", "${newGame.Key2[0]}", ${newGame.Key3[0]}, and "${newGame.Key4[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`2. Use your right hand for keys "${newGame.Key5[0]}", "${newGame.Key6[0]}", "${newGame.Key7[0]}", and "${newGame.Key8[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('3. You can control multiple circles at a time.', centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('Align all circles as fast as possible to pick the lock.', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('Good luck on this last test!', centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText("Press Space if you understood the instructions and are ready to start the last test.", centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText("Press the arrow key left to go back to the first instruction side.", centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.ctx.drawImage(newGame.padlockImage, canvas.width*0.05, canvas.height*0.05, canvas.height*0.14, canvas.height*0.12);
    newGame.ctx.drawImage(newGame.lockImage, canvas.width*0.90, canvas.height*0.05, canvas.height*0.14, canvas.height*0.08);
};

newGame.drawBreakInfo = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /3 - inbetween;
    let line = 3;
    newGame.drawText('Good job!', centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Time needed: ${newGame.formatTimeFullPrecision(newGame.bestTime.slice(-1))}`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Break Time Remaining: ${newGame.breakTime}s`, centerW,  centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText(`You finished the experimental part of the game!`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Thanks for participating!`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`You can now go back to the first page to take a look at`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`your performance compared to other participants`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`or try the free game mode and compete on the highscore list.`, centerW,  centerH - start + line*inbetween ); line = line + 1;

    if (newGame.breakTime <= 0) {
        newGame.drawText("Press Space to go back to the game menu.", centerW,  centerH - start + line*inbetween ); line = line + 1;
    }
};
  
newGame.padlockImage.onload = function() {
    newGame.adjustCanvasSize();
    newGame.drawInstructions();

    // Get past performance data for this user
    // Get past performance data for this user
    newGame.fetchDataFromServerById(newGame.ID, newGame.experimentalPhase, data => {
        const userEntries = data.user || [];

        // Convert session_Date to just date (YYYY-MM-DD)
        const uniqueDays = Array.from(new Set(userEntries.map(entry => entry.session_Date.slice(0, 10)))).sort();

        // Your current session number would be the length of uniqueDays
        const currentSessionNumber = uniqueDays.length;

        // No need to filter data for the last 10 hours, we want all sessions

        // Now, use userEntries to determine the block number
        newGame.blockNumber = userEntries.length + 1;
        newGame.blockCountDisplay.textContent = `Block: ${newGame.blockNumber}/${newGame.maxBlocks}`; // Increment the trial count and update the block count display to show the total number of trials

        // Gather Time values into bestTime array
        newGame.allTimeEntries = userEntries.map(entry => entry.performance);
        newGame.bestTime = userEntries.map(entry => entry.performance); // Use all entries, not just last 10 hours

        if (newGame.blockNumber > newGame.maxBlocks) {
            newGame.drawBreakInfo();
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

    if (event.code === 'ArrowLeft' && newGame.gameState == 'NotStarted') {
        newGame.clearCanvas();
        newGame.drawInstructions();
    }

    if (event.code === 'ArrowRight' && newGame.gameState == 'NotStarted') {
        newGame.clearCanvas();
        readInstruction = true;
        drawInstructions2();
    }
    if (event.code === 'Space') {
        console.log(newGame.gameState);
        console.log(newGame.breakTime);
        console.log(newGame.blockNumber);
        if (newGame.gameState == 'NotStarted' && readInstruction == true) {
            newGame.gameState = 'Running';
            newGame.clearCanvas();
            newGame.resetTrial()
            newGame.startTimer();  // Start the game timer after initializing everything
            newGame.update();
        }
        else if (newGame.gameState == 'Finished' && newGame.breakTime <= 0 && newGame.blockNumber - 1 >= newGame.maxBlocks) {
            window.location.href = "./index.html";
        }
    }
}
);

document.addEventListener('keyup', (event) => {
    if (newGame.mapping[event.key] !== undefined) {
        delete newGame.keys[event.key];
    }
});
