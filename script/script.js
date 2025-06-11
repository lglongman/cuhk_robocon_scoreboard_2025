// constants
const RESET = 0, SETUP = 0, GAME = 1, FINAL = 2;

// elements
let timerTitle = null;
let timerTime = null;
let timerSmallTime = null;
let startBtn = null;
let addTimeBtn = null;
let switchBtn = null;
let nextBtn = null;

//var
var gameMode = SETUP;
var gameStatus = GAME;
var countDown = true;
var totalTime = [5, 61, 62];
var roundTime = [5, 10];
let timer = null;
var startTime = 0, roundStartTime = 0;
var elapsedTime = 0, roundElapsedTime = 0;
var lastTimerTime = 0;
var isRunning = false;

function init() {
    console.log("init");

    timerTitle = document.getElementById("timerTitle");
    timerTime = document.getElementById("timerTime");
    timerSmallTime = document.getElementById("timerSmallTime");
    startBtn = document.getElementById("startBtn");
    addTimeBtn = document.getElementById("addTimeBtn");
    nextBtn = document.getElementById("nextBtn");
    switchBtn = document.getElementById("switchBtn");
}

/*------TIMER------*/
function switchTimerMode() {
    // console.log("switch");
    gameMode += 1;
    if (gameMode > FINAL) gameMode = SETUP;
    gameStatus = GAME;

    var txt;
    if (gameMode == SETUP) {
        txt = "Set-Up";
        countDown = true;
    }
    else if (gameMode == GAME) {
        txt = "Game";
        countDown = false;
    }
    else if (gameMode == FINAL) {
        txt = "Final";
        countDown = false;
    }

    switchBtn.textContent = txt;
    addTimeBtn.disabled = true;
    nextBtn.disabled = true;
    
    resetTimer();
}


function handleTimer() {
    // addTimeBtn.disabled = false;
    // nextBtn.disabled = false;

    // start/ continue timer
    if (!isRunning) {
        runTimer();
        startBtn.textContent = "Pause";
        addTimeBtn.disabled = true;
        nextBtn.disabled = true;
        if (gameMode == GAME && gameStatus == RESET) {
            nextBtn.textContent = "Next Round";
        }
        else if (gameMode == GAME && gameStatus == GAME) {
            nextBtn.textContent = "10s Reset";
        }
        switchBtn.disabled = true;
    }
    // stop timer
    else {
        stopTimer();
        startBtn.textContent = "Continue";
        if (gameMode != SETUP) {
            nextBtn.disabled = false;
        }
        if (gameMode != SETUP && gameStatus != RESET) {
            addTimeBtn.disabled = false;
        }
        switchBtn.disabled = false;
    }
}

function runTimer() {
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    roundStartTime = Date.now() - roundElapsedTime;

    console.log((gameStatus == GAME? "GAME | " : "SETUP |"), "elapsedTime: ", elapsedTime / 1000, "roundTime: ", roundElapsedTime / 1000);

    timer = setInterval(updateTimer, 5);
    // timerTime.classList.toggle("blink", false);
}

function stopTimer() {
    console.log("stopped");
    isRunning = false;
    clearInterval(timer);
    if (gameStatus == GAME) elapsedTime = Date.now() - startTime;
    roundElapsedTime = Date.now() - roundStartTime;

    console.log((gameStatus == GAME? "GAME | " : "SETUP |"), "elapsedTime: ", elapsedTime / 1000, "roundTime: ", roundElapsedTime / 1000);
}

