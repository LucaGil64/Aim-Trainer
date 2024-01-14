import {selectGameMode, selectCursor, selectTarget, playButton,resetCookiesButton, clickMeToStart, targetDiana} from "./elements.js";

import {updateGameModeTopScore, updateCursor, playButtonActioned, startGame, resetCookies} from "./functions.js";


updateGameModeTopScore();


selectGameMode.addEventListener("change",updateGameModeTopScore);
selectCursor.addEventListener("change",updateCursor);
selectTarget.addEventListener("change",()=>{
    targetDiana.classList.remove("circle","square","triangle")
    targetDiana.classList.add(selectTarget.value)
})

playButton.addEventListener("click",playButtonActioned);
clickMeToStart.addEventListener("click",startGame);

resetCookiesButton.addEventListener("click",resetCookies)