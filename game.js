let canvas, ctx;
let bike = { x: 100, y: 300, speed: 3, velocityY: 0, angle: 0 };
let gravity = 0.3;
let keys = {};
let terrain = [];
let terrainWidth = 20;
let maxHeight = 150;
let scrollOffset = 0;
let bikeImg = new Image();
bikeImg.src = "https://upload.wikimedia.org/wikipedia/commons/8/8e/Bicycle_icon.svg"; // Placeholder bike image

// Biome colors
let biomes = [
    { name: "Wales", color: "green" },
    { name: "Utah", color: "brown" },
    { name: "Whistler", color: "darkgreen" }
];
let currentBiome = 0;

function startGame() {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    window.addEventListener("keydown", (e) => keys[e.code] = true);
    window.addEventListener("keyup", (e) => keys[e.code] = false);

    generateTerrain();
    requestAnimationFrame(updateGame);
}

function generateTerrain() {
    let height = canvas.height - 100;
    for (let i = 0; i < canvas.width / terrainWidth + 5; i++) {
        height += Math.random() * 20 - 10; // Small hills
        height = Math.max(canvas.height - maxHeight, Math.min(canvas.height - 50, height)); // Limit terrain height
        terrain.push({ x: i * terrainWidth, y: height });
    }
}

function updateGame() {
    bike.velocityY += gravity;
    bike.y += bike.velocityY;
    bike.x += bike.speed;
    scrollOffset += bike.speed;

    // Terrain collision
    for (let i = 0; i < terrain.length - 1; i++) {
        let t1 = terrain[i], t2 = terrain[i + 1];
        if (bike.x > t1.x && bike.x < t2.x) {
            let groundY = t1.y + (t2.y - t1.y) * ((bike.x - t1.x) / terrainWidth);
            if (bike.y > groundY - 10) {
                bike.y = groundY - 10;
                bike.velocityY = 0;
            }
        }
    }

    // Controls
    if (keys["ArrowLeft"]) bike.angle -= 2;
    if (keys["ArrowRight"]) bike.angle += 2;
    if (keys["Space"]) bike.angle += 5; // Trick spin

    // Change biomes
    if (scrollOffset > 3000) {
        scrollOffset = 0;
        currentBiome = (currentBiome + 1) % biomes.length;
    }

    // Render
    drawGame();
    requestAnimationFrame(updateGame);
}

function drawGame() {
    ctx.fillStyle = biomes[currentBiome].color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw terrain
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    terrain.forEach(point => ctx.lineTo(point.x - scrollOffset, point.y));
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // Draw bike
    ctx.save();
    ctx.translate(bike.x - scrollOffset, bike.y);
    ctx.rotate((bike.angle * Math.PI) / 180);
    ctx.drawImage(bikeImg, -15, -10, 30, 20);
    ctx.restore();
}
