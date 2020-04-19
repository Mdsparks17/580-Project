var randNote = 60;
var state = 0;
var soundOn = false;
var midiOn = true;
var transpose = 0;
var activeNotes = [];
var activeKeyDowns = [];
var streak = 0;
var i = 0;
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
    say("Click on page to Begin")
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
    addActiveNote(note);
    if (state == 1) {
        perfectPitchGame(note);
    }
}

function noteOffListener(note) {
    pullActiveNote();
    keyNoteOff(note);
}

function addActiveNote(note) {
    activeNotes.push(note);
    // console.log(activeNotes);
}

function pullActiveNote(note) {
    activeNotes.splice(activeNotes.indexOf(note), 1);
    // console.log(activeNotes);
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
        $("h2.info").replaceWith("<h2 class='info'>Guess Note, Streak: " + streak + "</h2>");
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
    if (state == 1) {
        perfectPitchGame(note);
    }
}

//listeners
function listenKey(info) {
    $(document).keyup(function(e){
        if(e.keyCode == 32){ //32=space
            if (state != 1) {
                setTimeout(function() {
                    playRandNote();
                }, 2000);
                say("Perfect Pitch Training");
                state = 1;
            } else {
                handleFreePlay();
                say("Free play");
                state = 0;
            }
        }

        //instructions
        if(e.keyCode == 13) {
            say("Press space and the browser will play one note, you have 3 tries to guess the right note using your preferred input device. Press M to hear your winning streak.")
        }

        if(e.keyCode == 77) {
            say(streak);
        }


        //transposes up or down an octave
        if(e.keyCode == 72) {transpose+=12; console.log("T: " + transpose);}
        if(e.keyCode == 71) {transpose-=12;}
        if(e.keyCode == 78) {playNoteString("C", );}

        //using the keyboard as a piano
        if(e.keyCode == 65) {noteOffListener(60+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(65), 1);} //C4
        if(e.keyCode == 87) {noteOffListener(61+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(87), 1);} //C#4
        if(e.keyCode == 83) {noteOffListener(62+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(83), 1);} //D4
        if(e.keyCode == 69) {noteOffListener(63+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(69), 1);} //D#4
        if(e.keyCode == 68) {noteOffListener(64+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(68), 1);} //E4
        if(e.keyCode == 70) {noteOffListener(65+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(70), 1);} //F4
        if(e.keyCode == 84) {noteOffListener(66+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(84), 1);} //F#4
        if(e.keyCode == 74) {noteOffListener(67+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(74), 1);} //G4
        if(e.keyCode == 73) {noteOffListener(68+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(73), 1);} //G#4
        if(e.keyCode == 75) {noteOffListener(69+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(75), 1);} //A5
        if(e.keyCode == 79) {noteOffListener(70+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(79), 1);} //A#5
        if(e.keyCode == 76) {noteOffListener(71+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(76), 1);} //B5
        if(e.keyCode == 186) {noteOffListener(72+transpose);activeKeyDowns.splice(activeKeyDowns.indexOf(186), 1);} //C5
    });   

    $(document).keydown(function(e){
        if (activeKeyDowns.indexOf(e.keyCode) == -1) {
            //using the keyboard as a piano
            if(e.keyCode == 65) {keyNoteOn(60+transpose);noteOnListener(60+transpose);activeKeyDowns.push(65)} //C4
            if(e.keyCode == 87) {keyNoteOn(61+transpose);noteOnListener(61+transpose);activeKeyDowns.push(87)} //C#4
            if(e.keyCode == 83) {keyNoteOn(62+transpose);noteOnListener(62+transpose);activeKeyDowns.push(83)} //D4
            if(e.keyCode == 69) {keyNoteOn(63+transpose);noteOnListener(63+transpose);activeKeyDowns.push(69)} //D#4
            if(e.keyCode == 68) {keyNoteOn(64+transpose);noteOnListener(64+transpose);activeKeyDowns.push(68)} //E4
            if(e.keyCode == 70) {keyNoteOn(65+transpose);noteOnListener(65+transpose);activeKeyDowns.push(70)} //F4
            if(e.keyCode == 84) {keyNoteOn(66+transpose);noteOnListener(66+transpose);activeKeyDowns.push(84)} //F#4
            if(e.keyCode == 74) {keyNoteOn(67+transpose);noteOnListener(67+transpose);activeKeyDowns.push(74)} //G4
            if(e.keyCode == 73) {keyNoteOn(68+transpose);noteOnListener(68+transpose);activeKeyDowns.push(73)} //G#4
            if(e.keyCode == 75) {keyNoteOn(69+transpose);noteOnListener(69+transpose);activeKeyDowns.push(75)} //A5
            if(e.keyCode == 79) {keyNoteOn(70+transpose);noteOnListener(70+transpose);activeKeyDowns.push(79)} //A#5
            if(e.keyCode == 76) {keyNoteOn(71+transpose);noteOnListener(71+transpose);activeKeyDowns.push(76)} //B5
            if(e.keyCode == 186) {keyNoteOn(72+transpose);noteOnListener(72+transpose);activeKeyDowns.push(186)} //C5
        }
    });
}

function playNote(note) {
    var delay = 0;
    var velocity = 127;
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
    console.log("Keyboard: " + note);
    if (state == 1) {
        perfectPitchGame(note);
    }
}

function keyNoteOn(note) {
    var delay = 0;
    var velocity = 127;
    MIDI.noteOn(0, note, velocity, delay);
}

function keyNoteOff(note) {
    var delay = 0;
    MIDI.noteOff(0, note, delay);
}

function listenClick(info) {
    $(document).click(function(e){
        if (!soundOn) {
            // say("on"); 
            say("Free play mode on, press space to toggle on perfect pitch training. Press enter for instructions.")
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
    handleGame(note);
}

function perfectPitchGame(note) {
    i++;
    if (note == randNote) {
        i = 0;
        match();
    } else {
        if (i > 2) {
            i = 0;
            miss();
        }
    }
}

function match() {
    streak++;
    console.log("Match!");
    setTimeout(function() {
        winSound.play()
        setTimeout(function() {
            playRandNote();
        }, 500);
    }, 500);
}

function miss() {
    streak = 0;
    console.log("Wrong!");
    setTimeout(function() {
        loseSound.play()
        setTimeout(function() {
            playRandNote();
        }, 500);
    }, 500);
}