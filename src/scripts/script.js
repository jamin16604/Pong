
const canvas = document.getElementById("canvas",);
const ctx = canvas.getContext("2d");
const keysPressed = [];
const KEY_UP_L = "w";
const KEY_DOWN_L = "s";
const KEY_UP_R = "ArrowUp";
const KEY_DOWN_R = "ArrowDown";
window.addEventListener('keydown', function (e) {
    keysPressed[e.key] = true;
});
window.addEventListener('keyup', function (e) {
    keysPressed[e.key] = false;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**
 * Create a 2D vector with the given x and y coordinates.
 *
 * @param {type} x - the x coordinate
 * @param {type} y - the y coordinate
 * @return {Object} a 2D vector object with x and y properties
 */
function vec2(x, y) {
    return {
        x: x,
        y: y,
    };
}
/**
 * Constructor for creating a Ball object.
 *
 * @param {Object} pos - position of the ball
 * @param {Object} velocity - velocity of the ball
 * @param {number} radius - radius of the ball
 */
function Ball(pos, velocity, radius) {
    this.pos = pos;
    this.velocity = velocity;
    this.radius = radius;

    this.update = function () {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    };

    this.draw = function () {
        ctx.fillStyle = "#44D62C";
        ctx.strokeStyle = "#44D62C";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };


}
/**
 * Constructor function for creating a Paddle object.
 *
 * @param {Object} pos - position of the paddle
 * @param {Object} velocity - velocity of the paddle
 * @param {number} width - width of the paddle
 * @param {number} height - height of the paddle
 */
function Paddle(pos, velocity, width, height) {
    this.pos = pos;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.score = 0;

    this.update = function () {
        if (keysPressed[KEY_UP_L] || keysPressed[KEY_UP_R]) {
            this.pos.y -= this.velocity.y;
        }
        if (keysPressed[KEY_DOWN_L] || keysPressed[KEY_DOWN_R]) {
            this.pos.y += this.velocity.y;
        }
    };

    this.draw = function () {
        ctx.fillStyle = "#44D62C";
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    this.getHalfWidth = function () { return this.width / 2; }
    this.getHalfHeight = function () { return this.height / 2; }
    this.getCentre = function () {
        return vec2(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight());
    }
}

/**
 * Check for collision of the ball with the edges of the canvas and update the ball's velocity accordingly.
 *
 * @param {Object} ball - the ball object with position and radius properties
 */
function ballCollisionWithEdges(ball) {
    if (ball.pos.y + ball.radius >= canvas.height || ball.pos.y - ball.radius <= 0) {
        ball.velocity.y *= -1;
    }
}

/**
 * Increase the score of the paddles based on the position of the ball.
 *
 * @param {object} ball - the ball object
 * @param {object} paddleL - the left paddle object
 * @param {object} paddleR - the right paddle object
 */
function increaseScore(ball, paddleL, paddleR) {
    if (ball.pos.x <= -ball.radius) {
        paddleR.score += 1;
        document.getElementById("P2Score").innerHTML = paddleR.score;
        resetBall(ball);
    }
    if (ball.pos.x >= canvas.width + ball.radius) {
        ball.velocity.x *= -1;
        paddleL.score += 1;
        document.getElementById("P1Score").innerHTML = paddleL.score;
        resetBall(ball);
    }
}

/**
 * Resets the position and velocity of the ball based on its current velocity.
 *
 * @param {object} ball - the ball object to be reset
 */
function resetBall(ball) {
    if (ball.velocity.x > 0) {
        ball.pos.x = canvas.width - 150;
    }
    if (ball.velocity.x < 0) {
        ball.pos.x = 150;
    }
    ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
    ball.velocity.x *= -1;
    ball.velocity.y *= -1;
}

/**
 * Check and handle collisions of the paddle with the edges of the canvas.
 *
 * @param {object} paddle - The paddle object to check for collisions.
 */
function paddleCollisionWithEdges(paddle) {
    if (paddle.pos.y + paddle.height >= canvas.height) {
        paddle.pos.y = canvas.height - paddle.height;
    }
    if (paddle.pos.y <= 0) {
        paddle.pos.y = 0;
    }
}

/**
 * Detects and handles collision between the ball and the paddle.
 *
 * @param {object} ball - the ball object
 * @param {object} paddle - the paddle object
 */
function paddleBallCollision(ball, paddle) {
    let dx = Math.abs(ball.pos.x - paddle.getCentre().x);
    let dy = Math.abs(ball.pos.y - paddle.getCentre().y);
    if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (ball.radius + paddle.getHalfHeight())) {
        ball.velocity.x *= -1;
    }
}

function player2CPU(ball, paddle) {
    if (ball.velocity <= 0) {
        return;
    }
    if (ball.pos.y > paddle.pos.y) {
        paddle.pos.y += paddle.velocity.y;
        if (paddle.pos.y + paddle.height >= canvas.height) {
            paddle.pos.y = canvas.height - paddle.height;
        }
    }
    if (ball.pos.y < paddle.pos.y) {
        paddle.pos.y -= paddle.velocity.y;
        if (paddle.pos.y <= 0) {
            paddle.pos.y = 0;
        }
    }
}

/**
 * Draws the background for the game using the canvas context.
 *
 */
function drawGameBackground() {
    ctx.strokeStyle = "#44D62C";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();
}

/**
 * Updates the game state by updating the ball and paddles, checking for collisions,
 * and increasing the score.
 */
function gameUpdate() {
    ball.update();
    paddleLeft.update();
    ballCollisionWithEdges(ball);
    paddleCollisionWithEdges(paddleLeft);
    paddleCollisionWithEdges(paddleRight);
    paddleBallCollision(ball, paddleLeft);
   player2CPU(ball, paddleRight);
    paddleBallCollision(ball, paddleRight);
    increaseScore(ball, paddleLeft, paddleRight);
}
/**
 * Draws the game background, ball, and left and right paddles.
 *
 */
function gameDraw() {
    drawGameBackground();
    ball.draw();
    paddleLeft.draw();
    paddleRight.draw();
}
/**
 * This function represents the game loop that continuously updates and draws the game state.
 *
 */
function gameLoop() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(gameLoop);

    gameUpdate();
    gameDraw();
}
const ball = new Ball(vec2(200, 200), vec2(10, 10), 20);
const paddleLeft = new Paddle(vec2(0, 50), vec2(10, 10), 20, 160);
const paddleRight = new Paddle(vec2(canvas.width - 20, 30), vec2(10, 10), 20, 160);

gameLoop();