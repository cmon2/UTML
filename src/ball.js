const UTMLObject = require("./utmlObject.js");

module.exports = class Ball extends UTMLObject {

    constructor(args, whiteboard) {
        super(args, whiteboard)
    }

    display() {
        super.display(function(){
        });
    }

    meets(utmlObject) {
        switch (utmlObject.constructor.name) {
            case "Player":
                break;
            default:
                console.log("eine Methode zum Aufeinandertreffen von " + this.constructor.name + " und " + utmlObject.constructor.name + " ist nicht definiert.");
                break;
        }
    }
}