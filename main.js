class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;

    };
    get elements() {
        let elements = this.bars.map(bar => bar);
        elements.push(this.ball);
        return elements;
    }
};

class Ball {
    constructor(x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;

        this.speed_x = 3;
        this.speed_y = 0;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 2;
        this.speed = 3;
        this.kind = "circle";

        board.ball = this;

    }

    move() {
        this.x += (this.speed_x * this.direction);
        this.y += (this.speed_y);
    }

    get width() {
        return this.radius * 2;
    }

    get height() {
        return this.radius * 2;
    }

    collision = bar => {
        //Reaccion a la colision
        let relative_intersect_y = (bar.y + (bar.height / 2)) -
            this.y;

        let normalized_intersect_y = relative_intersect_y /
            (bar.height / 2);

        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);
        console.log(this.speed_x)
        console.log(this.speed_y)

        if (this.x > (this.board.width / 2)) {
            this.direction = -1;
        } else {
            this.direction = 1;
        }


    }
};

class Bar {
    constructor(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 5;
    }

    down = () => this.y += this.speed;
    up = () => this.y -= this.speed;
};

class BoardView {
    constructor(canvas, board) {
        this.canvas = canvas;
        this.board = board;
        this.ctx = canvas.getContext("2d");
        this.canvas.height = board.height;
        this.canvas.width = board.width;
    }

    clean = () => this.ctx.clearRect(0, 0, this.board.width,
        this.board.height);

    draw = () => {

        for (let i in this.board.elements) {
            let el = this.board.elements[i];
            this.drawf(this.ctx, el);
        }
    };

    check_collisions = () => {

        for (let i of this.board.bars) {
            if (this.hit(i, this.board.ball)) {
                this.board.ball.collision(i);
            }
        }

        //Bordes verticales
        if (this.board.ball.x < 0 || this.board.ball.x > 800) {
            if (this.board.ball.x < 0) {
                conP1++;
                document.getElementById("p2").innerHTML = `PUNTAJE ${conP1}`;
                if (conP1 > 5) {
                    this.board.game_over = true;
                }
            }

            if (this.board.ball.x > 800) {
                conP2++;
                document.getElementById("p1").innerHTML = `PUNTAJE ${conP2}`;
                if (conP2 > 5) {
                    this.board.game_over = true;
                }
            }
            this.board.ball.speed_x *= -1;
        }
        console.log(this.board.ba)
        //Colicones horizontales
        if (this.board.ball.y < 0 || this.board.ball.y > 400) {
            this.board.ball.speed_y *= -1;
        }
    };

    play = () => {
        if (this.board.playing) {
            this.clean();
            this.draw();
            this.check_collisions();
            this.board.ball.move();
        }
    };

    hit(a, b) {
        let hit = false;
        //Colisiones horizontales
        if ((b.x + b.width >= a.x + a.width) && (b.x < a.x + a.width)) {
            //Colisiones verticales
            if ((b.y + b.height >= a.y) && (b.y < a.y + a.height))
                hit = true;
        }

        //Colisión de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }

        //Colisión b con a
        if (a.x <= b.x && a.x - a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }

        return hit;
    };

    drawf(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
}