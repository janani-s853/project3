let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let highestScore = localStorage.getItem("highestScore") || 0; 

window.onload = function() {
    setGame();
    updateHighestScore();
}

function setGame() {
    for (let i = 0; i < 9; i++) { 
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 1000); 
    setInterval(setPlant, 2000); 
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
        currMoleTile.classList.remove("monty-mole");
    }
    let mole = document.createElement("img");
    mole.src = "assets/monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return; 
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole); 
    currMoleTile.classList.add("monty-mole"); 
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
        currPlantTile.classList.remove("piranha-plant");
    }
    let plant = document.createElement("img");
    plant.src = "assets/piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return; 
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant); 
    currPlantTile.classList.add("piranha-plant"); 
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        document.getElementById("score").innerText = "Score: " + score; 
    } else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score; 
        gameOver = true;
        updateHighestScore(); 
        showPlayAgainButton();
    }
}

function updateHighestScore() {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore); 
    }
    document.getElementById("highest-score").innerText = "Highest Score: " + highestScore; 
}

function showPlayAgainButton() {
    let button = document.createElement("button");
    button.innerText = "Play Again";
    button.onclick = restartGame; 

    let scoreContainer = document.getElementById("score-container");
    let gameOverText = document.createElement("h2");
    gameOverText.innerText = "GAME OVER: " + score;

    scoreContainer.innerHTML = '';
    scoreContainer.appendChild(gameOverText);
    scoreContainer.appendChild(button);
}

function restartGame() {
    console.log("restartGame called");

    score = 0;
    gameOver = false;
        let scoreContainer = document.getElementById("score-container");
    scoreContainer.innerHTML = '';
    let scoreDisplay = document.createElement("h2");
    scoreDisplay.id = "score";  
    scoreDisplay.innerText = "Score: " + score; 
    scoreContainer.appendChild(scoreDisplay);  

    let board = document.getElementById("board");
    board.innerHTML = ''; 

    setGame(); 
}

