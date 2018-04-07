import UTMLObject from "./utmlObject.js";

module.exports = class Player extends UTMLObject {

    constructor(args, whiteboard) {
        super(args, whiteboard);
    }

    orientate() {
        self = this;
        var averageOffset = {
            left: 0,
            top: 0
        }

        this.whiteboard.setup.objects.forEach(function (utmlObject) {
            averageOffset.left = (averageOffset.left + (utmlObject.getOffset().left - self.getOffset().left)) / 2;
            averageOffset.top = (averageOffset.top + (utmlObject.getOffset().top - self.getOffset().top)) / 2;
        });
        
        //Trigonometrie
        var a = averageOffset.left;
        var b = averageOffset.top;
        var c = Math.sqrt(averageOffset.left * averageOffset.left + averageOffset.top * averageOffset.top);
        
        var p = a * a / c;

        var alpha = Math.asin(p / a);


        console.log(alpha);
        console.log(self);
    }
}