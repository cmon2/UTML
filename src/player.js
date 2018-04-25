const Actions = require("./actions");
const UTMLObject = require("./utmlObject.js");

module.exports = class Player extends UTMLObject {

    constructor(args, whiteboard) {
        super(args, whiteboard);

        this.leftArm;
        this.rightArm;
        this.body;
        this.orientation;
    }

    display() {
        var player = this;
        super.display(function () {

            player.orientation = 0;
            player.leftArm = player.element.getElementsByClassName("leftArm")[0];
            player.rightArm = player.element.getElementsByClassName("rightArm")[0];
            player.body = player.element.getElementsByClassName("body")[0];

            var className = player.constructor.name.toLowerCase();
            if (player.whiteboard.assets[className].leftArm == null) {
                player.whiteboard.assets[className].leftArm = player.whiteboard.assets[className].element.content.querySelector('.leftArm');
                player.whiteboard.assets[className].rightArm = player.whiteboard.assets[className].element.content.querySelector('.rightArm');
                player.whiteboard.assets[className].body = player.whiteboard.assets[className].element.content.querySelector('.body');
            }
        });
    }

    face(something) {
        switch (something.constructor.name) {
            case "Player":
                this.faceObject(something);
                break;
            case "Ball":
                this.faceObject(something);
                break;
            case "String":
                this.faceCell(something);
                break;
            default:
                console.log("Der Spieler weiß nicht, wie er Richtung eines " + something + " schauen soll.");
                break;
        }
        if (this.ball) {
            this.ball.orientate(this.orientation);
        }
    }

    faceObject(utmlObject) {
        this.orientateTowards(utmlObject.getOffset().left - this.getOffset().left, utmlObject.getOffset().top - this.getOffset().top);
        utmlObject.isFacedBy[this.name] = this;
    }

    faceCell(cell) {
        var cell = this.whiteboard.space.cells[cell];
        this.orientateTowards(cell.getOffset().left - this.getOffset().left, cell.getOffset().top - this.getOffset().top);
    }

    moveBack(utmlObject, speed)
    {
		console.log("utmlObject to be moved back:");
		console.log(utmlObject);
		console.log(speed);

		//speed wird in Meter/Sekunde angegeben.
		//Länge eines Meters in Pixel der Anzeige berechnen:
		var lengthPixelMeter = (utmlObject.whiteboard.space.element.offsetHeight / utmlObject.whiteboard.space.length);
		var widthPixelMeter = (utmlObject.whiteboard.space.element.offsetWidth / utmlObject.whiteboard.space.width);
		var pixelMeter = (lengthPixelMeter + widthPixelMeter) / 2;
		if (lengthPixelMeter !== widthPixelMeter) {
			console.warn("Länge und Breite des Spielfelds entsprechen nicht dem gewünschten Verhältnis.");

		}

		var offsetLeft = utmlObject.getOffset().left - utmlObject.targetOffset.left;
		var offsetTop = utmlObject.getOffset().top - utmlObject.targetOffset.top;

		//Länge der Strecke in Meter berechnen:
		var distance = Math.sqrt(offsetLeft * offsetLeft + offsetTop * offsetTop) / pixelMeter;

		//Dauer der Bewegung berechnen:
		var duration = distance / speed;

		//Bewegung an aktuelle Position anpassen
		var marginLeftOrigin = 0;
		var marginTopOrigin = 0;
		if (utmlObject.element.style.marginLeft) { marginLeftOrigin = parseInt(utmlObject.element.style.marginLeft.replace(/px/, "")) };
		if (utmlObject.element.style.marginTop) { marginTopOrigin = parseInt(utmlObject.element.style.marginTop.replace(/px/, "")) };


        //TODO Callbacks anpassen!
		utmlObject.movement = utmlObject.whiteboard.GreenSock.TweenMax.fromTo(utmlObject.element, duration, { marginLeft: parseInt(marginLeftOrigin) - parseInt(offsetLeft), marginTop: parseInt(marginTopOrigin) - parseInt(offsetTop) }, { paused: true, ease: Power0.easeNone, marginLeft: marginLeftOrigin, marginTop: marginTopOrigin, onUpdate: utmlObject.getLookedAt, onUpdateParams: [utmlObject] });//, onComplete: utmlObject.switchCellTo, onCompleteParams: [utmlObject, targetCell] });

		utmlObject.targetOffset.left = utmlObject.getOffset().left + parseInt(offsetLeft);
		utmlObject.targetOffset.top = utmlObject.getOffset().top + parseInt(offsetTop);

		return utmlObject.movement;
	}

    orientate() {
        self = this;
        var averageOffset = {
            left: 0,
            top: 0
        }

        for (var key in self.whiteboard.setup.objects) {
            var utmlObject = self.whiteboard.setup.objects[key];
            averageOffset.left = (averageOffset.left + (utmlObject.getOffset().left - self.getOffset().left)) / 2;
            averageOffset.top = (averageOffset.top + (utmlObject.getOffset().top - self.getOffset().top)) / 2;
        }

        this.orientateTowards(averageOffset.left, averageOffset.top);
    }

    orientateTowards(left, top) {
        //Trigonometrie
        var a = left;
        var b = top;
        var c = Math.sqrt(a * a + b * b);

        var alpha = Math.asin(b / c) * (180 / Math.PI);
        alpha = Math.sqrt(alpha * alpha);


        var rotationCorrection;
        if (left >= 0 && top >= 0) {
            rotationCorrection = 0;
        }
        if (left < 0 && top >= 0) {
            alpha = 90 - alpha;
            rotationCorrection = 90;
        }
        if (left < 0 && top < 0) {
            rotationCorrection = 180;
        }
        if (left >= 0 && top < 0) {
            alpha = 90 - alpha;
            rotationCorrection = 270;
        }
        
        var turn = this.whiteboard.GreenSock.TweenLite.to(this.element, 0, { directionalRotation: alpha + rotationCorrection + "_short" });

        this.orientation = alpha + rotationCorrection;
    }

    meets(utmlObject) {
        switch (utmlObject.constructor.name) {
            case "Ball":
                return this.meetsBall(utmlObject);

            default:
                console.log("eine Methode zum Aufeinandertreffen von " + this.constructor.name + " und " + utmlObject.constructor.name + " ist nicht definiert.");
                break;
        }
    }

    meetsBall(ball) {
        return new Actions.hold(this, ball, this.whiteboard);
    }

    moveArms(asset, duration) {

        var leftArm = this.snap.select(".leftArm");
        var futureLeftArm = this.whiteboard.assets[asset].element.content.querySelector('.leftArm');
        var rightArm = this.snap.select(".rightArm");
        var futureRightArm = this.whiteboard.assets[asset].element.content.querySelector('.rightArm');

        rightArm.animate({ d: futureRightArm.getAttribute('d') }, duration * 100, mina.linear);
        leftArm.animate({ d: futureLeftArm.getAttribute('d') }, duration * 100, mina.linear);
    }
}