var randNote = 60;
var state = 1;
var soundOn = false;
var midiOn = true;
var transpose = 0;
var i = 0;
var streak = 0;
var interval = 1;
var interval2 = 0;
var longExplain = 0;
var isHighNote = false;
var newGame;
var winSound = new sound("SoundWin.mp3");
var loseSound = new sound("SoundLose.mp3");

//setup
setup();
function setup() {
    if (navigator.requestMIDIAccess) {
        // console.log('This browser supports WebMIDI!');
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        // console.log('WebMIDI is not supported in this browser.');
    }
}

function onMIDISuccess(midiAccess) {
    listenClick();
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            // console.log(state, progress);
        },
        onsuccess: function() {
            // console.log("Output is setup");
        }
    });
	var inputs = midiAccess.inputs;
	var outputs = midiAccess.outputs;

	for (var input of midiAccess.inputs.values()) {
		input.onmidimessage = getMIDIMessage;
	}
}

function onMIDIFailure() {
	document.querySelector('.step0').innerHTML = 'Error: Could not access MIDI devices. Connect a device and refresh to try again.';
}

function getMIDIMessage(message) {
	var command = message.data[0];
	var note = message.data[1];
	var velocity = (message.data.length > 2) ? message.data[2] : 0;
    var delay = 0;

	switch (command) {
		case 144: // noteOn
			if (velocity > 0) {
                console.log("midi: " + note);
                if (midiOn) { MIDI.noteOn(0, note, velocity, delay); }
                noteOnListener(note, velocity);
			} else {
                if (midiOn) { MIDI.noteOff(0, note, delay);}
				noteOffListener(note);
			}
			break;
        case 128: // noteOff
            if (midiOn) { MIDI.noteOff(0, note, delay); }
			noteOffCallback(note);
			break;
    }
}

function noteOnListener(note, velocity) {
    if (state == 1) {
        perfectPitchGame(note);
    }
}

function noteOffListener(note) {
    //does nothing right now
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = .4;
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

function playNoteString(letter, octave) {
    octave = (octave * 12) + 12;
    switch(letter) {
        case "A":
            playNote(-3+octave);
            break;
        case "A#":
            playNote(-2+octave);
            break;
        case "B":
            playNote(-1+octave);
            break;
        case "C":
            playNote(0+octave);
            break;
        case "C#":
            playNote(1+octave);
            break;
        case "D": 
            playNote(2+octave);
            break;
        case "D#": 
            playNote(3+octave);
            break;
        case "E":
            playNote(4+octave);
            break;
        case "F":
            playNote(5+octave);
            break;
        case "F#":
            playNote(6+octave);
            break;
        case "G":
            playNote(7+octave);
            break;
        case "G#":
            playNote(8+octave);
            break;
    }
}

function say(text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

//handlers
function handleFreePlay() {
    $("h2.info").fadeTo(500, .01);
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info'>Free Play: Press Space to Start Game</h2>");
        $("h2.info").fadeTo(0, .01);
        $("h2.info").fadeTo(500, 1);
    }, 500);
}

function handleGame(note) {
    $("h2.info").fadeTo(500, .01);
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info'>Guess, Streak: " + streak + "</h2>");
        $("h2.info").fadeTo(0, .01);
        $("h2.info").fadeTo(500, 1);
    }, 500);
  
}

function handlePiano(e) {
    var note = e.id;
    var delay = 0;
    var velocity = 127;
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
    console.log("virtual: " +note);
}

