const Action = require("./action.js");

module.exports = class PlayerAction extends Action {

    constructor(lastAction, args, whiteboard) {
        super(lastAction, args, whiteboard);
        this.player = args[0] + args[1];
    }

    prepare() {
        super.prepare();
        this.player = this.whiteboard.setup.objects[this.player];
    }
    
    schedule() {
        super.schedule();
    }

    execute() {
        super.execute();
    }
}