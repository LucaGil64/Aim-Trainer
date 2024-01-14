import {selectGameMode, selectDifficulty, selectCursor, selectTarget, playButton, scoreEasy, scoreMedium, scoreHard, scoreImpossible, mainContainer, gameContainer, resetCookiesButton, clickMeToStart, counterSeconds, counterMillieconds, score, targetDiana,treeTwoOneGo, tapSound} from "./elements.js";



export let topScoresObject = {
    tap: {easy:0,medium:0,hard:0,impossible:0},
    track: {easy:0,medium:0,hard:0,impossible:0},
    maze: {easy:0,medium:0,hard:0,impossible:0}
}

export const updateGameModeTopScore = ()=>{
    isJSON()
    updateCookie()
    topScoresObject = JSON.parse(getCookie());
    
    scoreEasy.textContent = topScoresObject[selectGameMode.value].easy;
    scoreMedium.textContent = topScoresObject[selectGameMode.value].medium;
    scoreHard.textContent = topScoresObject[selectGameMode.value].hard;
    scoreImpossible.textContent = topScoresObject[selectGameMode.value].impossible;

    console.log(JSON.parse(getCookie()))
}

export const updateCursor = ()=>{
    document.documentElement.style.cursor = selectCursor.value;
}
export const playButtonActioned = ()=>{
    animation(mainContainer,"disappear","1s");
    animation(clickMeToStart,"appear","2s")
    animation(gameContainer,"appear","2s");

    targetDiana.style.width = `${getPixels()}px`;
    targetDiana.style.height = `${getPixels()}px`;

    restartEveryThing();
}

let gameState;
export const startGame = async () => {
    gameState = true;
    clickMeToStart.disabled = true;
    await countDown();
    startCounter().then(res=> {scoreNum--;endGame()})

    whatGameModeToPlay(selectGameMode.value);
}

export const countDown = () => {

    clickMeToStart.textContent = "";
    let dot = setInterval(()=>{
        clickMeToStart.textContent += "."
        if(clickMeToStart.textContent.length == 4) clearInterval(dot);
    },250)

    return new Promise((resolve) => {

        let num = 3;
        let timer = setInterval(() => {
            animation(clickMeToStart,"ready-set-go","3s");
            treeTwoOneGo.play()
            
            clickMeToStart.textContent = num;
            num--;

            if (num < 0) {
                clearInterval(timer);
                animation(clickMeToStart, "disappear", "0s");
                resolve(); // Resolve the promise when countdown finishes
            }
        }, 1000);

    });
}

export const startCounter = ()=>{
    return new Promise((resolve) => {

        let timer = setInterval(()=>{
            let milliseconds = counterMillieconds.textContent;
            let seconds = counterSeconds.textContent;
    
            milliseconds--
            if(milliseconds < 10)counterMillieconds.textContent = `0${milliseconds}`;
            else counterMillieconds.textContent = milliseconds;
    
            
    
            if(seconds == 0 && milliseconds == 0){
                clearInterval(timer)
                resolve()
            }
    
            else if(milliseconds == 0){
                counterMillieconds.textContent = "00";
                seconds--
                counterSeconds.textContent = seconds;
    
                counterMillieconds.textContent = 99;
            }
        },10)

    })
}


export const whatGameModeToPlay = (gameMode)=>{

    targetDiana.classList.remove("target-tap","target-track","targuet-maze")
    animation(targetDiana,"appear","0s");

    targetDiana.removeEventListener("click",tapTargetDiana);
    targetDiana.removeEventListener("mousemove",trackTargetDiana);
    targetDiana.removeEventListener("click",mazeTargetDiana);

    if(gameMode == "tap"){
        console.log("GAME-MODE: TAP")
        targetDiana.classList.add("target-tap");
        targetDiana.addEventListener("click",tapTargetDiana,tapTargetDiana())
    }
    else if(gameMode == "track"){
        console.log("GAME-MODE: TRACK")
        targetDiana.classList.add("target-track");
        targetDiana.addEventListener("mousemove",trackTargetDiana)
        trackMovementY()
        trackMovementX()
    }
    else if(gameMode == "maze"){
        console.log("GAME-MODE: MAZE")
        targetDiana.classList.add("target-maze");
        targetDiana.addEventListener("mousemove",mazeTargetDiana)
        changeSize()
        trackMovementY()
        trackMovementX()
    }
}

