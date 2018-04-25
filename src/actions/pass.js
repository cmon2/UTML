const PlayerBallAction = require("./playerBallAction.js");
const BallAction = require("./ballAction.js");

module.exports = class Pass extends PlayerBallAction {

    constructor(lastAction, args, whiteboard) {
        super(lastAction, args, whiteboard);
        this.ballDistance = 0.66;
    }

    prepare() {
        super.prepare();
        var ballAction = new BallAction(this, this.ball, this.target, 5, this.whiteboard);
        this.insertActionAfter(ballAction);
    }

    schedule() {
        super.schedule();
        console.log("neue Zeit für die shell setzen");
        console.log(this.last.duration);
        this.shell.duration(this.last.duration);
        console.log(this.shell.endTime());
        this.shell.play();
    }

    execute(scheduleNext) {
        super.execute();

        var ready = new this.whiteboard.GreenSock.TweenLite(this.player.body, 1, { paused: true, fill: "rgb(0,0,255)", onStart: callBall, onStartParams: [this] });
        function callBall(pass) {
            pass.player.ball = pass.ball;
            pass.player.face(pass.player.ball);
        }

        //alert(this.ball.movement);

        var position = this.player.move(this.player, this.ball.target, 5, {left: 0, back: 0});//.updateTo({ onComplete: passBall, onCompleteParams: [this] }));

        var extend = new this.whiteboard.GreenSock.TweenLite(this.player.leftArm, 2, { paused: true, stroke: "rgb(0,255,0)", onStart: passBall, onStartParams: [this] });
        function passBall(pass) {
            pass.player.face(pass.target);
            pass.player.moveArms("pass", 2);
        }

        var recover = new this.whiteboard.GreenSock.TweenLite(this.player.rightArm, 2, { paused: true, stroke: "rgb(0,255,0)", onStart: recover, onStartParams: [this] });
        function recover(pass) {
            pass.player.moveArms("player", 2);
        }

        var runBack = this.player.moveBack(this.player, 5);

        this.pre_contact.add(ready.play()).add(position.play()).add(extend.play())
        this.post_contact.add(recover.play()).add(runBack.play());

        this.pre_contact.duration(this.last.duration - 0.1);
        this.post_contact.duration(this.last.duration - 0.1);

        this.timeline.add(this.pre_contact.play()).add(this.post_contact.play());

        this.timeline.play();
        scheduleNext();
    }
}