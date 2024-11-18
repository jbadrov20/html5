// Inicijalizacija Canvas-a i konteksta
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Veličina Canvas-a
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 10;

// Konstantne vrijednosti igre
const PADDLE_WIDTH = 150;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 7;
const BRICK_WIDTH = canvas.width / BRICK_COLS - 10;
const BRICK_HEIGHT = 30;
const BRICK_PADDING = 10;

let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 3; // Horizontalno kretanje
let ballDY = -3; // Vertikalno kretanje
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

// Stvaranje cigli
const bricks = [];
for (let r = 0; r < BRICK_ROWS; r++) {
    bricks[r] = [];
    for (let c = 0; c < BRICK_COLS; c++) {
        bricks[r][c] = { x: 0, y: 0, visible: true };
    }
}

// Detekcija kolizije
function detectCollision() {
    bricks.forEach(row => {
        row.forEach(brick => {
            if (brick.visible) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + BRICK_WIDTH &&
                    ballY > brick.y &&
                    ballY < brick.y + BRICK_HEIGHT
                ) {
                    ballDY = -ballDY;
                    brick.visible = false;
                    score++;
                }
            }
        });
    });

    // Kolizija s rubovima
    if (ballX + ballDX < BALL_RADIUS || ballX + ballDX > canvas.width - BALL_RADIUS) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < BALL_RADIUS) {
        ballDY = -ballDY;
    }
}

// Renderiranje cigli
function drawBricks() {
    bricks.forEach((row, r) => {
        row.forEach((brick, c) => {
            if (brick.visible) {
                brick.x = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING;
                brick.y = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING;

                // Apply shadow properties
                ctx.shadowColor = "rgba(0, 0, 0, 0.5";
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;                

                // Crtanje cigle
                ctx.fillStyle = "orange";
                ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);

                ctx.shadowColor = "transparent";      // Reset sjene za ostale objekte
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
            }
        });
    });
}

// Renderiranje palice
function drawPaddle() {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = "red"; // Boja palice
    ctx.fillRect(paddleX, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.shadowColor = "transparent"; // Reset sjene za ostale objekte
    ctx.strokeStyle = "black"; // Obrub palice
    ctx.lineWidth = 2;
    ctx.strokeRect(paddleX, canvas.height - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Renderiranje loptice
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// Prikaz rezultata
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 300, 30);
}

// Ažuriranje pozicija
function update() {
    ballX += ballDX;
    ballY += ballDY;

    // Kolizija s palicom
    if (
        ballX > paddleX &&
        ballX < paddleX + PADDLE_WIDTH &&
        ballY + BALL_RADIUS > canvas.height - PADDLE_HEIGHT - 10
    ) {
        ballDY = -ballDY;
    }

    // Igra završava ako loptica padne ispod
    if (ballY + BALL_RADIUS > canvas.height) {
        if (score > highScore) {
            localStorage.setItem("highScore", score);
        }
        alert("GAME OVER");
        document.location.reload();
    }

    const allBricksCleared = bricks.every(row =>
        row.every(brick => !brick.visible)
    );

    // Provjera da li su sve cigle uništene
    if (allBricksCleared) {
        if (score > highScore) {
            localStorage.setItem("highScore", score);
        }
        alert("CONGRATULATIONS! YOU WIN!");
        document.location.reload();
    }

    detectCollision();
}

// Funkcija za renderiranje igre
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
}

// Funkcija petlje
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Upravljanje palicom
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= 30;
    } else if (e.key === "ArrowRight" && paddleX < canvas.width - PADDLE_WIDTH) {
        paddleX += 30;
    }
});

// Pokretanje igre
gameLoop();