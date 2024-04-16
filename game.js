const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    speed: 10,
    bullets: [],
    score: 0  // 점수 추적을 위한 속성
};

let enemies = [];

function createEnemy() {
    const x = Math.random() * (canvas.width - 30);
    const y = -30;
    enemies.push({ x, y, width: 30, height: 30, speed: 2 });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
    });
    enemies = enemies.filter(enemy => enemy.y <= canvas.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function moveBullets() {
    player.bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });
    player.bullets = player.bullets.filter(bullet => bullet.y > 0);
}

function drawBullets() {
    player.bullets.forEach(bullet => {
        ctx.fillStyle = 'white';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function shoot() {
    player.bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 10,
        speed: 10
    });
}

function detectCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                player.score += 1;
            }
        });
    });
}

document.addEventListener('keydown', function(event) {
    console.log(event.key); // 키 입력 확인
    if (event.key === "ArrowLeft") {
        if (player.x > 0) {
            player.x -= player.speed;
        }
    } else if (event.key === "ArrowRight") {
        if (player.x + player.width < canvas.width) {
            player.x += player.speed;
        }
    } else if (event.key === " ") {
        shoot();
        console.log('Shot fired!'); // 총알 발사 확인
        event.preventDefault();  // 스페이스바 누름으로 인한 스크롤 방지
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEnemies();
    moveEnemies();

    drawBullets();
    moveBullets();

    detectCollisions();

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 점수를 화면 오른쪽 상단에 표시
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${player.score}`, canvas.width - 100, 20);

    requestAnimationFrame(gameLoop);
}

setInterval(createEnemy, 2000);
requestAnimationFrame(gameLoop);