function updateTimer() {
    currentTime = Date.now();
    if (gameStatus == GAME) elapsedTime = currentTime - startTime;
    if (gameMode != SETUP) roundElapsedTime = currentTime - roundStartTime;
    console.log((gameStatus == GAME? "GAME | " : "SETUP |"), "elapsedTime: ", elapsedTime / 1000, "roundTime: ", roundElapsedTime / 1000);
    
    //timer display
    var timerTimeDisplay, roundTimerTimeDisplay;
    if (countDown) {
        timerTimeDisplay = totalTime[gameMode] - Math.floor(elapsedTime / 1000);
        if (timerTimeDisplay < 0) timerTimeDisplay = 0;
    }
    else {
        timerTimeDisplay = Math.floor(elapsedTime / 1000);
        if (timerTimeDisplay > totalTime[gameMode]) timerTimeDisplay = totalTime[gameMode];
    }
    showTimerTime(timerTimeDisplay);
    
    // small timer display
    if (gameMode != SETUP) {
        roundTimerTimeDisplay = roundTime[gameStatus] - Math.floor(roundElapsedTime / 1000);
        if (roundTimerTimeDisplay < 0) roundTimerTimeDisplay = 0;
        timerSmallTime.textContent = roundTimerTimeDisplay;
    }
    
    // if (timerTimeDisplay == 12 && timerTimeDisplay != lastTimerTime) {
    //     loadAudio(SHORT_BEEP);
    // }
    
    // last 10s timer
    if (timerTimeDisplay <= 10 && timerTimeDisplay > 0) {
        timerTime.style.color = "red";
        // if (timerTimeDisplay != lastTimerTime) {
        //     audio[SHORT_BEEP].play();
        // }
    }
    else {
        timerTime.style.color = "black";
    }
    
    // Round end
    if ((roundElapsedTime / 1000) >= roundTime[gameStatus]) {
        stopTimer();
        roundStartTime = 0;
        roundElapsedTime = 0;

        startBtn.disabled = true;
        nextBtn.disabled = false;
        switchBtn.disabled = false;
        startBtn.textContent = "Next";
    }
    
    // Time end
    if ((elapsedTime / 1000) >= totalTime[gameMode]) {
        stopTimer();
        startTime = 0;
        elapsedTime = 0;
        
        switchBtn.disabled = false;
        startBtn.textContent = "Restart";
        timerTime.classList.toggle("blink", true);
        
        // audio[LONG_BEEP].play();
        
        //! if (gameMode == GAME) {
        //!     displayScore();
        //!     checkProgress();
        //! }
    }

    lastTimerTime = timerTimeDisplay;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    roundStartTime = 0;
    roundElapsedTime = 0;

    switchBtn.disabled = false;
    timerTime.style.color = "black";
    timerTime.classList.toggle("blink", false);
    
    startBtn.textContent = "Start";
    var txt;
    if (gameMode == SETUP) txt = "Set-Up Time";
    else if (gameMode == GAME) txt = "Game";
    else if (gameMode == FINAL) txt = "Final";
    timerTitle.textContent = txt;
    showTimerTime(totalTime[gameMode])
}

function showTimerTime(time) {
    var min = Math.floor(time / 60);
    var sec = time % 60;
    var txt = (min < 10? "0" : "") + min + ":" + (sec < 10? "0" : "") + sec;

    timerTime.textContent = txt;
}

function startNextRound() {
    startBtn.disabled = false;
    addTimeBtn.disabled = false;

    roundStartTime = 0;
    roundElapsedTime = 0;
    elapsedTime = Math.floor(elapsedTime / 1000) * 1000;
    
    //! // proceed to 10s reset time
    //! if (gameStatus == GAME) {
    //!     gameStatus = RESET;
    //!     runTimer();
    //!     startBtn.textContent = "Pause";
    //!     addTimeBtn.disabled = true;
    //!     switchBtn.disabled = true;
    //! }
    //! // skip 10s reset time
    //! else if (gameStatus == RESET) {
    //!     gameStatus = GAME;
    //!     if (isRunning) {
    //!         stopTimer();
    //!     }
    //!     runTimer();
    //!     startBtn.textContent = "Pause";
    //!     addTimeBtn.disabled = true;
    //!     nextBtn.disabled = true;
    //!     switchBtn.disabled = true;
    //! }
    
    gameStatus = gameStatus == RESET? GAME : RESET;
    
    console.log("next");
    handleTimer();
}