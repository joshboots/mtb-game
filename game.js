let canvas, ctx;
let bike = { x: 100, y: 300, speed: 2, velocityY: 0, angle: 0 };
let gravity = 0.2;
let keys = {};

function startGame() {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    window.addEventListener("keydown", (e) => keys[e.code] = true);
    window.addEventListener("keyup", (e) => keys[e.code] = false);

    requestAnimationFrame(updateGame);
}

function updateGame() {
    // Physics
    bike.velocityY += gravity;
    bike.y += bike.velocityY;
    bike.x += bike.speed;

    // Controls
    if (keys["ArrowLeft"]) bike.angle -= 2;
    if (keys["ArrowRight"]) bike.angle += 2;
    if (keys["Space"]) bike.angle += 5; // Trick spin

    // Ground collision (basic)
    if (bike.y > canvas.height - 50) {
        bike.y = canvas.height - 50;
        bike.velocityY = 0;
    }

    // Rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(bike.x, bike.y, 30, 10);

    requestAnimationFrame(updateGame);
}