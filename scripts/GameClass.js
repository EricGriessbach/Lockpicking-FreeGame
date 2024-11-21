
export class Game {
    constructor(canvas, gameContainer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameContainer = gameContainer;
        this.timerDisplay = document.getElementById('timerDisplay');
        this.blockCountDisplay = document.getElementById('blockCountDisplay');
        this.ID = "ID1"//localStorage.getItem('identifier');
        // Step 1: Check for the existence of "identifier" in local storage
        if (this.ID === null) {
            // Step 2: Redirect to "index.html" if "identifier" is not found
            window.location.href = "index.html";
        }
        this.Mapping = localStorage.getItem('Mapping');
        this.maxCircles = 4;
        this.maxBlocks = 1;
        this.maxTrials = 2; 
        this.breakDuration = 10;
        this.keys = {};
        this.experimentalPhase = 'Familiarization'; // Pretest, Learning1 - 4, Posttest
        if (this.Mapping == 'Alternative') {
            this.mapping = { e: 0, d: 0, s: 1, f: 1, o: 2, l: 2, k: 3, ';': 3 };
            this.directionMap = { e: 'left', d: 'right', s: 'right', f: 'left', o: 'left', l: 'right', k: 'left', ';': 'right' };
        } else {
            this.mapping = { w: 0, s: 0, a: 1, d: 1, i: 2, k: 2, j: 3, l: 3 };
            this.directionMap = { w: 'left', s: 'right', a: 'right', d: 'left', i: 'left', k: 'right', j: 'left', l: 'right' };
        }
        this.keyArray = Object.entries(this.mapping);
        this.Key1 = this.keyArray[0][0];
        this.Key2 = this.keyArray[1][0];
        this.Key3 = this.keyArray[2][0];
        this.Key4 = this.keyArray[3][0];
        this.Key5 = this.keyArray[4][0];
        this.Key6 = this.keyArray[5][0];
        this.Key7 = this.keyArray[6][0];
        this.Key8 = this.keyArray[7][0];
        this.lastKeyPressTimestamp = null; // For the 5s rule to reduce sampling rate for data
  
        this.session_Date = this.getLocalDateTime();
        this.standardFrameTime = 16.67; // Time for 60 Hz in milliseconds

        this.padlockImage = new Image();
        this.padlockImage.src = "./Documents/padlock.svg";
        this.lockImage = new Image();
        this.lockImage.src = "./Documents/Lock.png";

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.popSoundBuffer;
        this.highscoreSoundBuffer;  // Declare another buffer for the second sound
        this.hasPlayedHighscoreSound = false;  // Add a flag to track whether the sound has been played
        fetch('./Documents/pop_sound.wav')
            .then(response => response.arrayBuffer())
            .then(data => this.audioContext.decodeAudioData(data))
            .then(buffer => {
                this.popSoundBuffer = buffer;
            })
            .catch(e => console.error(e));

        // Load another sound
        fetch('./Documents/highscore_Sound.wav')  // Replace with the path of your second sound
        .then(response => response.arrayBuffer())
        .then(data => this.audioContext.decodeAudioData(data))
        .then(buffer => {
            this.highscoreSoundBuffer = buffer;  // Store in the new buffer
        })
        .catch(e => console.error(e));

        // Initialize empty array
        this.relevantDimensions = this.generateRelevantDimensions();
        this.width = canvas.width;
        this.height = canvas.height;
        this.isSuccessState = false;
        this.elapsedTime = 0
        this.bestTime = [];
        this.breakTime = this.breakDuration
        this.lockOpened = 0
        this.frameCount = 0
        this.COLOR = 'red';
        this.allTimeEntries = [];
        this.blockNumber = 1
        this.data = []
        this.data_time = [];
        this.combination = this.relevantDimensions[this.lockOpened]; // Assuming 'lockOpened' indexes into 'relevantDimensions'
        this.circlePositions =  this.nextCirclePositions(this.canvas.width, this.combination);
        this.targetPositions = new Array(this.maxCircles).fill().map(() => this.width / 2);
        this.movementSpeed = 0;
        this.scalingFactor = 0;
        this.adjustedMovementSpeed = 0;
        this.timerInterval = null;
        this.leftLimit = this.canvas.width/2 - this.canvas.width/8;
        this.rightLimit = this.canvas.width/2 + this.canvas.width/8;
        this.previousTimestamp = performance.now();
        this.gameState = "NotStarted";
        this.showMapping = true;
        this.blockCountDisplay.textContent = `Block: ${this.blockNumber}/${this.maxBlocks}`; // Increment the trial count and update the lock count display to show the total number of trials
    }
    
