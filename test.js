
export function listen(info) {
    $(document).one('click', '.start', async function(e){  
        e.stopPropagation();
        midiOutputSetup();
        midiInputSetup();
    });
    $(document).keyup(function(e){
        if(e.keyCode == 32){
            console.log("space pressed");
            game();
        }
    });

};
export function stopListen(info) {
    $(document).off();
};
export function midiOutputSetup() {
    //MIDI.js
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {
            // var delay = 0; // play one note every quarter second
            // var note = 50; // the MIDI note
            // var velocity = 127; // how hard the note hits
            // // play the note
            // MIDI.setVolume(0, 127);
            // MIDI.noteOn(0, note, velocity, delay);
            // MIDI.noteOff(0, note, delay + 0.75);
            console.log("setup");
        }
    });
   
};

export function midiInputSetup() {
    // https://www.smashingmagazine.com/2018/03/web-midi-api/
    if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');
    } else {
        console.log('WebMIDI is not supported in this browser.');
    }

    //

    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);

    // function onMIDISuccess(midiAccess) {
    //     console.log(midiAccess);
    //     var inputs = midiAccess.inputs;
    //     var outputs = midiAccess.outputs;
    // }

    function onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
        renderNoDevice();
    }

    function onMIDISuccess(midiAccess) {
        for (var input of midiAccess.inputs.values()) {
            input.onmidimessage = getMIDIMessage;
        }
    }
    
    // function getMIDIMessage(midiMessage) {
    //     console.log(midiMessage);
    // }

    function getMIDIMessage(message) {
        var command = message.data[0];
        var note = message.data[1];
        var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
    
        var delay = 0;
    
        switch (command) {
            case 144: // noteOn
                if (velocity > 0) {
                    // noteOn(note, velocity);
                    MIDI.noteOn(0, note, velocity, delay);
                    if (!(note == undefined)) { noteGlobal = note; }
                    console.log(note);
                    // console.log(noteGlobal);
                } else {
                    // noteOff(note);
                    // console.log("note off");
                    MIDI.noteOff(0, note, delay);

                }
                break;
            case 128: // noteOff
                // noteOff(note);
                console.log("note off");
                MIDI.noteOff(0, note, delay);
                break;
            // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
        }
    } 
};
export function getSingle() {
    
};
export function game() {
    //generate tone
    var delay = 0;
    var note = 60 + Math.floor(Math.random() * 13);
    console.log(note);
    var velocity = 127;
    // MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);

    //find input
    WebMidi.enable(function () {

        // Viewing available inputs and outputs
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
    
        // Retrieve an input by name, id or index
        var input = WebMidi.getInputByName("My Awesome Keyboard");
        // OR...
        // input = WebMidi.getInputById("1809568182");
        // input = WebMidi.inputs[0];
    
        // Listen for a 'note on' message on all channels
        input.addListener('noteon', 'all',
            function (e) {
                console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            }
        );
    
        // Listen to pitch bend message on channel 3
        input.addListener('pitchbend', 3,
            function (e) {
                console.log("Received 'pitchbend' message.", e);
            }
        );
    
        // Listen to control change message on all channels
        input.addListener('controlchange', "all",
            function (e) {
                console.log("Received 'controlchange' message.", e);
            }
        );
    
        // Remove all listeners for 'noteoff' on all channels
        input.removeListener('noteoff');
    
        // Remove all listeners on the input
        input.removeListener();
    
    });

    //test if they are the same
    

}
export function load() {
    const $root = $('#root');
    $root.html('');

    // const loadInfo = async function() {
    //     let info = "";
    //     $root.append(info);
    // };
    // loadInfo();
    listen();
};
$(function() {
    load();
});