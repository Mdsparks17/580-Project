var randNote = 60;
var state = 0;
var soundOn = false;
var winSound = new sound("SoundWin.mp3");
var loseSound = new sound("SoundLose.mp3");

/*
setup
*/
if (navigator.requestMIDIAccess) {
	// console.log('This browser supports WebMIDI!');
	navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
	// console.log('WebMIDI is not supported in this browser.');
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
                MIDI.noteOn(0, note, velocity, delay);
                noteOnListener(note, velocity);
			} else {
                MIDI.noteOff(0, note, delay);
				noteOffListener(note);
			}
			break;
        case 128: // noteOff
            MIDI.noteOff(0, note, delay);
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
    this.sound.volume = .05;
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

function say(text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

/*
handlers
*/
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
    if (state == 1) {
        perfectPitchGame(note);
    }
}

/*
listeners
*/
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
    });   
}

function listenClick(info) {
    $(document).click(function(e){
        say("Free play mode on, press space to toggle perfect pitch training.")
        if (!soundOn) {
            // say("on");
            listenKey();
            handleFreePlay();
            soundOn = true;
        }
    });
    $(".black").click(function(e) {
        console.log("clicked piano!");
        handlePiano(this);
    });
    $(".white").click(function(e) {
        handlePiano(this);
        console.log("clicked piano!");
    });
}

function stopListen(info) {
    $(document).off();
}

/*
game functionality
*/
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
    if (note == randNote) {
        console.log("Match!");
        setTimeout(function() {
            winSound.play()
            setTimeout(function() {
                playRandNote();
            }, 500);
        }, 500);
    } else {
        console.log("Wrong!");
        setTimeout(function() {
            loseSound.play()
        }, 500);
    }
}