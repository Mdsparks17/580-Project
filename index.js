say("Welcome to Piano Pro!");
listenKey();
var num = 0;
var element;

pageNav(0);

function say(text) {
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

function listenKey(info) {
    $(document).keydown(function(e){
        if(e.keyCode == 38) {pageNav(-1)}
        if(e.keyCode == 40) {pageNav(1)}
        if(e.keyCode == 13) {click()}
    });
}

function pageNav(direction) {
    num += direction;
    if (num < 0 || num > 3) {
        num -= direction;
    }
    element = document.getElementById("hello" + num);
    var text = element.innerText || element.textContent;
    say(text);
    console.log(element);
    element.focus();
}

function click() {
    element.click();
}