    adjustCanvasSize() {
        this.circlePositions = this.circlePositions.map(value => value / this.width);  
        this.targetPositions = this.targetPositions.map(value => value / this.width); 
        this.width = this.gameContainer.offsetWidth;  
        this.height = this.gameContainer.offsetHeight;  
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.movementSpeed = this.width * 0.002; 
        this.leftLimit = this.canvas.width/2 - this.canvas.width/8;
        this.rightLimit = this.canvas.width/2 + this.canvas.width/8;
        if (this.gameState === "NotStarted") {  
            this.drawInstructions();  
        }
        else if (this.gameState === "Break") {
            this.drawBreakInfo();
        }
        else if (this.gameState === "Running") {
            this.circlePositions = this.circlePositions.map(value => value * this.width);
            this.targetPositions = this.targetPositions.map(value => value * this.width);
        } 
    }

    getLocalDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      
      
          

    generateRelevantDimensions() {
        let relevantDimensions = [];
        
        // Generate all relevantDimensions
        for (let a = -1; a <= 1; a++) {
            for (let b = -1; b <= 1; b++) {
            for (let c = -1; c <= 1; c++) {
                for (let d = -1; d <= 1; d++) {
                relevantDimensions.push([a, b, c, d]);
                }
            }
            }
        }
        
        // Remove all-zero combination
        relevantDimensions = relevantDimensions.filter((combination) => {
            return combination.some((num) => num !== 0);
        });
        
        // Randomize the array
        for (let i = relevantDimensions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [relevantDimensions[i], relevantDimensions[j]] = [relevantDimensions[j], relevantDimensions[i]];
        }
        
        return relevantDimensions;
    }

    // Function to filter combinations for learning based on IndArray
    filterCombinations = (IndArray, AllCombinations) => {

        let filteredCombinations = AllCombinations.filter((combination) => {
        // Ensure all positions that are '0' in IndArray are also '0' in the combination
        for (let i = 0; i < IndArray.length; i++) {
            if ((IndArray[i] == 0 && combination[i] != 0) | (IndArray[i] == 1 && Math.abs(combination[i]) != 1)) {
            return false;
        }
        }
        return true;
        });
      // Repeat the array elements to reach a count of 16
        while (filteredCombinations.length < 16) {
            filteredCombinations = [...filteredCombinations, ...filteredCombinations];
        }
        // Trim to 16 if more than 16 after duplication
        filteredCombinations = filteredCombinations.slice(0, 16);

        // Shuffle using Fisher-Yates shuffle algorithm
        for (let i = filteredCombinations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredCombinations[i], filteredCombinations[j]] = [filteredCombinations[j], filteredCombinations[i]];
        }

