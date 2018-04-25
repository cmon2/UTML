module.exports = class Action {

    constructor(lastAction, args, whiteboard) {
        this.whiteboard = whiteboard;
        this.last = lastAction;
        this.next = null;
        this.duration = 0;
        this.repeat = 0;
        this.timeline = new this.whiteboard.GreenSock.TimelineMax({ paused: true });
        this.timeline.smoothChildTiming = true;
        this.shell = new this.whiteboard.GreenSock.TweenMax(this.whiteboard.dummy, 5, { paused: true, x: 1, onStart: this.executeAndScheduleNext, onStartScope: this });
        this.plays = 0;
        this.id = getUniqueId();

        //TODO: besseres managen von Schleifen!
        if (args) {
            if (args[args.length - 1] === "<-") {
                this.repeat = -1;
            }
        }

        function getUniqueId() {

            var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
            return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
                return (Math.random() * 16 | 0).toString(16);
            }).toLowerCase();
        }
    }

    prepare() {
    }

    schedule() {
        //TODO: Check if the next action is from a different Timeline!
        this.shell.pause();
        console.log("next action gets scheduled!");
        //if (this.plays === 0) {
            if (this.last) {
                if (this.shell.timeline === this.last.shell.timeline) {
                    console.log("in same loop");
                    this.shell.startTime(this.last.shell.endTime());
                    console.log(this.last.shell.endTime());
                }
                else {
                    console.log("in different loop");
                    this.shell.timeline.startTime(this.last.shell.timeline.endTime());
                    console.log(this.last.shell.endTime());
                    console.log(this.shell.timeline.startTime());
                    console.log(this.shell.startTime());
                    console.log(this.shell.endTime());
                }
            }
        //}
    }

    executeAndScheduleNext() {
        var action = this;
        action.execute(function () {
            action.next.schedule();
        });
    }

    execute() {
        console.log("action gets executed:");
        console.log(this);
        this.timeline.clear();
        this.plays++;
    }

    insertActionAfter(action) {
        if (this.next) {
            action.next = this.next;
            this.next.last = action;
        }
        action.last = this;
        this.next = action;

        action.repeat = this.repeat;
        this.repeat = 1;
    }
}