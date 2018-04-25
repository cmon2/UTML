const PlayerAction = require("./playerAction.js");

module.exports = class Hold extends PlayerAction {

    constructor(player, ball, whiteboard) {
        super(null, [player.name, ""], whiteboard);
        this.player = player;
        this.ball = ball;
    }

    execute() {
        this.player.ball = this.ball;
        this.player.ball.orientate(this.player.orientation);

        this.player.moveArms("hold", 0.5);
        var viewBox = this.ball.svg.getAttribute("viewBox").split(" ");
        var viewBoxSize = (parseInt(viewBox[2]) + parseInt(viewBox[3])) / 2;
        var ballSize = ((this.ball.svg.querySelector('.ball').getAttribute("r") * 2) / viewBoxSize ) * this.ball.svg.width.animVal.value;

        this.whiteboard.GreenSock.TweenLite.to(this.player.svg, 2, { marginLeft: "-" + ballSize * 1.3});
    }
}