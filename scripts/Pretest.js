import { Game } from './GameClass.js'; 


const gameContainer = document.getElementById('gameContainer');
const canvas = document.getElementById('gameCanvas');
const newGame = new Game(canvas, gameContainer);

window.addEventListener('resize', newGame.adjustCanvasSize.bind(newGame));
newGame.breakTime = 5;
newGame.maxTrials = 5;
let readInstruction = false;
let group = parseInt(newGame.ID[newGame.ID.length - 1]);

if (group === 5) {
    newGame.drawInstructions = () => {
        const centerW = canvas.width / 2, centerH = canvas.height / 2;
        let inbetween = canvas.height/20;
        const start = canvas.height /2.8;
        let line = 0;
        newGame.drawTextHeading("Lockpicking championship", centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
        newGame.drawText("Prepare for the ultimate lockpick showdown:", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('1. Unlock all locks as fast as possible by aligning the circles with the target.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('2. Your can control the circles with your keyboard.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('3. Circles which are already in the target before a trial begins can not be controlled.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('4. After the first entrance test  there will be a second final test.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('5. Please wait 4 days after finishing the the entrance test to start the final test.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText("6. You will be able to see your progress and performance", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText("in comparison to other participants after finishing the final test.", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText("Press the arrow key right for further instructions.", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.ctx.drawImage(newGame.padlockImage, canvas.width*0.05, canvas.height*0.05, canvas.height*0.14, canvas.height*0.12);
        newGame.ctx.drawImage(newGame.lockImage, canvas.width*0.90, canvas.height*0.05, canvas.height*0.14, canvas.height*0.08);
    };
}
else {
    newGame.drawInstructions = () => {
        const centerW = canvas.width / 2, centerH = canvas.height / 2;
        let inbetween = canvas.height/20;
        const start = canvas.height /2.8;
        let line = 0;
        newGame.drawTextHeading("Lockpicking championship", centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
        newGame.drawText("Prepare for the ultimate lockpick showdown:", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('1. Unlock all locks as fast as possible by aligning the circles with the target.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('2. Your can control the circles with your keyboard.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('3. Circles which are already in the target before a trial begins can not be controlled.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('4. After the first entrance test you will have 4 practice sessions before the final test.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('5. Other participants will have the same practice conditions.', centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText("6. You will be able to see your progress and performance", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText("in comparison to other participants after finishing the last test.", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.drawText('7. Only one session is allowed per day.', centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
        newGame.drawText("Press the arrow key right for further instructions.", centerW, centerH - start + line*inbetween ); line = line + 1;
        newGame.ctx.drawImage(newGame.padlockImage, canvas.width*0.05, canvas.height*0.05, canvas.height*0.14, canvas.height*0.12);
        newGame.ctx.drawImage(newGame.lockImage, canvas.width*0.90, canvas.height*0.05, canvas.height*0.14, canvas.height*0.08);
    };
}

let drawInstructions2 = () => {
    const centerW = canvas.width / 2, centerH = canvas.height / 2;
    let inbetween = canvas.height/20;
    const start = canvas.height /3 - inbetween;
    let line = 0;
    newGame.drawTextHeading('Familiarization with the task', centerW, centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    newGame.drawText("Before we start with the entrance test", centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('there will be 5 trials to familiarize yourself with the task.', centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`1. Use your left hand for keys "${newGame.Key1[0]}", "${newGame.Key2[0]}", ${newGame.Key3[0]}, and "${newGame.Key4[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`2. Use your right hand for keys "${newGame.Key5[0]}", "${newGame.Key6[0]}", "${newGame.Key7[0]}", and "${newGame.Key8[0]}".`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText('3. You can control multiple circles at a time.', centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText("How swift are your fingers? Rise to the challenge and claim victory!", centerW, centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText("Press Space if you understood the instructions and are ready to start the familiarization trials.", centerW,  centerH - start + line*inbetween ); line = line + 1;
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
    newGame.drawText(`You finished the familiarization phase.`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`After a short break the entrance test will begin. Good luck!`, centerW,  centerH - start + line*inbetween ); line = line + 1;
    newGame.drawText(`Break Time Remaining: ${newGame.breakTime}s`, centerW,  centerH - start + line*inbetween ); line = line + 1; line = line + 1;
    if (newGame.breakTime <= 0) {
        newGame.drawText("Press Space to begin", centerW,  centerH - start + line*inbetween ); line = line + 1;
    }
};

const PreTestSetup = ()=> {
    newGame.maxTrials = 80;
    newGame.blockNumber = 1;
    newGame.breakTime = 5;
    newGame.showMapping = false;
    newGame.experimentalPhase = 'Pretest';
    newGame.blockCountDisplay.textContent = `Block: ${newGame.blockNumber}/${newGame.maxBlocks}`; // Increment the trial count and update the lock count display to show the total number of trials
    newGame.drawBreakInfo = () => {
        const centerW = canvas.width / 2, centerH = canvas.height / 2;
        let inbetween = canvas.height/20;
        const start = canvas.height /3 - inbetween;
        let line = 3;
        if (group === 5) { 
            newGame.drawText('Good job!', centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText(`Time needed: ${newGame.formatTimeFullPrecision(newGame.bestTime.slice(-1))}`, centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText(`You finished the entrance test.`, centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText("Please wait 4 days before continuing with the final test.", centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText("You can close the window now.", centerW, centerH - start + line*inbetween ); line = line + 1;
        } else {
            newGame.drawText('Good job!', centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText(`Time needed: ${newGame.formatTimeFullPrecision(newGame.bestTime.slice(-1))}`, centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText(`You finished the entrance test. Now the learning phase will begin.`, centerW, centerH - start + line*inbetween ); line = line + 1;
            newGame.drawText(`Break Time Remaining: ${newGame.breakTime}s`, centerW, centerH - start + line*inbetween ); line = line + 1;
            if (newGame.breakTime <= 0) {
                newGame.drawText("Press Space to continue with the learning phase.", centerW, centerH - start + line*inbetween ); line = line + 1;
            }
        }
    };
}
  
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
        
        if (newGame.blockNumber > newGame.maxBlocks) {
            window.location.href = "./learning.html";
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
        if (newGame.gameState == 'NotStarted' && readInstruction == true) {
            newGame.gameState = 'Running';
            newGame.clearCanvas();
            newGame.resetTrial();
            newGame.startTimer();  // Start the game timer after initializing everything
            newGame.update();
        } else if (newGame.gameState == 'Finished' && newGame.breakTime <= 0 && newGame.blockNumber - 1 >= newGame.maxBlocks && newGame.experimentalPhase == 'Familiarization') {
            PreTestSetup();
            newGame.gameState = 'Running';
            newGame.clearCanvas();
            newGame.resetTrial();
            newGame.startTimer();  // Start the game timer after initializing everything
        }
        else if (newGame.gameState == 'Finished' && newGame.breakTime <= 0 && newGame.blockNumber - 1 >= newGame.maxBlocks && newGame.experimentalPhase == 'Pretest' && group < 5) {
            window.location.href = "./learning.html";
        }
    }
}
);

document.addEventListener('keyup', (event) => {
    if (newGame.mapping[event.key] !== undefined) {
        delete newGame.keys[event.key];
    }
});
