const Actions = require("./actions");
const Controls = require("./gsapplayer");

module.exports = class Flow {

    constructor(flowDefinition, whiteboard) {
        self = this;
        this.whiteboard = whiteboard;
        this.definition = flowDefinition;
        this.loopActionDefinitions = getActionDefinitions(this.definition);
        console.log(this.loopActionDefinitions);

        this.timeline = new this.whiteboard.GreenSock.TimelineMax({ paused: true });
        this.loops = [];
        this.actions = [];

        var loop = 0;
        this.loopActionDefinitions.forEach(function (actionDefinitions) {
            self.actions[loop] = [];
            var lastAction = null;
            actionDefinitions.forEach(function (actionDefinition) {
                var action = invokeAction(actionDefinition, lastAction);
                if (lastAction) { lastAction.next = action; }
                lastAction = action;
                self.actions[loop].push(action);
            });
            loop++;
        });

        function getActionDefinitions(flowDefinition) {
            flowDefinition = flowDefinition.replace(/(\r\n\t|\n|\r\t)/gm, "");

            //Die einzelnen Loops sind durch ; getrennt
            var actionDefinitionLoops = flowDefinition.split(/\r?;/);

            var loopActionDefinitions = [];

            //Jetzt werden die einzelnen Aktionen abgetrennt
            var loop = 0;
            actionDefinitionLoops.forEach(function (actionDefinitionLoop) {
                if (actionDefinitionLoop.trim() !== "") {
                    loopActionDefinitions[loop] = [];
                    var loopActionDefinitionStrings = actionDefinitionLoop.split(" -> ");

                    loopActionDefinitionStrings.forEach(function (loopActionDefinitionString) {
                        loopActionDefinitions[loop].push(loopActionDefinitionString.split(" "));
                    });

                    loop++;
                }
                else {
                    console.warn("UTML entspricht nicht den Specs");
                }
            });

            return loopActionDefinitions;
        }

        function invokeAction(actionDefinition, lastAction) {
            var actionType = actionDefinition[2];

            switch (actionType) {
                case 'serve':
                    return new Actions.serve(lastAction, actionDefinition, whiteboard);
                case 'receive':
                    return new Actions.receive(lastAction, actionDefinition, whiteboard);
                case 'pass':
                    return new Actions.pass(lastAction, actionDefinition, whiteboard);
                default:
                    console.error("Did not find an Action " + actionType + " either the UTML is corrupt or something is wrong with the class.");
            }
        }

        console.log(this);
    }

    prepare(callback) {
        self = this;
        var idx = 0;
        this.actions.forEach(function (actionLoop) {
            var action = actionLoop[0];
            while (action) {
                action.prepare();
                action = action.next;
            }
        });
        callback();
    }

    play() {
        self = this;
        var idx = 0;
        console.log(this.actions);
        this.actions.forEach(function (actionLoop) {
            var action;

            //Fügt das Ende der letzten Loop an den Anfang der nächsten
            console.log(self.actions[idx]);
            if (self.actions[idx - 1]) {
                action = self.actions[idx - 1][0];
                while (action.next) { action = action.next; }
                console.log("Schritte verbunden");
                action.next = actionLoop[0];
                actionLoop[0].last = action;
            }

            //fügt das Ende der Loop an ihren Anfang, falls die behandelte Loop eine Schleife ist
            if (self.actions[idx][self.actions[idx].length - 1].repeat == -1) {
                self.actions[idx][self.actions[idx].length - 1].next = self.actions[idx][0];
            }
            if (self.actions[idx - 1]) {
                action = self.actions[idx - 1][0];
                while (action.next) { action = action.next; }
                console.log("Schleife verknüpft");
                action.next = actionLoop[0];
                actionLoop[0].last = action;
            }

            self.loops.push(new self.whiteboard.GreenSock.TimelineMax({ paused: true }));

            action = actionLoop[0];

            //Die erste Aktion wird gescheduled, die nachfolgenden werden onComplete vom Vorgänger gescheduled
            action.schedule();
            while (action) {
                console.log("add new shell to timeline!");
                console.log(action);
                self.timeline.add(action.shell);
                //self.loops[idx].repeat(action.repeat);
                if (action.repeat == -1) {
                    action.next = actionLoop[0];
                    break;
                }
                action = action.next;
            }

            idx++;
        });
/*
        this.loops[0].getChildren()[0].play();
        this.loops.forEach(function (loop) {
            self.timeline.add(loop.play());
        });
*/
        this.timeline.getChildren()[0].play();
        Controls({ playerTL: this.timeline });

        this.timeline.play();

        console.log(this.timeline);
        console.log("-----------board ready----------");

        //self.loops[0].play();
    }
}