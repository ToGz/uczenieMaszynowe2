const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
canvas.width = 300;
canvas.height = 600;
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
let score = 0;
let level = 1;
let speed = 500;
let gameOver = false;

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const tetrominoes = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 1], [1, 0, 0]]
];

let currentPiece = getRandomPiece();
let position = { x: 3, y: 0 };

function getRandomPiece() {
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

function rotatePiece() {
    const rotated = currentPiece[0].map((_, index) =>
        currentPiece.map(row => row[index]).reverse()
    );
    if (!collision(rotated)) {
        currentPiece = rotated;
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = "blue";
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawPiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = "red";
                ctx.fillRect((position.x + x) * BLOCK_SIZE, (position.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function mergePiece() {
    if (position.y === 0) {
        gameOver = true;
        alert("Game Over!");
        return;
    }
    currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[position.y + y][position.x + x] = 1;
            }
        });
    });
    clearRows();
    currentPiece = getRandomPiece();
    position = { x: 3, y: 0 };
}

function clearRows() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            levelElement.textContent = `Level: ${level}`;
            
            if (score % 50 === 0) {
                level++;
                speed = Math.max(100, speed - 50);
            }
        }
    }
}

function movePieceDown() {
    position.y++;
    if (collision()) {
        position.y--;
        mergePiece();
    }
}

function collision(newPiece = currentPiece) {
    return newPiece.some((row, y) => 
        row.some((cell, x) => 
            cell && (board[position.y + y]?.[position.x + x] !== 0 || position.y + y >= ROWS)
        )
    );
}

function gameLoop() {
    if (!gameOver) {
        movePieceDown();
        drawBoard();
        drawPiece();
        setTimeout(gameLoop, speed);
    }
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && position.x > 0) position.x--;
    if (event.key === "ArrowRight" && position.x < COLS - currentPiece[0].length) position.x++;
    if (event.key === "ArrowDown") movePieceDown();
    if (event.key === "ArrowUp") rotatePiece();
});

gameLoop();
