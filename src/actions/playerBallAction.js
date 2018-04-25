const PlayerAction = require("./playerAction.js");

module.exports = class PlayerBallAction extends PlayerAction {

    constructor(lastAction, args, whiteboard) {
        super(lastAction, args, whiteboard);
        this.ball = args[3] + args[4];
        this.target = args[5];
        this.pre_contact = new this.whiteboard.GreenSock.TimelineMax({ paused: true });
        this.pre_contact.smoothChildTiming = true;
        this.post_contact = new this.whiteboard.GreenSock.TimelineMax({ paused: true });
        this.post_contact.smoothChildTiming = true;
    }

    prepare() {
        super.prepare();
        this.ball = this.whiteboard.setup.objects[this.ball];
        this.ball.target = this.target;
    }

    schedule() {
        super.schedule();
    }

    execute() {
        super.execute();
    }
}