const Action = require("./action.js");

module.exports = class BallAction extends Action {

    constructor(lastAction, ball, target, speed, whiteboard) {
        super(lastAction, null, whiteboard);
        this.ball = ball;
        this.target = target;
        this.speed = speed;
        this.duration = 0;
        this.deviation = { left: 0, back: 0 };
    }

    prepare() {
        super.prepare();
    }

    schedule() {
        super.schedule();
        this.shell.duration(0.1);
        this.shell.play();
    }

    execute(scheduleNext) {
        super.execute();

        this.ball.target = this.target;

        if (this.next.ballDistance) {
            this.deviation.back = this.next.ballDistance;
        }

        var move = this.ball.move(this.ball, this.target, this.speed, this.deviation);

        this.timeline.add(move.play());
        this.timeline.play();

        //Sorge dafür, dass die nächste Spielaktion immer die richtige Ballaktion als letzte Aktion hat.
        this.next.last = this;

        //Gib der nächsten Spielaktion Informationen zum arbeiten
        this.duration = this.timeline.duration();
        scheduleNext();
    }
}