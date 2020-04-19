var randNote = 60;
var state = 0;
var soundOn = false;
var midiOn = true;
var transpose = 0;
var i = 0;
var bpmSound = new sound("SoundBPM.mp3");

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

function say(text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

//handlers
function handleFreePlay() {
    $("h2.info").fadeTo(500, .01);
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info'>Press Space to Start!</h2>");
        $("h2.info").fadeTo(0, .01);
        $("h2.info").fadeTo(500, 1);
    }, 500);
  
}

function handleGame(note) {
    $("h2.info").fadeTo(500, .01);
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info'>Press Space to the Beat!</h2>");
        $("h2.info").fadeTo(0, .01);
        $("h2.info").fadeTo(500, 1);
    }, 500);
}

function handleBeat(note) {
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info' style='background-color: #f1c32b;'>Press Space to the Beat!</h2>");
      
    }, 50);
    $("h2.info").replaceWith("<h2 class='info' style='background-color: grey;'>Press Space to the Beat!</h2>");
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
    $(document).keydown(function(e){
        if(e.keyCode == 32) { //space
            if (state != 1) {
                setTimeout(function() {
                    game();
                }, 1000);
                state = 1;
                say("Rhythm Training");
                handleGame();
            } else {
                if (countDown > 0) {
                    handleBeat();
                    userBeat();
                }
            }
        }
        if (e.keyCode == 13) {
            say("Press space to the beat, you have 4 practice beats and then 10 beats without sound. Try and keep as steady tempo as possible.")
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

function listenClick(info) {
    $(document).click(function(e){
        if (!soundOn) {
            say("Press Space to start, press enter for instructions.")
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
//https://github.com/tgwizard/bpm-game/blob/gh-pages/js/keep-bpm.js
var beatTimes = [];
var countDown = 14;
var targetBpm = 60;
let metronome;
function userBeat() {
    //first 4 beats are with metronome and do not count
    if (countDown > 10) {
        countDown--;
    } else {
    //next 10 beats are without metronome and do count
        countDown--;
        console.log(calcBPM());
        clearInterval(metronome);
        beatTimes.push(new Date());
        if (beatTimes[9] != null) {
            finalScore(calcBPM());
        }
    }    
}

function calcBPM() {
    var diffs = [];
    
    _.reduce(_.rest(beatTimes, 1), function(prev, curr) {
        diffs.push(curr - prev);
        return curr;
      }, beatTimes[0]);
  
      var MS_PER_MIN = 60000;
  
      var bpms = _.map(diffs, function(diff) {
        return MS_PER_MIN / diff;
      });
  
      var sumBpm = _.reduce(bpms, function(memo, x) { return memo + x; }, 0);
      var avgBpm = Math.round(sumBpm / bpms.length);
  
      var targetDiff = MS_PER_MIN / targetBpm;
      var diffsAgainstTargetDiff = _.map(diffs, function(diff) {
        return Math.round(diff - targetDiff);
      });
  
      return avgBpm;
    //   return {
    //     avg: avgBpm,
    //     bpmDiffs: diffsAgainstTargetDiff
    //   };
}

function game() {
    var MIN = 60;
    var MAX = 200;
    targetBpm = Math.round(MIN + Math.random() * (MAX - MIN));
    startMetronome();
};

function startMetronome() {
    metronome = setInterval(function() {
        bpmSound.play();
    }, 60000/targetBpm);
}

function finalScore(score) {
    say("Your BPM:" + score + ". Actual BPM" + targetBpm);

    $("h2.info").fadeTo(500, .01);
    setTimeout(function() {
        $("h2.info").replaceWith("<h2 class='info'>Your BPM: " + score + "\n" + "Actual BPM: " + targetBpm +  "</h2>");
        $("h2.info").fadeTo(0, .01);
        $("h2.info").fadeTo(500, 1);
    }, 500);
}