//GAME MODES
//TAP
let scoreNum = 0;
export const tapTargetDiana = ()=>{
    if(scoreNum !== 0) tapSound.play();

    let randomY = Math.floor(Math.random() * (window.innerHeight - getPixels()));
    let randomX = Math.floor(Math.random() * (window.innerWidth - getPixels()));

    targetDiana.style.top = `${randomY}px`;
    targetDiana.style.left = `${randomX}px`;

    score.textContent = scoreNum;
    scoreNum++
}
//TRACK
let arrayMovementsY = [];
let arrayMovementsX = [];
export const trackTargetDiana = ()=>{
    tapSound.play();

    scoreNum+= 0.1
    score.textContent = Math.floor(scoreNum);
}
export const trackMovementY = ()=>{
    let randomY = Math.floor(Math.random() * (window.innerHeight - getPixels()));
    arrayMovementsY.push(randomY);
    let lastMoveY = arrayMovementsY[arrayMovementsY.length - 2];

    let movementY = lastMoveY;

    if(lastMoveY === undefined){
        targetDiana.style.top = `${randomY}px`;
        trackMovementY()
    }

    let movementInterval = setInterval(()=>{

        if(randomY > lastMoveY) movementY++
        if(randomY < lastMoveY) movementY--

        targetDiana.style.top = `${movementY}px`;

        if(randomY == movementY){
            clearInterval(movementInterval)
            if(gameState) trackMovementY();
        }

    }, 1)
}
export const trackMovementX = ()=>{
    let randomX = Math.floor(Math.random() * (window.innerWidth - getPixels()));
    arrayMovementsX.push(randomX);
    let lastMoveX = arrayMovementsX[arrayMovementsX.length - 2];

    let movementX = lastMoveX;

    if(lastMoveX === undefined){
        targetDiana.style.left = `${randomX}px`;
        trackMovementX()
    }

    let movementInterval = setInterval(()=>{

        if(randomX > lastMoveX) movementX++
        if(randomX < lastMoveX) movementX--

        targetDiana.style.left = `${movementX}px`;

        if(randomX == movementX){
            clearInterval(movementInterval)
            if(gameState) trackMovementX();
        }

    }, 1)
}
//MAZE
export const mazeTargetDiana = ()=>{
    tapSound.play();

    scoreNum+= 0.1
    score.textContent = Math.floor(scoreNum);
}
let arraySizes = [];
export const changeSize = ()=>{
    let randomSize = getPixels() - Math.floor(Math.random() * getPixels() * 0.75)
    arraySizes.push(randomSize);
    let lastSize = arraySizes[arraySizes.length - 2];

    let actualSize = lastSize;

    if(lastSize == undefined){
        targetDiana.style.width = `${randomSize}px`;
        targetDiana.style.height = `${randomSize}px`;
        changeSize();
    }

    let movementInterval = setInterval(()=>{

        if(randomSize > lastSize) actualSize++
        if(randomSize < lastSize) actualSize--

        targetDiana.style.width = `${actualSize}px`;
        targetDiana.style.height = `${actualSize}px`;

        if(randomSize == actualSize){
            clearInterval(movementInterval)
            if(gameState) changeSize();
        }

    }, 10)
}


export const endGame = ()=>{
    gameState = false;
    let scoreInt = parseInt(score.textContent);
    animation(targetDiana,"disappear","0s");
    animation(gameContainer,"disappear","2s");
    animation(mainContainer,"appear","2s");

    console.log(`SCORE: ${scoreInt}`)
    console.log("END GAME")

    if(scoreInt > topScoresObject[selectGameMode.value][selectDifficulty.value]){
        topScoresObject[selectGameMode.value][selectDifficulty.value] = scoreInt;
        score.style.color = "#0f0";
    }
    else if(scoreInt == topScoresObject[selectGameMode.value][selectDifficulty.value]){
        score.style.color = "#ff0";
    }
    else{score.style.color = "#f00";}

    updateGameModeTopScore()
}
export const restartEveryThing = ()=>{
    scoreNum = 0;
    score.textContent = 0;
    score.style.color = "#fff";

    arrayMovementsY = [];
    arrayMovementsX = [];
    arraySizes = []

    counterSeconds.textContent = "59";
    counterMillieconds.textContent = "99";

    clickMeToStart.disabled = false;
    clickMeToStart.textContent = "CLICK ME TO START";

    targetDiana.classList.remove("target-tap","target-track","target-maze");
}


export const animation = (element,animationName,time)=>{
    element.style.animationName = animationName;
    element.style.animationDuration = time;
    element.style.animationIterationCount = "1";
    element.style.animationFillMode = "forwards";

    if(animationName == "appear") element.style.display = "flex"
   
}
export const getPixels = ()=>{
    if(selectDifficulty.value == "easy") return 150;
    else if(selectDifficulty.value == "medium") return 120;
    else if(selectDifficulty.value == "hard") return 60;
    else if(selectDifficulty.value == "impossible") return 30;
}

//COOKIES
export const updateCookie = ()=>{
    for(let key in topScoresObject){
        for(let key2 in topScoresObject[key]){

            let valorObjeto = topScoresObject[key][key2];
            let valorCookie = JSON.parse(document.cookie)[key][key2];

            if(valorObjeto > valorCookie){
                let newCookie = JSON.parse(document.cookie);
                newCookie[key][key2] = valorObjeto;
                setCookie(newCookie);
            }

        }   
    }
}
export const setCookie = (cookieValue)=>{
    const cookie = JSON.stringify(cookieValue);
    document.cookie = cookie;
}
export const getCookie = ()=>{
    return document.cookie
}
export const isJSON = ()=>{
    try{JSON.parse(getCookie())}
    catch(err){setCookie(topScoresObject);console.log("ERROR WITH THE COOKIE")}
}
export const resetCookies = ()=>{
    topScoresObject = {
        tap: {easy:0,medium:0,hard:0,impossible:0},
        track: {easy:0,medium:0,hard:0,impossible:0},
        maze: {easy:0,medium:0,hard:0,impossible:0}
    }
    setCookie(topScoresObject)
    updateGameModeTopScore();
}