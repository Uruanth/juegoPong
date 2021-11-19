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