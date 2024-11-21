const combinations = ['asjk', 'asil', 'askl', 'asji', 'wdjk', 'wdil', 'wdkl', 'wdji', 'sdjk', 'sdil', 'sdkl', 'sdji', 'awjk', 'awil', 'awkl', 'awji'];
const alternativeCombinations = ['sdkl', 'sdo;', 'sdl;', 'sdko', 'efkl', 'efo;', 'efl;', 'efko', 'dfkl', 'dfo;', 'dfl;', 'dfko', 'sekl', 'seo;', 'sel;', 'seko'];
const identifier = localStorage.getItem('identifier');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let currentCombinationIndex = 0;
let useAlternativeMapping = false; // To track if alternative mapping is required
let alternativeMappingFailed = false;
let popSoundBuffer;

fetch('./Documents/KeyboardSound.wav')
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        popSoundBuffer = buffer;
    })
    .catch(e => console.error(e));

function renderButtons() {
  const buttonsDiv = document.getElementById('buttons');
  buttonsDiv.innerHTML = '';
   // Use the alternative combinations if needed
  const currentCombination = useAlternativeMapping ? alternativeCombinations[currentCombinationIndex] : combinations[currentCombinationIndex];
  for (let i = 0; i < currentCombination.length; i++) {
    const button = document.createElement('div');
    button.className = 'key-button';
    button.textContent = currentCombination[i];
    buttonsDiv.appendChild(button);
  }
}

function nextCombination() {
    currentCombinationIndex++;
    if (currentCombinationIndex >= combinations.length) {
        // Hide the entire test content
        document.getElementById('test-content').style.display = 'none';
        
        // Show the completion message
        document.getElementById('test-complete').style.display = 'block';
        return;
    }
    renderButtons();
}

function tryAlternativeMapping() {
    if (alternativeMappingFailed) {
        // Provide instructions to contact the organizer
        alert("The alternative mapping is also not working. Please write an email to the organizer of the experiment at egriess1@jh.edu.");
        return;
    }
    
    alternativeMappingFailed = true;
    useAlternativeMapping = true;
    document.getElementById('alternative-mapping-button').textContent = 'The alternative mapping is still not working';

    // Reset the test
    currentCombinationIndex = 0;
    renderButtons();
}

function activateButton(key) {
    const buttons = document.querySelectorAll('.key-button');
    buttons.forEach(button => {
        if (button.textContent === key) {
            button.classList.add('active');
        }
    });
}

function deactivateButton(key) {
    const buttons = document.querySelectorAll('.key-button');
    buttons.forEach(button => {
        if (button.textContent === key) {
            button.classList.remove('active');
        }
    });
}

function checkCompletion() {
    const activeButtons = document.querySelectorAll('.key-button.active');
    if (activeButtons.length === 4) {
        playPopSound();  // Play the sound when the player has collected 5 hits
        nextCombination();
    }
}

function playPopSound() {
    const source = audioContext.createBufferSource();
    source.buffer = popSoundBuffer;
    source.connect(audioContext.destination);
    source.start();
}

function setMapping(identifier) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/updateMapping', true);
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

// Start the Test
document.body.addEventListener('keydown', function (event) {
    const currentCombination = useAlternativeMapping ? alternativeCombinations[currentCombinationIndex] : combinations[currentCombinationIndex];
    if (currentCombination.includes(event.key)) {
        activateButton(event.key);
        checkCompletion();
    }
});

document.body.addEventListener('keyup', function (event) {
    const currentCombination = useAlternativeMapping ? alternativeCombinations[currentCombinationIndex] : combinations[currentCombinationIndex];
    if (currentCombination.includes(event.key)) {
        deactivateButton(event.key);
    }
});

// End the Test
document.body.addEventListener('keydown', function (event) {
    if (event.key === ' ' && currentCombinationIndex >= combinations.length) {
        if (useAlternativeMapping) {
            setMapping(identifier);
            localStorage.setItem('Mapping', 'Alternative');
        }
        window.location.href = 'pretest.html';
    }
});



// Initial rendering
renderButtons();