var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; 

var firstTurn = true; 

window.onload = function () {
    setGame();
};

function setGame() {
    clearStrikes();
    resetGameVariables(); 

    document.getElementById("turn-indicator").innerText = "Your Turn";
    document.getElementById("turn-indicator").className = "red-turn"; 
    document.body.style.backgroundColor = "coral";  

    let boardContainer = document.getElementById("board");
    boardContainer.innerHTML = ""; 

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardContainer.append(tile);
        }
        board.push(row);
    }

    let overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
    overlay.style.display = "none";
    gameOver = false;

    document.body.style.backgroundColor = "coral";
}

function resetGameVariables() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    firstTurn = true;
    currPlayer = playerRed;
    gameOver = false;
}

function clearStrikes() {
    let strikes = document.querySelectorAll('.strike');
    strikes.forEach(strike => strike.remove());
}

function setPiece() {
    if (gameOver || currPlayer != playerRed) return;

    let coords = this.id.split("-");
    let c = parseInt(coords[1]);

    let r = currColumns[c];
    if (r < 0) return;

    board[r][c] = playerRed;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.classList.add("red-piece");

    currPlayer = playerYellow;
    if (firstTurn) {
        updateTurnIndicator("Bot Thinking", "blue-turn", false);
        firstTurn = false;
    } else {
        updateTurnIndicator("Bot Thinking", "blue-turn", true);
    }
    r -= 1;
    currColumns[c] = r;

    checkWinner();

    if (!gameOver) {
        setTimeout(botPlay, 1500);
    }
}

function botPlay() {
    if (gameOver || currPlayer != playerYellow) return;

    let botMove = getBotMove();
    let r = currColumns[botMove];
    if (r < 0) return;

    board[r][botMove] = playerYellow;
    let tile = document.getElementById(r.toString() + "-" + botMove.toString());
    tile.classList.add("yellow-piece");

    currPlayer = playerRed;
    updateTurnIndicator("Your Turn", "red-turn", true);

    r -= 1;
    currColumns[botMove] = r;

    checkWinner();
}

function getBotMove() {
    for (let c = 0; c < columns; c++) {
        let r = currColumns[c];
        if (r < 0) continue;
        board[r][c] = playerYellow;
        if (checkImmediateWin(playerYellow)) {
            board[r][c] = " ";
            return c;
        }
        board[r][c] = " ";
    }

    for (let c = 0; c < columns; c++) {
        let r = currColumns[c];
        if (r < 0) continue;
        board[r][c] = playerRed;
        if (checkImmediateWin(playerRed)) {
            board[r][c] = " ";
            return c;
        }
        board[r][c] = " ";
    }

    if (currColumns[3] >= 0) return 3;

    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) return c;
    }
}

function checkImmediateWin(player) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (checkLine(r, c, 0, 1, player) || 
                checkLine(r, c, 1, 0, player) || 
                checkLine(r, c, 1, 1, player) || 
                checkLine(r, c, 1, -1, player)) { 
                return true;
            }
        }
    }
    return false;
}

function checkLine(r, c, dr, dc, player) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        let nr = r + i * dr;
        let nc = c + i * dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < columns && board[nr][nc] == player) {
            count++;
        } else {
            break;
        }
    }
    return count === 4;
}

function checkWinner() {
    if (checkImmediateWin(playerRed)) {
        highlightWinningLine(playerRed);
        setWinner("🎊YOU WON!🎊");
    } else if (checkImmediateWin(playerYellow)) {
        highlightWinningLine(playerYellow);
        setWinner("SORRY, YOU LOSE!😞");
    } else if (currColumns.every(col => col < 0)) {
        setWinner("OOPS, IT'S A Draw!🫨");
    }
}

function highlightWinningLine(player) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (checkLine(r, c, 0, 1, player)) {
                applyBlinkEffect(r, c, 0, 1);
            } else if (checkLine(r, c, 1, 0, player)) {
                applyBlinkEffect(r, c, 1, 0);
            } else if (checkLine(r, c, 1, 1, player)) {
                applyBlinkEffect(r, c, 1, 1);
            } else if (checkLine(r, c, 1, -1, player)) {
                applyBlinkEffect(r, c, 1, -1);
            }
        }
    }
}

function applyBlinkEffect(r, c, dr, dc) {
    let count = 0;
    let tilesToBlink = [];
    for (let i = 0; i < 4; i++) {
        let nr = r + i * dr;
        let nc = c + i * dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < columns && board[nr][nc] == playerRed || board[nr][nc] == playerYellow) {
            tilesToBlink.push(document.getElementById(nr + "-" + nc));
        } else {
            break;
        }
    }

    tilesToBlink.forEach(tile => tile.classList.add("blinking"));
}

function setWinner(resultText) {
    let overlay = document.getElementById("overlay");
    overlay.innerHTML = ` 
        <div id="game-result">${resultText}</div>
        <button id="play-again" onclick="setGame()">Play Again</button>
    `;
    overlay.style.display = "flex";
    overlay.style.zIndex = "10";

    gameOver = true;
}

function updateTurnIndicator(text, className, applyTransition) {
    let indicator = document.getElementById("turn-indicator");

    if (applyTransition) {
        indicator.style.transition = "opacity 1s ease-in-out";
        indicator.style.opacity = 0;
        setTimeout(() => {
            indicator.innerText = text;
            indicator.className = className;
            indicator.style.opacity = 1;
        }, 1000);
    } else {
        indicator.innerText = text;
        indicator.className = className;
    }

    if (className === "red-turn") {
        document.body.style.backgroundColor = "coral";
    } else if (className === "blue-turn") {
        document.body.style.backgroundColor = "rgb(4, 145, 193)";
    }
}
