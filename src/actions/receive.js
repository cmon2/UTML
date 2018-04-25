const PlayerBallAction = require("./playerBallAction.js");
const BallAction = require("./ballAction.js");

module.exports = class Receive extends PlayerBallAction {

    constructor(lastAction, args, whiteboard) {
        super(lastAction, args, whiteboard);
    }

    prepare() {
        super.prepare();
    }

    execute() {
        super.execute();

        var ballAction = new BallAction(this, this.ball, this.target, 2, this.whiteboard);
        this.insertActionAfter(ballAction);

        var ready = new this.whiteboard.GreenSock.TweenLite(this.player.body, 1, { fill: "rgb(0,0,255)", onStart: callBall, onStartParams: [this] });
        function callBall(receive) {
            receive.player.ball = receive.ball;
            receive.player.face(receive.player.ball);
        }
        var position = this.player.move(this.player.position, this.ball.target, 5);//.updateTo({ onComplete: passBall, onCompleteParams: [this] }));
        var extend = new this.whiteboard.GreenSock.TweenLite(this.player.leftArm, 1, { stroke: "rgb(0,255,0)", onComplete: passBall, onCompleteParams: [this] });
        function passBall(receive) {
            receive.player.face(receive.target);
            receive.moveArms("receive", 1);
        }

        this.timeline.add(ready).add(position).add(extend);

        this.timeline.totalDuration(this.totalDuration);
        this.timeline.delay(-this.totalDuration);
    }
}