        return filteredCombinations;
    };

    randomPosition(width, direction) {
        let center = width / 2;
        let range = width / 8;
        let pos;
    
        if (direction === -1) {
            // Random position on the left
            do {
                pos = center + (Math.random() - 1) * range;
            } while (Math.abs(pos - center) < width / 25);
        } else if (direction === 1) {
            // Random position on the right
            do {
                pos = center + (Math.random()) * range;
            } while (Math.abs(pos - center) < width / 25);
        } else {
            // Center
            pos = center;
        }
      
        return pos;
    }

    drawText(text, x, y) {
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
    };
    
    drawTextHeading(text, x, y){
        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
    };

    drawInstructions() {
    }

    drawBreakInfo() {
    }
  
    drawLocks(remainingTrials) {
        const padding = this.canvas.width * 0.005; // space between the lock and the text
        // Set text settings
        const fontSize = 24;
        this.ctx.font = `${fontSize}px Arial`;
        const textMetrics = this.ctx.measureText(`x ${remainingTrials}`);
        const textWidth = textMetrics.width;
        // Calculate X-coordinate for centering both lock and text
        const totalWidth = this.padlockImage.width / 5 + padding + textWidth;
        const startX = (this.canvas.width - totalWidth) / 2;
    
        // Y-coordinate based on your previous setup
        const y = this.canvas.height * 0.7 - this.padlockImage.height / 5;
    
        // Draw the single padlock image
        this.ctx.drawImage(this.padlockImage, startX, y - this.canvas.height * 0.015, this.padlockImage.width / 5, this.padlockImage.height / 5);
    
        // Set text settings
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
    
        // Draw the text next to the padlock
        const textX = startX + this.padlockImage.width / 5 + padding;
        const textY = y + fontSize / 2; // Adjust as needed to align with image
        this.ctx.fillText(`x ${remainingTrials}`, textX, textY);
    }

    formatTimeSecondsOnly(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    formatTimeFullPrecision(seconds) {
        const totalMilliseconds = Math.round(seconds * 1000);
        const minutes = Math.floor(totalMilliseconds / 60000);
        const remainingMilliseconds = totalMilliseconds % 60000;
        const wholeSeconds = Math.floor(remainingMilliseconds / 1000);
        
        // Calculating the single decimal point for the remaining second
        const fractionalSeconds = Math.round((remainingMilliseconds % 1000) / 100);
    
        return `${minutes}:${wholeSeconds < 10 ? '0' : ''}${wholeSeconds}.${fractionalSeconds}`;
    }
    
    playPopSound() {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.popSoundBuffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    // Function to play another sound
    playHighscoreSound() {
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain(); // Create Gain Node
        
        source.buffer = this.highscoreSoundBuffer;  // Use the new buffer

        gainNode.gain.value = 0.2; // Set the volume to half (0.5)

        // Connect source to gain node and gain node to destination
        source.connect(gainNode);  
        gainNode.connect(this.audioContext.destination);
        
        source.start();
    }

    startTimer() {
        this.blockCountDisplay.textContent = `Block: ${this.blockNumber}/${this.maxBlocks}`; // Increment the trial count and update the lock count display to show the total number of trials
        this.elapsedTime = 0;
        this.previousTimestamp = performance.now();
        this.timerInterval = setInterval(() => {  // Use arrow function to preserve 'this'
        this.timerDisplay.textContent = `Time: ${this.formatTimeSecondsOnly(this.elapsedTime)}`;
        }, 1000);
    }
    
    stopTimer() {
        clearInterval(this.timerInterval);  
        this.bestTime.push(this.elapsedTime); 
        this.allTimeEntries.push(this.elapsedTime); 
        this.timerInterval = null;  
        this.timerDisplay.textContent = `Time: ${this.formatTimeSecondsOnly(this.elapsedTime)}`; 
    }
    
    // Initialize circle positions based on the next combination in the block
    nextCirclePositions(width, combination) {
        return combination.map((dir) => this.randomPosition(width, dir));
    }
    
    // Draw the player's circle
    drawCircle(index) {
        this.ctx.beginPath();  
        this.ctx.arc(this.circlePositions[index], this.canvas.height/2 - this.canvas.height/3 + (index + 1) * this.canvas.height / 15, 10, 0, Math.PI * 2);  
        this.ctx.fillStyle = 'blue';  
        this.ctx.fill();  
    }
    
    drawWhiteLine(index) { // Removed 'showMapping' and 'directionMap' as they're class properties
        this.ctx.beginPath();
        const y = this.canvas.height / 2 - this.canvas.height / 3 + (index + 1) * this.canvas.height / 15;
        this.ctx.moveTo(this.canvas.width / 2 - this.canvas.width / 8, y);
        this.ctx.lineTo(this.canvas.width / 2 + this.canvas.width / 8, y);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
    
        if (this.showMapping) {
            const leftLetters = Object.keys(this.directionMap).filter(key => this.directionMap[key] === 'left');
            const rightLetters = Object.keys(this.directionMap).filter(key => this.directionMap[key] === 'right');
    
            this.ctx.font = '24px Arial';
            this.ctx.fillStyle = 'white';
    
            if (index < leftLetters.length) {
                const leftX = this.canvas.width / 2 - this.canvas.width / 8 - 30;
                this.ctx.fillText(leftLetters[index], leftX, y);
            }
    
            if (index < rightLetters.length) {
                const rightX = this.canvas.width / 2 + this.canvas.width / 8 + 10;
                this.ctx.fillText(rightLetters[index], rightX, y);
            }
        }
    }
    
    drawTarget(index, color = 'red') {
        const rectWidth = this.canvas.width / 33;
        const rectHeight = this.canvas.width / 100;
        this.ctx.beginPath();
        this.ctx.rect(this.targetPositions[index] - rectWidth / 2, this.canvas.height / 2 - this.canvas.height / 3 + (index + 1) * this.canvas.height / 15 - rectHeight / 2, rectWidth, rectHeight);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    
    moveCircle(index, direction) {
        if (direction === 'left' && this.circlePositions[index] > this.leftLimit && this.relevantDimensions[this.lockOpened][index] != 0) {
            this.circlePositions[index] -= this.adjustedMovementSpeed;
        }
        else if (direction === 'right' && this.circlePositions[index] < this.rightLimit && this.relevantDimensions[this.lockOpened][index] != 0) {
            this.circlePositions[index] += this.adjustedMovementSpeed;
        }
    }
    
    checkTargetHit(index) {
        return Math.abs(this.circlePositions[index] - this.targetPositions[index]) < this.canvas.width / 66;
    }
    
    resetTrial() {
        if (this.lockOpened < this.maxTrials) {
        this.combination = this.relevantDimensions[this.lockOpened];
        this.circlePositions = this.nextCirclePositions(this.canvas.width, this.combination);
        for (let i = 0; i < this.relevantDimensions.length; i++) {
            if (this.relevantDimensions[i] === 0) {
                this.circlePositions[i] = this.canvas.width / 2;
            }
        }
        this.targetPositions = new Array(this.maxCircles).fill().map(() => this.canvas.width / 2);
        }
    }
    
    // Start the break
    startBreak() {
        if (this.gameState != 'Break' || this.gameState != 'Finished') {
            this.stopTimer(); // Stop the timer

            this.data_time = [{
                ID: this.ID,
                blockNumber: this.blockNumber, 
                elapsedTime: this.elapsedTime,
                session_Date: this.session_Date,
                experimentalPhase: this.experimentalPhase
            }];

            //this.sendTimeDataToServer(this.data_time);
            this.blockNumber += 1;
            if (this.blockNumber - 1 === this.maxBlocks) {
                this.gameState = 'Finished';
            } else {
                this.gameState = 'Break';
            }
            if (this.experimentalPhase === 'Posttest') {
                //this.setFinishedForIdentifier(this.ID);
            }
            // Reset data
            this.lockOpened = 0;
            this.frameCount = 0;
            this.elapsedTime = 0; // Reset elapsed time
            //this.sendLockDataToServer(this.data);
            console.log(this.data);
            this.data = []; 
            this.relevantDimensions = this.generateRelevantDimensions();
            this.combination = this.relevantDimensions[this.lockOpened]; 
            this.circlePositions = this.nextCirclePositions(this.canvas.width, this.combination);
            const breakInterval = setInterval(() => {
                this.breakTime -= 1;
                if (this.breakTime <= 0) {
                  clearInterval(breakInterval);
                }
            }, 1000);
        }
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // Update the canvas
    update() {
        this.clearCanvas();
        this.frameCount += 1;
        const currentTimestamp = performance.now();
        const deltaTime = currentTimestamp - this.previousTimestamp;
        this.elapsedTime += deltaTime/1000;
        this.previousTimestamp = currentTimestamp;
        if(this.gameState === 'Running') {
            const shouldPushData = this.lastKeyPressTimestamp === null || (currentTimestamp - this.lastKeyPressTimestamp <= 7000);

            if (this.lockOpened >= this.maxTrials) {
                this.startBreak();
            } else if (shouldPushData){
                this.data.push({
                    frame: this.frameCount,
                    circlePos1: this.circlePositions[0], 
                    circlePos2: this.circlePositions[1],
                    circlePos3: this.circlePositions[2],
                    circlePos4: this.circlePositions[3],
                    lockNumber: this.lockOpened,
                    elapsedTime: this.elapsedTime,
                    blockNumber: this.blockNumber,
                    ID: this.ID,
                    canvasWidth: this.canvas.width,  
                    canvasHeight: this.canvas.height,
                    session_Date: this.session_Date,
                    date: this.getLocalDateTime(),
                    frameTime: deltaTime/1000,
                    experimentalPhase: this.experimentalPhase,
                    KeyPressW: this.keys[this.Key1] ? 1 : 0,
                    KeyPressS: this.keys[this.Key2] ? 1 : 0,
                    KeyPressA: this.keys[this.Key3] ? 1 : 0,
                    KeyPressD: this.keys[this.Key4] ? 1 : 0,
                    KeyPressI: this.keys[this.Key5] ? 1 : 0,
                    KeyPressK: this.keys[this.Key6] ? 1 : 0,
                    KeyPressJ: this.keys[this.Key7] ? 1 : 0,
                    KeyPressL: this.keys[this.Key8] ? 1 : 0,
                });
            }
    
            // Check and update circle positions based on key presses
            this.scalingFactor = deltaTime / this.standardFrameTime;
            this.adjustedMovementSpeed = this.movementSpeed * this.scalingFactor;
            
            for (let key in this.keys) {
                if (this.keys[key]) {
                    this.moveCircle(this.mapping[key], this.directionMap[key]);
                }
            }
    
            let hits = 0;
            for (let i = 0; i < this.maxCircles; i++) {
                this.drawWhiteLine(i, this.showMapping, this.directionMap);
                if (this.checkTargetHit(i)) {
                    hits++;
                    this.drawTarget(i, "green");
                } else {
                    this.drawTarget(i, "red");
                }
                this.drawCircle(i);
            }
            
            this.drawLocks(this.maxTrials - this.lockOpened);
            
            if (hits === this.maxCircles && !this.isSuccessState) {
                this.isSuccessState = true;
                this.COLOR = 'green';
                this.playPopSound();
                setTimeout(() => {
                    if (this.lockOpened <= this.maxTrials) {
                        this.lockOpened++;
                    }
                    this.resetTrial();
                    this.isSuccessState = false;
                    this.COLOR = 'red';
                }, 500); 
            }
            requestAnimationFrame(this.update.bind(this));
        } else if (this.gameState === 'Break' || this.gameState === 'Finished') {
            this.drawBreakInfo();
            requestAnimationFrame(this.update.bind(this));
        }
    }
    // Send all data to server
    sendLockDataToServer(data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/save_FrameData', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
      
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Notification for successful data send.
                //console.log('Data successfully sent to server');
                // You could also update the UI here to inform the user.
            }
        };
    
        xhr.onerror = function() {
            // Handle error here
            console.log('Error sending data to server');
        };
    
        xhr.send(JSON.stringify(data));
    }
    

    // Function to set IsFinished to 1 for a specific Identifier
    setFinishedForIdentifier(identifier) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/updateIsFinished', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ identifier: identifier }));

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log('Successfully updated IsFinished');
                } else {
                    console.log('Failed to update IsFinished');
                }
            }
        };
    }

    // Send time data to server
    sendTimeDataToServer(data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/save_TimeData', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }

    // Updated the fetch URL to include the identifier query parameter
    fetchDataFromServerById(userId, experimentalPhase, callback) { 
        fetch(`/getPerformance?identifier=${userId}&experimentalPhase=${experimentalPhase}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

}







