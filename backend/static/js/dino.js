class DinoGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = 600;
    this.canvas.height = 200;
    this.themeColors = {};
    this.gameRunning = false;
    this.animationFrameId = null;
    this.highscore = parseInt(localStorage.getItem("helixDinoHighscore") || "0", 10);
    this.score = 0;
    this.frameCount = 0;
    this.gameSpeed = 5;
    this.obstacleTimer = 100;
    this.obstacles = [];
    this.clouds = [];
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundLoop = this.gameLoop.bind(this);
    this.scoreDisplay = null;
    this.highScoreDisplay = null;
  }

  updateThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    this.themeColors.text = styles.getPropertyValue("--text-primary").trim() || "#cccccc";
    this.themeColors.border = styles.getPropertyValue("--border-strong").trim() || "#3c3c3c";
    this.themeColors.obstacle = styles.getPropertyValue("--obstacle-color").trim() || "#f14c4c";
  }

  init() {
    this.groundHeight = 20;
    this.player = {
      x: 50,
      y: this.canvas.height - this.groundHeight,
      width: 40,
      height: 40,
      duckingHeight: 20,
      dy: 0,
      gravity: 0.8,
      jumpPower: -15,
      isJumping: false,
      onGround: true,
      isDucking: false,
    };
    this.obstacles = [];
    this.score = 0;
    this.gameSpeed = 5;
    this.frameCount = 0;
    this.obstacleTimer = 100;

    if (this.clouds.length === 0) {
      for (let i = 0; i < 5; i++) {
        this.clouds.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * (this.canvas.height / 2),
          size: Math.random() * 20 + 10,
        });
      }
    }
    this.scoreDisplay = document.getElementById("dino-score");
    this.highScoreDisplay = document.getElementById("dino-highscore");
    this.updateScoreDisplay();
    this.drawInitialState();
  }

  start() {
    this.init();
    this.gameRunning = false;
    window.addEventListener("keydown", this.boundKeyDown);
    window.addEventListener("keyup", this.boundKeyUp);
    this.bindCanvasClick();
  }

  stop() {
    this.gameRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("keydown", this.boundKeyDown);
    window.removeEventListener("keyup", this.boundKeyUp);
  }

  bindCanvasClick() {
    this.canvas.addEventListener("click", () => {
      if (!this.gameRunning) this.startGameLogic();
    });
  }

  startGameLogic() {
    if (this.gameRunning) return;
    this.init();
    this.gameRunning = true;
    const startMsg = this.canvas.parentElement?.querySelector(".start-message");
    if (startMsg) startMsg.classList.add("hidden");
    const gameOverMsg = this.canvas.parentElement?.querySelector(".gameover-message");
    if (gameOverMsg) gameOverMsg.classList.add("hidden");
    this.gameLoop();
  }

  endGame() {
    this.gameRunning = false;
    const finalScore = Math.floor(this.score / 10);
    if (finalScore > this.highscore) {
      this.highscore = finalScore;
      localStorage.setItem("helixDinoHighscore", this.highscore);
    }
    this.updateScoreDisplay();
    const gameOverMsg = this.canvas.parentElement?.querySelector(".gameover-message");
    if (gameOverMsg) gameOverMsg.classList.remove("hidden");
    const startMsg = this.canvas.parentElement?.querySelector(".start-message");
    if (startMsg) startMsg.classList.remove("hidden");
  }

  handleKeyDown(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (this.gameRunning) {
        if (this.player.onGround && !this.player.isDucking) {
          this.player.isJumping = true;
          this.player.onGround = false;
          this.player.dy = this.player.jumpPower;
        }
      } else {
        this.startGameLogic();
      }
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      if (this.gameRunning && this.player.onGround) this.player.isDucking = true;
    }
  }

  handleKeyUp(e) {
    if (e.code === "ArrowDown") this.player.isDucking = false;
  }

  gameLoop() {
    if (!this.gameRunning) return;
    this.updateThemeColors();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateClouds();
    this.updatePlayer();
    this.updateObstacles();
    this.drawGround();
    this.updateScore();
    this.gameSpeed += 0.002;
    this.animationFrameId = requestAnimationFrame(this.boundLoop);
  }

  updateClouds() {
    this.clouds.forEach((c) => {
      c.x -= this.gameSpeed / 4;
      if (c.x + c.size * 2 < 0) {
        c.x = this.canvas.width;
        c.y = Math.random() * (this.canvas.height / 2);
      }
    });
    this.drawClouds();
  }

  updatePlayer() {
    this.player.dy += this.player.gravity;
    this.player.y += this.player.dy;
    this.player.onGround = false;
    if (this.player.y > this.canvas.height - this.groundHeight) {
      this.player.y = this.canvas.height - this.groundHeight;
      this.player.dy = 0;
      this.player.isJumping = false;
      this.player.onGround = true;
    }
    this.drawPlayer();
  }

  updateObstacles() {
    this.obstacleTimer--;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle();
      this.obstacleTimer = Math.floor(Math.random() * 80 + 90 - this.gameSpeed * 5);
    }
    this.obstacles.forEach((obstacle, index) => {
      obstacle.x -= this.gameSpeed;
      this.drawObstacle(obstacle);
      if (this.checkCollision(obstacle)) this.endGame();
      if (obstacle.x + obstacle.width < 0) this.obstacles.splice(index, 1);
    });
  }

  checkCollision(obstacle) {
    const playerHeight = this.player.isDucking ? this.player.duckingHeight : this.player.height;
    const playerTop = this.player.y - playerHeight;
    const playerBottom = this.player.y;
    const playerLeft = this.player.x;
    const playerRight = this.player.x + this.player.width;
    const obstacleTop = obstacle.y - obstacle.height;
    const obstacleBottom = obstacle.y;
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + obstacle.width;
    return (
      playerLeft < obstacleRight &&
      playerRight > obstacleLeft &&
      playerTop < obstacleBottom &&
      playerBottom > obstacleTop
    );
  }

  spawnObstacle() {
    const spawnBird = Math.random() > 0.7 && this.score > 500;
    let obstacle = {};
    if (spawnBird) {
      obstacle = {
        x: this.canvas.width,
        y: this.canvas.height - this.groundHeight - (Math.random() > 0.5 ? 40 : 10),
        width: 30,
        height: 20,
        isBird: true,
      };
    } else {
      const type = Math.floor(Math.random() * 3) + 1;
      if (type === 1) obstacle = { height: 30, width: 25 };
      else if (type === 2) obstacle = { height: 40, width: 15 };
      else obstacle = { height: 30, width: 40 };
      obstacle.x = this.canvas.width;
      obstacle.y = this.canvas.height - this.groundHeight;
      obstacle.type = type;
    }
    this.obstacles.push(obstacle);
  }

  updateScore() {
    this.score++;
    this.frameCount++;
    this.updateScoreDisplay();
  }

  updateScoreDisplay() {
    const displayScore = Math.floor(this.score / 10);
    if (this.scoreDisplay) this.scoreDisplay.textContent = String(displayScore).padStart(5, "0");
    if (this.highScoreDisplay)
      this.highScoreDisplay.textContent = String(this.highscore).padStart(5, "0");
  }

  drawInitialState() {
    this.updateThemeColors();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawClouds();
    this.drawGround();
    this.drawPlayer();
  }

  drawPlayer() {
    this.ctx.fillStyle = this.themeColors.text;
    const { x, y, width, height, duckingHeight, onGround, isDucking } = this.player;
    const currentHeight = isDucking ? duckingHeight : height;
    const currentY = y - currentHeight;
    if (isDucking) {
      this.ctx.fillRect(x, currentY, width, duckingHeight);
    } else {
      this.ctx.fillRect(x + 20, currentY, 20, 20);
      this.ctx.fillRect(x, currentY + 15, 30, 15);
      if (onGround) {
        if (Math.floor(this.frameCount / 6) % 2 === 0) {
          this.ctx.fillRect(x + 5, currentY + 30, 8, 10);
          this.ctx.fillRect(x + 20, currentY + 30, 8, 5);
        } else {
          this.ctx.fillRect(x + 5, currentY + 30, 8, 5);
          this.ctx.fillRect(x + 20, currentY + 30, 8, 10);
        }
      } else {
        this.ctx.fillRect(x + 5, currentY + 30, 8, 10);
        this.ctx.fillRect(x + 20, currentY + 30, 8, 10);
      }
    }
  }

  drawObstacle(o) {
    this.ctx.fillStyle = this.themeColors.obstacle;
    const y = o.y - o.height;
    if (o.isBird) {
      const birdY = o.y - o.height;
      this.ctx.fillRect(o.x, birdY + 10, o.width, 5);
      if (Math.floor(this.frameCount / 8) % 2 === 0) {
        this.ctx.fillRect(o.x + 5, birdY, 10, 10);
      } else {
        this.ctx.fillRect(o.x + 5, birdY + 15, 10, 10);
      }
    } else {
      if (o.type === 1) {
        this.ctx.fillRect(o.x + 5, y, o.width - 10, o.height);
        this.ctx.fillRect(o.x, y + 10, 5, 10);
        this.ctx.fillRect(o.x + o.width - 5, y + 5, 5, 10);
      } else if (o.type === 2) {
        this.ctx.fillRect(o.x, y, o.width, o.height);
      } else {
        this.ctx.fillRect(o.x, y, 15, o.height);
        this.ctx.fillRect(o.x + 25, y, 15, o.height);
      }
    }
  }

  drawClouds() {
    this.ctx.fillStyle = this.themeColors.border;
    this.clouds.forEach((c) => this.ctx.fillRect(c.x, c.y, c.size * 2, c.size));
  }

  drawGround() {
    this.ctx.fillStyle = this.themeColors.text;
    this.ctx.fillRect(0, this.canvas.height - this.groundHeight, this.canvas.width, 2);
  }
}
