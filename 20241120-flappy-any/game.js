const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let birdWidth = 50;  // 鸟的宽度
let birdHeight = 50; // 鸟的高度
let birdX = 50; // 鸟的起始X位置
let birdY = canvas.height / 2;
let gravity = 0.16;  // 适当的重力值，避免鸟太快掉落
let jump = -4;  // 调整跳跃力度使跳跃更显著
let pipeWidth = 80; // 管道宽度
let pipeGap = 200; // 管道间隙
let pipeSpeed = 1; // 管道移动速度
let isGameRunning = false; // 游戏是否在运行
let pipes = [];  // 管道数组
let bird = { color: '#FFD700', velocity: 0 };  // 鸟的初始速度为0，可通过触摸调整

document.getElementById('birdImageUploader').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        bird.img = new Image();
        bird.img.src = reader.result;
        bird.img.onload = () => {
            bird.color = 'transparent';
            document.getElementById('startButton').disabled = false;
        };
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('startButton').addEventListener('click', function() {
    isGameRunning = true;
    document.getElementById('birdImageUploader').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    pipes = generatePipes();
    animate();
});

function animate() {
    if (!isGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();

    bird.velocity += gravity;
    birdY += bird.velocity;

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);  // 绘制上管道
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));  // 绘制下管道
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - pipeWidth) {
        pipes.push(generatePipe());
    }

    if (birdY > canvas.height - birdHeight || birdY < 0) {
        gameOver();
    }

    pipes.forEach(pipe => {
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY <= pipe.y || birdY + birdHeight >= pipe.y + pipeGap) {
                gameOver();
            }
        }
    });

    requestAnimationFrame(animate);
}

function drawBird() {
    if (bird.img) {
        ctx.drawImage(bird.img, birdX, birdY, birdWidth, birdHeight);
    } else {
        ctx.fillStyle = bird.color;
        ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
    }
}

canvas.addEventListener('touchstart', function (e) {
    bird.velocity = jump;  // 触摸屏幕时使鸟跳跃
    e.preventDefault();
}, {passive: false});

function generatePipes() {
    let newPipes = [];
    let initialX = canvas.width + 200;  // 初始X位置稍远于画布右边缘
    for (let i = 0; i < 3; i++) {
        let pipeY = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
        newPipes.push({
            x: initialX + i * 300,  // 确保每个管道之间有300像素的间隔
            y: pipeY
        });
    }
    return newPipes;
}

function generatePipe() {
    let lastPipeX = pipes.length > 0 ? pipes[pipes.length - 1].x : canvas.width;
    let pipeY = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    return {
        x: lastPipeX + 300,  // 新管道在最后一个管道后300像素
        y: pipeY
    };
}

function gameOver() {
    alert('Game Over!');
    isGameRunning = false;
    location.reload();  // 重新加载页面重启游戏
}

