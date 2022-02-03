const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Classe para criar as partes da cobra
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// velocidade da Cobra
let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = []; // const porque nunca vamos alterar a calda da cobra
let tailLenght = 2; // quantidade de caldas iniciais da cobra

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("sounds/gulp.wav");

// game loop
function drawGame() {
    //console.log('Draw Game');
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();    

    checkAppleCollision();
    drawSnake();
    drawApple();

    drawScore();

    setTimeout(drawGame, 1000 / speed);

}

function isGameOver() {
    let gameOver = false;
    
    if (xVelocity === 0 && yVelocity === 0) {
        return false;
    }

    // walls
    if (headX < 0) {
        gameOver = true;
    }
    else if (headX === tileCount) {
        gameOver = true;
    }
    else if (headY < 0) {
        gameOver = true;        
    }
    else if (headY === tileCount) {
        gameOver = true;
    }

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop('0', 'magenta');
        gradient.addColorStop('0.5', 'blue');
        gradient.addColorStop('1.0', 'red');
        // fill with gradient
        ctx.fillStyle = gradient;

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    return gameOver;

}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '10px Verdana';
    ctx.fillText('Score ' + score, canvas.width-50, 10);
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {

    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY)); // colocar uma parte no final da lista da Cabeça da cobra
    while (snakeParts.length > tailLenght) {
        snakeParts.shift(); // remove itens que estejam maior do que o tamanho do Tail Size (calda)
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLenght++;
        score++;
        gulpSound.play();
    }

}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {

    // up
    if (event.key === "ArrowUp") {
        if (yVelocity == 1) // evita que a cobra volte por ela e faz retornar ao inicio da função
            return;
        yVelocity = -1;
        xVelocity = 0;
    }
    // down
    if (event.key === "ArrowDown") {
        if (yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    // left
    if (event.key === "ArrowLeft") {
        if (xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }
    // rigth
    if (event.key === "ArrowRight") {
        if (xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();