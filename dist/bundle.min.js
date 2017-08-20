const Pong = class {
    constructor(ref, options) {
        this._defaults = {
            ballX: 50,
            ballSpeedX: 4.1,
            ballY: 50,
            ballSpeedY: 4.1,
            paddle1Y: 250,
            paddle2Y: 250,
            player1Score: 0,
            player2Score: 0,
            showingWinScreen: false,
            
            PADDLE_HEIGHT: 100,
            PADDLE_THICKNESS: 10,
            WINNING_SCORE: 5
        }
        this._vars = Object.assign({}, this._defaults, options);
        this._canvas = ref;
        this._canvasContext = this._canvas.getContext("2d");

        this._update();

        this._canvas.addEventListener("mousedown", (e) => {
            if (this._vars.showingWinScreen) {
                this._vars.player1Score = 0;
                this._vars.player2Score = 0;
                this._vars.showingWinScreen = false;
            }
        });

        this._canvas.addEventListener("mousemove", (e) => {
            let mousePos = this._calculateMousePos(e);
            this._vars.paddle1Y = mousePos.y - (this._vars.PADDLE_HEIGHT / 2);
        });
    }

    _update() {
        requestAnimationFrame(this._update.bind(this));
        this._moveEverything();
        this._drawEverything();
    }

    _calculateMousePos(e) {
        let rect = this._canvas.getBoundingClientRect();
        let root = document.documentElement;
        let mouseX = e.clientX - rect.left - root.scrollLeft;
        let mouseY = e.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    _moveEverything() {
        if(this._vars.showingWinScreen) {
            return;
        }
        this._computerMovement();
        this._vars.ballX += this._vars.ballSpeedX;
        this._vars.ballY += this._vars.ballSpeedY;
        if(this._vars.ballX > (this._canvas.width - this._vars.PADDLE_THICKNESS)) {
            if(this._vars.ballY > (this._vars.paddle2Y - 5) && this._vars.ballY < (this._vars.paddle2Y + this._vars.PADDLE_HEIGHT + 5)) {
                this._vars.ballSpeedX = - this._vars.ballSpeedX;
                let deltaY = this._vars.ballY - (this._vars.paddle2Y + this._vars.PADDLE_HEIGHT / 2);
                this._vars.ballSpeedY = deltaY * 0.33;
            } else {
                this._vars.player1Score++;
                this._ballReset();
            };
        };
        if(this._vars.ballX < this._vars.PADDLE_THICKNESS) {
            if(this._vars.ballY > (this._vars.paddle1Y - 5) && this._vars.ballY < (this._vars.paddle1Y + this._vars.PADDLE_HEIGHT + 5)) {
                this._vars.ballSpeedX = - this._vars.ballSpeedX;
                let deltaY = this._vars.ballY - (this._vars.paddle1Y + this._vars.PADDLE_HEIGHT / 2);
                this._vars.ballSpeedY = deltaY * 0.33;
            } else {
                this._vars.player2Score++;
                this._ballReset();					
            };
        };
        if(this._vars.ballY > (this._canvas.height - 10)) {
            this._vars.ballSpeedY = - this._vars.ballSpeedY;
        };
        if(this._vars.ballY < 5) {
            this._vars.ballSpeedY = - this._vars.ballSpeedY;
        };
    }

    _drawEverything() {
        this._colorRect(0, 0, this._canvas.width, this._canvas.height, "black");
    
        if (this._vars.showingWinScreen) {
            this._canvasContext.fillStyle = "white";
            if (this._vars.player1Score >= this._vars.WINNING_SCORE) {
                this._canvasContext.font = "20px sans-serif";
                this._canvasContext.fillText("EPIC WIN!",360,100);
            } else if (this._vars.player2Score >= this._vars.WINNING_SCORE) {
                this._canvasContext.font = "20px sans-serif";
                this._canvasContext.fillText("YOU LOSE!",350,100);
            }
            this._canvasContext.fillText("Click to start new game...",300,500);
            return;
        };
    
        this._drawNet();

        this._colorRect(0, this._vars.paddle1Y, this._vars.PADDLE_THICKNESS, this._vars.PADDLE_HEIGHT, "white");

        this._colorRect((this._canvas.width - this._vars.PADDLE_THICKNESS),
            this._vars.paddle2Y, this._vars.PADDLE_THICKNESS, this._vars.PADDLE_HEIGHT, "white");

        this._colorCircle(this._vars.ballX, this._vars.ballY, 10, "white");
        
        this._canvasContext.font = "20px sans-serif";
        this._canvasContext.fillText(this._vars.player1Score, 100,100);
        this._canvasContext.fillText(this._vars.player2Score, this._canvas.width - 100,100);
    }

    _computerMovement() {
        let paddle2YCenter = this._vars.paddle2Y + (this._vars.PADDLE_HEIGHT/2);
        if(paddle2YCenter < this._vars.ballY - 20) {
            this._vars.paddle2Y += 6;
        } else if(paddle2YCenter > this._vars.ballY + 20) {
            this._vars.paddle2Y -= 6;
        }
    }

    _ballReset() {
        if(this._vars.player1Score >= this._vars.WINNING_SCORE || this._vars.player2Score >= this._vars.WINNING_SCORE) {
            this._vars.showingWinScreen = true;
        }
        this._vars.ballSpeedX = - this._vars.ballSpeedX;
        this._vars.ballX = this._canvas.width / 2;
        this._vars.ballY = this._canvas.height / 2;
    }

    _colorRect(leftX,topY,width,height,drawColor) {
        this._canvasContext.fillStyle = drawColor;
        this._canvasContext.fillRect(leftX,topY,width,height);
    }

    _drawNet() {
        for(let i = 0; i < this._canvas.height; i += 40) {
            this._colorRect(this._canvas.width / 2 - 1, i, 2, 20, "white");
        };
    }

    _colorCircle(centerX,centerY,radius,drawColor) {
        this._canvasContext.fillStyle = drawColor;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
        this._canvasContext.fill();
    }
}

const ref = document.getElementById("game-canvas");
new Pong(ref);