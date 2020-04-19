var randNote = 60;
var state = 0;
var soundOn = false;
var midiOn = true;
var transpose = 0;
var i = 0;
var activeNotes = [];
var activeKeyDowns = [];
var chord = [];
var chordSize = 0;
var type = 0;
var chordTypeString = "major";
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
    if (chordSize == activeNotes.length) {
        checkChord();
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

function playNoteString(note) {
    var letter = note[0];
    var octave = note[1];
    // console.log(octave);
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
        $("h2.info").replaceWith("<h2 class='info'>Guess Note</h2>");
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
        if(e.keyCode == 32){ //32=space
            if (state != 1) {
                setTimeout(function() {
                    chordGame();
                }, 2000);
                say("Chord Training");
                state = 1;
            } else {
                chord = [];
                handleFreePlay();
                say("Free play");
                state = 0;
            }
        }
        //changes chord type
        if(e.keyCode == 38) {chordType(1); say(chordTypeString);}
        if(e.keyCode == 40) {chordType(-1); say(chordTypeString);}

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
            say("on");
            // say("Free play mode on, press space to toggle on perfect pitch training.")
            listenKey();
            handleFreePlay();
            soundOn = true;
        }
    });
    $(".whitekey").click(function(e) {
        console.log("clicked piano!");
        handlePiano(this);
    });
    $(".blackkey").click(function(e) {
        console.log("clicked piano!");
        handlePiano(this);
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

function chordGame() {
    var note = 60 + Math.floor(Math.random() * 13);
    chordGenerator(type, note);
    var noteLetter = noteName(note);
    say("play a " + noteLetter + "  " + chordTypeString + " chord");
    setTimeout(function() {
        playChord();
    }, 2500)
}

function playChord() {
    for (var i = 0; i < chord.length; i++) {
        playNote(chord[i]);
    }
}

function checkChord() {
    console.log("check");
    var match = true;
    for (var i = 0; i < activeNotes.length; i++) {
        if (chord.indexOf(activeNotes[i]) < 0) {
            match = false;
            break;
        }
    }
    if (match) {
        console.log("WIN");
        winSound.play();
        chord = [];
        setTimeout(function() {
            chordGame();
        }, 1000);
    }
}

function chordGenerator(type, note) {
    switch (type) {
        case 0: //major
            chord.push(note);
            chord.push(note + 4);
            chord.push(note + 7);
            chordSize = 3;
            chordTypeString = "major";
            break;
        case 1: //minor
            chord.push(note);
            chord.push(note + 3);
            chord.push(note + 7);
            chordSize = 3;
            chordTypeString = "minor";
            break;
        case 2: //diminished
            chord.push(note);
            chord.push(note + 3);
            chord.push(note + 6);
            chordSize = 3;
            chordTypeString = "diminished";
            break;
        case 3: //augmented
            chord.push(note);
            chord.push(note + 4);
            chord.push(note + 8);
            chordSize = 3;
            chordTypeString = "augmented";
            break;
        case 4: //2 chord
            chord.push(note);
            chord.push(note + 2);
            chord.push(note + 7);
            chordSize = 3;
            chordTypeString = "2 chord";
            break;
        case 5: //sustained
            chord.push(note);
            chord.push(note + 5);
            chord.push(note + 7);
            chordSize = 3;
            chordTypeString = "sustained";
            break;
        case 6: //major sixth
            chord.push(note);
            chord.push(note + 5);
            chord.push(note + 7);
            chord.push(note + 9);
            chordSize = 4;
            chordTypeString = "major sixth";
            break;
        case 7: //minor sixth
            chord.push(note);
            chord.push(note + 4);
            chord.push(note + 7);
            chord.push(note + 9);
            chordSize = 4;
            chordTypeString = "minor sixth";
            break;
        case 8: //major seventh
            chord.push(note);
            chord.push(note + 4);
            chord.push(note + 7);
            chord.push(note + 11);
            chordSize = 4;
            chordTypeString = "major seventh";
            break;
        case 9: //minor seventh
            chord.push(note);
            chord.push(note + 3);
            chord.push(note + 7);
            chord.push(note + 10);
            chordSize = 4;
            chordTypeString = "minor seventh";
            break;
    }
}

function noteName(note) {
    var noteNumber = note % 12
    var noteLetter;
    switch(noteNumber) {
        case 9:
            noteLetter = "A";
            break;
        case 10:
            noteLetter = "A-Sharp";
            break;
        case 11:
            noteLetter = "B";
            break;
        case 0:
            noteLetter = "C";
            break;
        case 1:
            noteLetter = "C Sharp";
            break;
        case 2: 
            noteLetter = "D";
            break;
        case 3: 
            noteLetter = "D Sharp";
            break;
        case 4:
            noteLetter = "E";
            break;
        case 5:
            noteLetter = "F";
            break;
        case 6:
            noteLetter = "F Sharp";
            break;
        case 7:
            noteLetter = "G";
            break;
        case 8:
            noteLetter = "G Sharp";
            break;
    }
    return noteLetter;
}

function chordType(num) {
    type += num;
    console.log(num);
    if (type < 0 || type > 9) {
        type -= num;
    }
    chord = [];
    switch (type) {
        case 0: //major
            chordTypeString = "major";
            break;
        case 1: //minor
            chordTypeString = "minor";
            break;
        case 2: //diminished
            chordTypeString = "diminished";
            break;
        case 3: //augmented
            chordTypeString = "augmented";
            break;
        case 4: //2 chord
            chordTypeString = "2 chord";
            break;
        case 5: //sustained
            chordTypeString = "sustained";
            break;
        case 6: //major sixth
            chordTypeString = "major sixth";
            break;
        case 7: //minor sixth
            chordTypeString = "minor sixth";
            break;
        case 8: //major seventh
            chordTypeString = "major seventh";
            break;
        case 9: //minor seventh
            chordTypeString = "minor seventh";
            break;
    }
}