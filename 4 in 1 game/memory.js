const cardarr = [
    { name: 'koala', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/3069/3069172.png);"></div>' },
    { name: 'panda', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2371/2371611.png);"></div>' },
    { name: 'jellyfish', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2977/2977327.png);"></div>' },
    { name: 'chick', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2632/2632839.png);"></div>' },
    { name: 'bee', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/809/809052.png);"></div>' },
    { name: 'frog', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/1864/1864472.png);"></div>' },
    { name: 'elephant', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/3069/3069224.png);"></div>' },
    { name: 'penguin', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/826/826912.png);"></div>' },
    { name: 'koala', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/3069/3069172.png);"></div>' },
    { name: 'panda', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2371/2371611.png);"></div>' },
    { name: 'jellyfish', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2977/2977327.png);"></div>' },
    { name: 'chick', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/2632/2632839.png);"></div>' },
    { name: 'bee', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/809/809052.png);"></div>' },
    { name: 'frog', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/1864/1864472.png);"></div>' },
    { name: 'elephant', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/3069/3069224.png);"></div>' },
    { name: 'penguin', icon: '<div style="background-image: url(https://cdn-icons-png.flaticon.com/512/826/826912.png);"></div>' }
];

let flippedcards = [];
let matchedCount = 0;
let timeLeft = 60;
let timer;
let gameOver = false;
let gameStarted = false;
let canFlip = true;

shufflecards();
displaycards();

document.querySelectorAll('#gameb div').forEach(card => {
    card.classList.remove('activecard');
});

document.getElementById('startButton').addEventListener('click', function() {
    if (!gameStarted) {
        startGame();
    }
});

document.getElementById('play-again-button').addEventListener('click', function() {
    resetGame();
});

function startGame() {
    gameStarted = true;
    matchedCount = 0;
    timeLeft = 60;
    flippedcards = [];
    canFlip = true;
    gameOver = false;

    shufflecards();
    resetCards();
    displaycards();

    document.querySelectorAll('#gameb div').forEach(card => {
        card.classList.add('activecard');
    });

    startTimer();
    document.getElementById('startButton').style.display = 'none';
}

function shufflecards() {
    for (let i = cardarr.length - 1; i >= 0; i--) {
        let randindex = Math.floor(Math.random() * (i + 1));
        [cardarr[i], cardarr[randindex]] = [cardarr[randindex], cardarr[i]];
    }
}

function displaycards() {
    const gameb = document.getElementById('gameb');
    gameb.innerHTML = '';
    cardarr.forEach((curr, index) => {
        const card = document.createElement('div');
        card.setAttribute('id', index);
        card.classList.add('cardback');
        gameb.append(card);
        card.addEventListener('click', flipcard);
    });
}

function flipcard() {
    if (gameStarted && flippedcards.length < 2 && !this.classList.contains('flipped') && !gameOver && this.classList.contains('activecard')) {
        let cardid = this.getAttribute('id');
        flippedcards.push(this);
        this.classList.remove('cardback');
        this.classList.add('flipped');
        this.innerHTML = cardarr[cardid].icon;

        if (flippedcards.length === 2) {
            canFlip = false;
            checkmatch();
        }
    }
}

function checkmatch() {
    if (flippedcards.length === 2) {
        const card1 = flippedcards[0];
        const card2 = flippedcards[1];
        const card1Id = card1.getAttribute('id');
        const card2Id = card2.getAttribute('id');

        if (cardarr[card1Id].name === cardarr[card2Id].name) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.style.backgroundColor = '#ffffff';
                card1.style.border = 'none';
                card1.innerHTML = "";
                card1.classList.remove('activecard');
                card1.style.pointerEvents = 'none';

                card2.style.backgroundColor = '#ffffff';
                card2.style.border = 'none';
                card2.innerHTML = "";
                card2.classList.remove('activecard');
                card2.style.pointerEvents = 'none';

                matchedCount++;

                if (matchedCount === cardarr.length / 2) {
                    clearInterval(timer);
                    showOverlay('🎊YOU WON!🎊');
                }

                flippedcards = [];
                canFlip = true;
            }, 600);
        } else {
            setTimeout(function() {
                card1.classList.add('cardback');
                card2.classList.add('cardback');
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = "";
                card2.innerHTML = "";
                flippedcards = [];
                canFlip = true;
            }, 800);
        }
    }
}

function resetCards() {
    document.querySelectorAll('.cardback').forEach(card => {
        if (!card.classList.contains('matched')) {
            card.classList.remove('activecard');
            card.classList.remove('flipped');
            card.innerHTML = '';
        }
    });
}

function resetGame() {
    matchedCount = 0;
    timeLeft = 60;
    flippedcards = [];
    canFlip = true;
    gameStarted = false;
    gameOver = false;

    clearInterval(timer);
    shufflecards();
    resetCards();
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('play-again-button').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('timer').textContent = '1:00';
    displaycards();
    document.querySelectorAll('#gameb div').forEach(card => {
        card.classList.remove('activecard');
        card.classList.remove('flipped');
        card.innerHTML = '';
    });
}

function showOverlay(message) {
    const overlay = document.getElementById('overlay');
    const playAgainButton = document.getElementById('play-again-button');
    document.getElementById('game-over-message').textContent = message;
    overlay.classList.add('show');
    playAgainButton.style.display = 'block';
}

function startTimer() {
    timer = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').textContent = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showOverlay('TIME\'S UP, YOU LOSE!');
        }
    }, 1000);
}
