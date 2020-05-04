var count = 0;

say("Hello and Welcome to Piano Pro. Press Enter for more info.");
listenKey();


function say(text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

function listenKey(info) {
    $(document).keydown(function(e){
        if(e.keyCode == 13) { 
            console.log("hello");
            count++;
            if (count == 1) {
                say("Piano Pro is an app intended for assisting both Sighted and Blind peoples better learn the Piano. While most of the app is functional using your computer keyboard, it is possible to use piano pro with your electric piano! Follow this guide for Yamahas or Google your piano's manual for driver installation and connectivity.");
                say("Press Enter for controls")
            } else {
                say("Press Space to start game, Press Enter for help, press m for score, press up arrow for navigating up options, press down arrow for navigating down options. Use the home row and row above for piano, and Press G and H to move octaves.")
            }
        }
    });
}
