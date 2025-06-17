/*CONST*/

/*CONTROLLER*/
const CROSS = 0;
const CIRCLE = 1;
const SQUARE = 2;
const TRIANGLE = 3;

const UP = 12;
const DOWN = 13;
const LEFT = 14;
const RIGHT = 15;

const SHARE = 8;
const OPTION = 9;
const PS = 16

const L1 = 4;
const R1 = 5;
const L2 = 6;
const R2 = 7;
const L3 = 10;
const R3 = 11;

var conIO = [];
var last_conIO = [];
var conIOToggle = [];

function controllerLoop() {
    const gamepad = navigator.getGamepads()[0];
    const controllerEnable = document.getElementById("controllerEnable");
    if (gamepad) {
        // buttons
        for (var i = 0; i < gamepad.buttons.length; i++) {
            conIO[i] = gamepad.buttons[i].pressed;
            // output.textContent += "Button " + i + ": " + conIO[i] + "\n";
        }
        getToggle(conIO.length);

        if (controllerEnable.checked) {
            readControllerInput();
        }
    }

    requestAnimationFrame(controllerLoop);
}

function getToggle(num) {
    for (var i = 0; i < num; i++) {
        if (conIO[i] && conIO[i] != last_conIO[i]) {
            conIOToggle[i] = true;
        }
        else {
            conIOToggle[i] = false;
        }
        last_conIO[i] = conIO[i];
    }
}

window.addEventListener("gamepadconnected", (event)=>{
    // alert("DS5 Connected");
    console.log("DS5 Connected");
    const controllerLbl = document.getElementById("controllerLbl");
    controllerLbl.textContent = "Controller (Connected)";
    controllerLoop();
});
window.addEventListener("gamepaddisconnected", (event)=>{
    alert("DS5 Disonnected");
    console.log("DS5 Disonnected");
    const controllerLbl = document.getElementById("controllerLbl");
    controllerLbl.textContent = "Controller (Disconnected)";
    cancelAnimationFrame(controllerLoop);
});

/*CONTROLLER EVENTS*/
function readControllerInput() {
    if (conIOToggle[L1] && !startBtn.disabled) {
        handleTimer();
    }
    else if (conIOToggle[R1] && !switchBtn.disabled) {
        switchTimerMode();
    }
    else if (conIOToggle[TRIANGLE] && !nextBtn.disabled) {
        startNextRound();
    }
    else if (conIOToggle[UP] && !addTimeBtn.disabled) {
        addRoundTime();
    }

    if (conIO[R2]) {
        if (conIOToggle[LEFT]) {
            updateScore(RED, -2);
        }
        else if (conIOToggle[DOWN]) {
            updateScore(RED, -3);
        }
        else if (conIOToggle[RIGHT]) {
            updateScore(RED, -7);
        }

        if (conIOToggle[SQUARE]) {
            updateScore(BLUE, -2);
        }
        else if (conIOToggle[CROSS]) {
            updateScore(BLUE, -3);
        }
        else if (conIOToggle[CIRCLE]) {
            updateScore(BLUE, -7);
        }
    }
    else {
        if (conIOToggle[LEFT]) {
            updateScore(RED, 2);
        }
        else if (conIOToggle[DOWN]) {
            updateScore(RED, 3);
        }
        else if (conIOToggle[RIGHT]) {
            updateScore(RED, 7);
        }

        if (conIOToggle[SQUARE]) {
            updateScore(BLUE, 2);
        }
        else if (conIOToggle[CROSS]) {
            updateScore(BLUE, 3);
        }
        else if (conIOToggle[CIRCLE]) {
            updateScore(BLUE, 7);
        }
    }
}


/*KEYBOARD EVENT LISTENER*/
window.addEventListener('keydown', function(event) {
    const keyboardEnable = document.getElementById("keyboardEnable");
    if (keyboardEnable.checked) {
        if (event.key === ' ' && !startBtn.disabled) {
            event.preventDefault();
            handleTimer();
        }
        else if (event.key === '+' && !addTimeBtn.disabled) {
            event.preventDefault();
            addRoundTime();
        }
        else if (event.key === 'Tab' && !switchBtn.disabled) {
            event.preventDefault();
            switchTimerMode();
        }
        else if (event.key === 'Enter' && !nextBtn.disabled) {
            event.preventDefault();
            startNextRound();
        }
    
        var sign = event.shiftKey ? -1 : 1;
        
        // RED TEAM
        if (event.key === 'z' || event.key === 'Z') {
            event.preventDefault();
            updateScore(RED, 2 * sign);
        }
        else if (event.key === 'x' || event.key === 'X') {
            event.preventDefault();
            updateScore(RED, 3 * sign);
        }
        else if (event.key === 'c' || event.key === 'C') {
            event.preventDefault();
            updateScore(RED, 7 * sign);
        }
    
        // BLUE TEAM
        if (event.key === ',' || event.key === '<') {
            event.preventDefault();
            updateScore(BLUE, 2 * sign);
        }
        else if (event.key === '.' || event.key === '>') {
            event.preventDefault();
            updateScore(BLUE, 3 * sign);
        }
        else if (event.key === '/' || event.key === '?') {
            event.preventDefault();
            updateScore(BLUE, 7 * sign);
        }
    }
});