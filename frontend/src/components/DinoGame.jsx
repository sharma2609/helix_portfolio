import { useEffect, useRef, useState } from "react";

const DinoGame = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 200;

    const savedHighScore = localStorage.getItem("helixDinoHighscore") || 0;
    setHighScore(parseInt(savedHighScore, 10) || 0);

    class DinoGame {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.width = 600;
        this.canvas.height = 200;
        this.themeColors = {};
        this.updateThemeColors();
        this.keyUpHandler = this.handleKeyUp.bind(this);
        this.keyDownHandler = this.handleKeyDown.bind(this);
      }

      updateThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        this.themeColors.text =
          styles.getPropertyValue("--text-primary").trim() || "#cccccc";
        this.themeColors.border =
          styles.getPropertyValue("--border-primary").trim() || "#3c3c3c";
        this.themeColors.obstacle =
          styles.getPropertyValue("--obstacle-color").trim() || "#f14c4c";
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
        this.clouds = [];
        this.score = 0;
        this.highscore = localStorage.getItem("helixDinoHighscore") || 0;
        this.gameSpeed = 5;
        this.frameCount = 0;
        this.obstacleTimer = 100;

        setHighScore(parseInt(this.highscore));
        setScore(0);

        if (this.clouds.length === 0) {
          for (let i = 0; i < 5; i++) {
            this.clouds.push({
              x: Math.random() * this.canvas.width,
              y: Math.random() * (this.canvas.height / 2),
              size: Math.random() * 20 + 10,
            });
          }
        }
        this.drawInitialState();
      }

      start() {
        this.init();
        this.gameRunning = false;
        setGameStarted(false);
        setGameOver(false);
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
      }

      stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
      }

      startGameLogic() {
        if (this.gameRunning) return;
        this.init();
        this.gameRunning = true;
        setGameStarted(true);
        setGameOver(false);
        this.gameLoop();
      }

      endGame() {
        this.gameRunning = false;
        const finalScore = Math.floor(this.score / 10);
        if (finalScore > this.highscore) {
          this.highscore = finalScore;
          localStorage.setItem("helixDinoHighscore", this.highscore);
          setHighScore(this.highscore);
        }
        setGameOver(true);
        setGameStarted(false);
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
          if (this.gameRunning && this.player.onGround)
            this.player.isDucking = true;
        }
      }

      handleKeyUp(e) {
        if (e.code === "ArrowDown") this.player.isDucking = false;
      }

      gameLoop() {
        if (!this.gameRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateClouds();
        this.updatePlayer();
        this.updateObstacles();
        this.drawGround();
        this.updateScore();
        this.gameSpeed += 0.002;
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
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
          this.obstacleTimer = Math.floor(
            Math.random() * 80 + 90 - this.gameSpeed * 5
          );
        }
        this.obstacles.forEach((obstacle, index) => {
          obstacle.x -= this.gameSpeed;
          this.drawObstacle(obstacle);
          if (this.checkCollision(obstacle)) this.endGame();
          if (obstacle.x + obstacle.width < 0) this.obstacles.splice(index, 1);
        });
      }

      checkCollision(obstacle) {
        const playerHeight = this.player.isDucking
          ? this.player.duckingHeight
          : this.player.height;
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
            y:
              this.canvas.height -
              this.groundHeight -
              (Math.random() > 0.5 ? 40 : 10),
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
        const displayScore = Math.floor(this.score / 10);
        setScore(displayScore);
      }

      drawInitialState() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawClouds();
        this.drawGround();
        this.drawPlayer();
      }

      drawPlayer() {
        this.updateThemeColors();
        this.ctx.fillStyle = this.themeColors.text;
        const { x, y, width, height, duckingHeight, onGround, isDucking } =
          this.player;
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
        this.updateThemeColors();
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
        this.updateThemeColors();
        this.ctx.fillStyle = this.themeColors.border;
        this.clouds.forEach((c) =>
          this.ctx.fillRect(c.x, c.y, c.size * 2, c.size)
        );
      }

      drawGround() {
        this.updateThemeColors();
        this.ctx.fillStyle = this.themeColors.text;
        this.ctx.fillRect(
          0,
          this.canvas.height - this.groundHeight,
          this.canvas.width,
          2
        );
      }
    }

    const game = new DinoGame(canvas);
    gameRef.current = game;
    game.start();

    return () => {
      if (game) {
        game.stop();
      }
    };
  }, []);

  const startGame = () => {
    if (gameRef.current) {
      gameRef.current.startGameLogic();
    }
  };

  return (
    <div className="game-pane">
      <div className="game-info">
        <span>HI {String(highScore).padStart(5, "0")}</span>
        <span style={{ marginLeft: "20px" }}>
          SCORE: {String(score).padStart(5, "0")}
        </span>
        {(!gameStarted || gameOver) && (
          <div className="start-message" onClick={startGame}>
            {gameOver
              ? "Game Over! Press Space to Restart"
              : "Press Space to Start"}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default DinoGame;
