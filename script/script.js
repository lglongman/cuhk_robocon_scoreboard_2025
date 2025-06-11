// constants
const RESET = 0, SETUP = 0, GAME = 1, FINAL = 2;
const RED = 0, BLUE = 1;

// elements
let timerTitle = null;
let timerTime = null;
let timerSmallTime = null;
let startBtn = null;
let addTimeBtn = null;
let switchBtn = null;
let nextBtn = null;
let teamScoreLbl = [null, null];

//var
var gameMode = SETUP;
var gameStatus = GAME;
var countDown = true;
var totalTime = [60, 12, 16];
var roundTime = [10, 20];
let timer = null;
let readyTimer = null;
var startTime = 0, roundStartTime = 0, readyStartTime = 0;
var elapsedTime = 0, roundElapsedTime = 0, readyElapsedTime = 0;
var lastTimerTime = 0;
var isRunning = false;
var finishReady = true;

var score = [0, 0];

function init() {
    console.log("init");
    document.addEventListener('contextmenu', event => event.preventDefault());

    timerTitle = document.getElementById("timerTitle");
    timerTime = document.getElementById("timerTime");
    timerSmallTime = document.getElementById("timerSmallTime");
    startBtn = document.getElementById("startBtn");
    addTimeBtn = document.getElementById("addTimeBtn");
    nextBtn = document.getElementById("nextBtn");
    switchBtn = document.getElementById("switchBtn");

    teamScoreLbl[RED] = document.getElementById("redScore");
    teamScoreLbl[BLUE] = document.getElementById("blueScore");
}

/*------TIMER------*/
function switchTimerMode() {
    // console.log("switch");
    gameMode += 1;
    if (gameMode > FINAL) gameMode = SETUP;
    gameStatus = GAME;

    var txt;
    if (gameMode == SETUP) {
        txt = "Game";
        countDown = true;
    }
    else if (gameMode == GAME) {
        txt = "Final";
        countDown = false;
    }
    else if (gameMode == FINAL) {
        txt = "Set-Up";
        countDown = false;
    }
    
    finishReady = false;

    switchBtn.textContent = txt;
    addTimeBtn.disabled = true;
    nextBtn.disabled = true;
    
    resetTimer();
    updateScore(RED, -100);
    updateScore(BLUE, -100);
}


function handleTimer() {
    timerTime.classList.toggle("blink", false);

    // start/ continue timer
    if (!isRunning) {
        if (gameMode != SETUP && !finishReady) {
            startBtn.disabled = true;
        }
        runTimer();
        startBtn.textContent = "Pause";
        addTimeBtn.disabled = true;
        nextBtn.disabled = true;
        if (gameMode != SETUP && gameStatus == RESET) {
            nextBtn.textContent = "Next Round";
        }
        else if (gameMode != SETUP && gameStatus == GAME) {
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
    if (!finishReady) {
        readyStartTime = Date.now() - readyElapsedTime;
    }

    console.log((gameStatus == GAME? "GAME | " : "SETUP |"), "elapsedTime: ", elapsedTime / 1000, "roundTime: ", roundElapsedTime / 1000);

    timer = setInterval(updateTimer, 5);
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

    var timerTimeDisplay, roundTimerTimeDisplay;
    if (finishReady) {
        if (gameStatus == GAME) elapsedTime = currentTime - startTime;
        if (gameMode != SETUP) roundElapsedTime = currentTime - roundStartTime;
        console.log((gameStatus == GAME? "GAME | " : "SETUP |"), "elapsedTime: ", elapsedTime / 1000, "roundTime: ", roundElapsedTime / 1000);
        
        //timer display
        if (countDown) {
            timerTimeDisplay = totalTime[gameMode] - Math.floor(elapsedTime / 1000);
            if (timerTimeDisplay < 0) timerTimeDisplay = 0;
        }
        else {
            timerTimeDisplay = Math.floor(elapsedTime / 1000);
            if (timerTimeDisplay > totalTime[gameMode]) timerTimeDisplay = totalTime[gameMode];
        }
        if (gameMode != SETUP && elapsedTime / 1000 < 1) {
            timerTime.textContent = "GO";
        }
        else {
            showTimerTime(timerTimeDisplay);
        }
        
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
        if (totalTime[gameMode] - elapsedTime / 1000 <= 3) {
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
            finishReady = false;
            stopTimer();
            startTime = 0;
            elapsedTime = 0;
            roundStartTime = 0;
            roundElapsedTime = 0;
            
            switchBtn.disabled = false;
            startBtn.textContent = "Restart";
            timerTime.classList.toggle("blink", true);
            timerSmallTime.textContent = 0;
            
            // audio[LONG_BEEP].play();
        }

        lastTimerTime = timerTimeDisplay;
    }

    else {
        readyElapsedTime = currentTime - readyStartTime;
        if (readyElapsedTime / 1000 < 1) {
            timerTimeDisplay = "READY";
        }
        else if (readyElapsedTime / 1000 < 6) {
            timerTimeDisplay = 6 - Math.floor(readyElapsedTime / 1000);
        }
        // start
        else {
            timerSmallTime.style.color = "rgb(0, 0, 0, 1)";
            readyElapsedTime = 0;
            elapsedTime = 0;
            roundElapsedTime = 0;

            readyStartTime = 0;
            startTime = Date.now() - elapsedTime;
            roundStartTime = Date.now() - roundElapsedTime;
            startBtn.disabled = false;
            finishReady = true;
        }


        timerTime.textContent = timerTimeDisplay;
    }
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
    timerSmallTime.style.color = "rgba(0, 0, 0, 0)";
    
    startBtn.textContent = "Start";
    var txt;
    if (gameMode == SETUP) txt = "Set-Up Time (60s)";
    else if (gameMode == GAME) txt = "Game (120s)";
    else if (gameMode == FINAL) txt = "Final (160s)";
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
        
    gameStatus = gameStatus == RESET? GAME : RESET;
    
    console.log("next");
    handleTimer();
}

function addRoundTime() {
    addTimeBtn.disabled = true;
    if (gameMode != SETUP && gameStatus != RESET) {
        console.log("add");

        roundElapsedTime -= 10000;
        if (roundElapsedTime < 0) {
            roundElapsedTime = 0;
        }
        elapsedTime = Math.floor(elapsedTime / 1000) * 1000;

        roundTimerTimeDisplay = roundTime[gameStatus] - Math.floor(roundElapsedTime / 1000);
        if (roundTimerTimeDisplay < 0) roundTimerTimeDisplay = 0;
        timerSmallTime.textContent = roundTimerTimeDisplay;
    }
}


//? SCOREBOARD==================================================================================================
function updateScore(team, val) {
    score[team] += val;
    if (score[team] > 99) score[team] = 99;
    else if (score[team] < 0) score[team] = 0;
    teamScoreLbl[team].textContent = score[team];
}