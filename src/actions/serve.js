const PlayerBallAction = require("./playerBallAction.js");
const BallAction = require("./ballAction.js");

module.exports = class Serve extends PlayerBallAction {

    constructor(lastAction, args, whiteboard) {
        super(lastAction, args, whiteboard);
    }

    prepare() {
        super.prepare();
        var ballAction = new BallAction(this, this.ball, this.target, 5, this.whiteboard);
        this.insertActionAfter(ballAction);
    }

    schedule() {
        super.schedule();
        this.duration = 1;
        this.shell.duration(this.duration);
        this.shell.play();
    }

    execute(scheduleNext) {
        super.execute();

        this.player.face(this.target);
        var viewBox = this.ball.svg.getAttribute("viewBox").split(" ");
        var viewBoxSize = (parseInt(viewBox[2]) + parseInt(viewBox[3])) / 2;
        var ballSize = ((this.ball.svg.querySelector('.ball').getAttribute("r") * 2) / viewBoxSize) * this.ball.svg.width.animVal.value;

        var spike = this.whiteboard.GreenSock.TweenLite.to(this.player.svg, 1, { paused: true, marginLeft: "-" + ballSize, marginTop: "-" + ballSize / 2, onStart: spikeBall, onStartParams: [this] });
        function spikeBall(serve) {
            serve.player.moveArms("serve", 1);
        }

        var recover = this.whiteboard.GreenSock.TweenLite.to(this.player.svg, 1, { paused: true, marginLeft: 0, marginTop: 0, onStart: ready, onStartParams: [this] });
        function ready(serve) {
            serve.player.moveArms("player", 1);
        }

        this.timeline.add(spike.play()).add(recover.play());
        this.timeline.play();
        scheduleNext();
    }
}