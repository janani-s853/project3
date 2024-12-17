var board;
var playerO = "O";
var playerX = "X";
var currPlayer = playerX;
var gameOver = false;
var turnDisplay = document.getElementById("turn-display");

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            if (r == 0 || r == 1) tile.classList.add("horizontal-line");
            if (c == 0 || c == 1) tile.classList.add("vertical-line");
            tile.innerText = "";
            tile.addEventListener("click", setTile);
            boardElement.appendChild(tile);
        }
    }

    displayTurn("Your Turn (X)");
}

function displayTurn(message) {
    turnDisplay.innerText = message;
    turnDisplay.classList.remove("hide");
    turnDisplay.classList.add("show");

    if (message === "Your Turn (X)") {
        setTimeout(() => {
            turnDisplay.classList.remove("show");
        }, 2000);
    }
}

function setTile() {
    if (gameOver || currPlayer !== playerX) return;

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (board[r][c] !== ' ') return;

    board[r][c] = currPlayer;
    this.innerText = currPlayer;

    if (currPlayer === playerX) this.classList.add("x");
    else this.classList.add("o");

    checkWinner();

    if (!gameOver) {
        currPlayer = playerO;
        displayTurn("Bot's Turn (O)");
        setTimeout(botPlay, 300);
    }
}

function checkWinner() {
    let winner = checkWin(playerX);
    if (winner) {
        blinkTiles(winner);
        setTimeout(() => showGameOver("🎊YOU WON!🎊"), 1500);
        gameOver = true;
    } else {
        winner = checkWin(playerO);
        if (winner) {
            blinkTiles(winner);
            setTimeout(() => showGameOver("SORRY, YOU LOSE!😞"), 1500);
            gameOver = true;
        } else if (isDraw()) {
            showGameOver("OOPS, IT'S A Draw!🫨");
            gameOver = true;
        }
    }
}

function blinkTiles(winner) {
    let [r1, c1, r2, c2, r3, c3] = winner;
    document.getElementById(`${r1}-${c1}`).classList.add("blink");
    document.getElementById(`${r2}-${c2}`).classList.add("blink");
    document.getElementById(`${r3}-${c3}`).classList.add("blink");

    setTimeout(() => {
        document.getElementById(`${r1}-${c1}`).classList.remove("blink");
        document.getElementById(`${r2}-${c2}`).classList.remove("blink");
        document.getElementById(`${r3}-${c3}`).classList.remove("blink");
    }, 1500);
}

function checkWin(player) {
    for (let r = 0; r < 3; r++) {
        if (board[r][0] === player && board[r][1] === player && board[r][2] === player) return [r, 0, r, 1, r, 2];
    }
    for (let c = 0; c < 3; c++) {
        if (board[0][c] === player && board[1][c] === player && board[2][c] === player) return [0, c, 1, c, 2, c];
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return [0, 0, 1, 1, 2, 2];
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return [0, 2, 1, 1, 2, 0];

    return null;
}

function showGameOver(message) {
    gameOver = true;
    let overlay = document.getElementById("game-over-overlay");
    let messageElement = document.getElementById("game-over-message");
    messageElement.innerText = message;
    overlay.classList.add("show");

    let playAgainButton = document.getElementById("play-again-button");
    playAgainButton.style.display = 'block';
    document.getElementById("home-icon").addEventListener("click", goHome);
    playAgainButton.addEventListener("click", restartGame);
}

function isDraw() {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === ' ') return false;
        }
    }
    return true;
}

function goHome() {
    location.reload();
}

function restartGame() {
    gameOver = false;
    currPlayer = playerX;
    setGame();

    let overlay = document.getElementById("game-over-overlay");
    let playAgainButton = document.getElementById("play-again-button");
    playAgainButton.style.display = 'none';
    overlay.classList.remove("show");
}

function botPlay() {
    if (gameOver || currPlayer !== playerO) return;

    let bestMove = getBestMove();
    let r = bestMove[0];
    let c = bestMove[1];

    setTimeout(() => {
        board[r][c] = playerO;
        document.getElementById(r.toString() + "-" + c.toString()).innerText = playerO;

        checkWinner();

        if (!gameOver) {
            currPlayer = playerX;
            displayTurn("Your Turn (X)");
        }
    }, 500);
}

function getBestMove() {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === ' ') {
                board[r][c] = playerO;
                if (checkWin(playerO)) {
                    board[r][c] = ' ';
                    return [r, c];
                }
                board[r][c] = ' ';
            }
        }
    }

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === ' ') {
                board[r][c] = playerX;
                if (checkWin(playerX)) {
                    board[r][c] = ' ';
                    return [r, c];
                }
                board[r][c] = ' ';
            }
        }
    }

    let corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
    for (let corner of corners) {
        let [r, c] = corner;
        if (board[r][c] === ' ') return [r, c];
    }

    if (board[1][1] === ' ') return [1, 1];

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === ' ') return [r, c];
        }
    }

    return null;
}