//listeners
function listenKey(info) {
    $(document).keyup(function(e){
        console.log(state);
        if(e.keyCode == 32){ //32=space
            console.log(state);
            if (state == 1) {
                setTimeout(function() {
                    game();
                }, 2000);
                say("Interval Training");
                handleGame();
                state = 0;
            } else {
                handleFreePlay();
                say("Free play");
                state = 1;
            }
        }

        if(e.keyCode == 13) {
            say("Press space and the browser will play an interval. Use the up and down arrow keys to switch between intervals. Press left arrow key if you hear the lower interval, and press the right arow key if you hear the higher interval. Press M to hear your streak.")
        }

        if(e.keyCode == 77) {
            say(streak);
        }

        //transposes up or down an octave
        if(e.keyCode == 72) {transpose+=12; console.log("T: " + transpose);}
        if(e.keyCode == 71) {transpose-=12;}
        if(e.keyCode == 78) {playNoteString("C", );}
    });   

    $(document).keydown(function(e){
        //using the keyboard as a piano
        // console.log(e.keyCode);
        if(e.keyCode == 65) {playNote(60+transpose);} //C4
        if(e.keyCode == 87) {playNote(61+transpose);} //C#4
        if(e.keyCode == 83) {playNote(62+transpose);} //D4
        if(e.keyCode == 69) {playNote(63+transpose);} //D#4
        if(e.keyCode == 68) {playNote(64+transpose);} //E4
        if(e.keyCode == 70) {playNote(65+transpose);} //F4
        if(e.keyCode == 84) {playNote(66+transpose);} //F#4
        if(e.keyCode == 74) {playNote(67+transpose);} //G4
        if(e.keyCode == 73) {playNote(68+transpose);} //G#4
        if(e.keyCode == 75) {playNote(69+transpose);} //A5
        if(e.keyCode == 79) {playNote(70+transpose);} //A#5
        if(e.keyCode == 76) {playNote(71+transpose);} //B5
        if(e.keyCode == 186) {playNote(72+transpose);} //C5

        if (state = 1) {
            if(e.keyCode == 37) { guess(0); }
            if(e.keyCode == 38) { intervalIndicator(true); }
            if(e.keyCode == 39) { guess(1); }
            if(e.keyCode == 40) { intervalIndicator(false); }
        }
    });
}

function intervalIndicator(direction) {
    window.speechSynthesis.cancel();
    clearTimeout(newGame);
    if (longExplain < 2) {
        if (direction) {
            interval++; interval2++; say("intervals" + interval2 + "and" + interval);
        } else {
            interval--; interval2--; say("intervals" + interval2 + "and" + interval);
        }
        longExplain++;
        newGame = setTimeout(function() {
            game();
        }, 1500);
    } else {
        if (direction) {
            interval++; interval2++; say(interval2 + "and" + interval);
        } else {
            interval--; interval2--; say(interval2 + "and" + interval);
        }
        newGame = setTimeout(function() {
            game();
        }, 1500);
    }

    
}

function playNote(note) {
    var delay = 0;
    var velocity = 127;
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
    console.log("Keyboard: " + note);
}

function listenClick(info) {
    $(document).click(function(e){
        if (!soundOn) {
            // say("on");
            say("Press Space to start Interval Training. Press Enter to hear instructions.")
            listenKey();
            handleFreePlay();
            soundOn = true;
        }
    });
    $(".blackkey").click(function(e) {
        console.log("clicked piano!");
        handlePiano(this);
    });
    $(".whitekey").click(function(e) {
        handlePiano(this);
        console.log("clicked piano!");
    });
}

function stopListen(info) {
    $(document).off();
}

//game functionality
function playRandNote() {
    var delay = 0;
    var note = 60 + Math.floor(Math.random() * 13);
    randNote = note;
    console.log("rand" + note);
    var velocity = 127;
    // MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
}

function game() {
    console.log(interval); //convert into say function
    playRandNote();
    var note = randNote - Math.floor(Math.random() * 2) + interval;
    setTimeout(function() {
        playNote(note);
    }, 400);
    if (note == randNote + interval) { isHighNote = false} else { isHighNote = true; }
}

function guess(guess) {
    if (guess == 0) {
        if (isHighNote) {
            console.log("win!");
            streak++;
            winSound.play();
        } else {
            console.log("lose!");
            streak = 0;
            loseSound.play();
        }
    } else {
        if (isHighNote) {
            loseSound.play();
            streak = 0;
            console.log("lose!");
        } else {
            console.log("win!");
            streak++;
            winSound.play();
        }
    }
    handleGame();
    setTimeout(function() {
        game();
    }, 1000);
}