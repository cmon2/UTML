module.exports = class UTMLObject {

	constructor(args, whiteboard) {
		this.whiteboard = whiteboard;
		this.name = args[0] + args[1];
		this.position = args[2];
		this.movement = null;

		this.deviation = { left: null, back: null };

		this.targetOffset = { left: null, top: null };

		this.element = document.createElement("div");
		this.element.id = this.whiteboard.id + this.name;
		this.element.className += " " + this.whiteboard.id + this.constructor.name;
		this.element.className += " " + this.constructor.name;

		this.svg;
		this.snap;

		this.xPosition = this.position.replace(/^\D+/g, '');
		this.yPosition = this.position.replace(/\d+$/, '');

		this.element.style.position = "absolute";

		this.isFacedBy = {};
	}

	display(callback) {
		//Die Maße des Objekts berechnen sich aus den tatsächlichen Maßen der Anzeige und den Angaben in Metern
		this.element.style.width = this.whiteboard.space.element.offsetWidth / this.whiteboard.space.width * 2 + "px";
		this.element.style.height = this.whiteboard.space.element.offsetHeight / this.whiteboard.space.length * 2 + "px";

		this.whiteboard.space.cells[this.position].element.appendChild(this.element);

		this.svg = this.whiteboard.assets[this.constructor.name.toLowerCase()].element.content.querySelector("svg").cloneNode(true);

		//this.svg.setAttribute("preserveAspectRatio", "xMinYMax meet");
		this.svg.setAttribute("height", this.element.offsetHeight);
		this.svg.setAttribute("width", this.element.offsetWidth);
		this.element.appendChild(this.svg);

		this.snap = this.whiteboard.Snap(this.svg);

		this.targetOffset = this.getOffset();

		callback();
	}

	move(utmlObject, targetCell, speed, deviation) {

		console.log("utmlObject to be moved:");
		console.log(utmlObject);
		console.log(targetCell, speed, deviation.back, deviation.left);

		//speed wird in Meter/Sekunde angegeben.
		//Länge eines Meters in Pixel der Anzeige berechnen:
		var lengthPixelMeter = (utmlObject.whiteboard.space.element.offsetHeight / utmlObject.whiteboard.space.length);
		var widthPixelMeter = (utmlObject.whiteboard.space.element.offsetWidth / utmlObject.whiteboard.space.width);
		var pixelMeter = (lengthPixelMeter + widthPixelMeter) / 2;
		if (lengthPixelMeter !== widthPixelMeter) {
			console.warn("Länge und Breite des Spielfelds entsprechen nicht dem gewünschten Verhältnis.");

		}

		//var originCell = utmlObject.whiteboard.space.cells[originCell];
		var targetCell = utmlObject.whiteboard.space.cells[targetCell];
		var offsetLeft = targetCell.getOffset().left - utmlObject.getOffset().left;
		var offsetTop = targetCell.getOffset().top - utmlObject.getOffset().top;

		if (deviation.back && deviation.back != 0) {
			var distance = Math.sqrt(offsetLeft * offsetLeft + offsetTop * offsetTop) / pixelMeter;
			console.log(distance);
			var offsetLeftDeviation = deviation.back * (offsetLeft / distance);
			var offsetTopDeviation = deviation.back * (offsetTop / distance);
			console.log(offsetLeftDeviation);
			console.log(offsetTopDeviation);
			offsetLeft -= offsetLeftDeviation;
			offsetTop -= offsetTopDeviation;
		}

		if (deviation.left && deviation.left != 0) {
			var distance = Math.sqrt(offsetLeft * offsetLeft + offsetTop * offsetTop) / pixelMeter;
			var offsetLeftDeviation = deviation.back * (offsetLeft / distance);
			var offsetTopDeviation = deviation.back * (offsetTop / distance);
			offsetLeft -= offsetLeftDeviation;
			offsetTop += offsetTopDeviation;
		}

		//Länge der Strecke in Meter berechnen:
		var distance = Math.sqrt(offsetLeft * offsetLeft + offsetTop * offsetTop) / pixelMeter;

		//Dauer der Bewegung berechnen:
		var duration = distance / speed;

		//Bewegung an aktuelle Position anpassen
		var marginLeftOrigin = 0;
		var marginTopOrigin = 0;
		if (utmlObject.element.style.marginLeft) { marginLeftOrigin = utmlObject.element.style.marginLeft.replace(/px/, "") };
		if (utmlObject.element.style.marginTop) { marginTopOrigin = utmlObject.element.style.marginTop.replace(/px/, "") };



		utmlObject.movement = utmlObject.whiteboard.GreenSock.TweenMax.fromTo(utmlObject.element, duration, { marginLeft: marginLeftOrigin, marginTop: marginTopOrigin }, { paused: true, ease: Power0.easeNone, marginLeft: parseInt(marginLeftOrigin) + parseInt(offsetLeft), marginTop: parseInt(marginTopOrigin) + parseInt(offsetTop), onUpdate: utmlObject.getLookedAt, onUpdateParams: [utmlObject] });//, onComplete: utmlObject.switchCellTo, onCompleteParams: [utmlObject, targetCell] });

		utmlObject.targetOffset.left = utmlObject.getOffset().left + parseInt(offsetLeft);
		utmlObject.targetOffset.top = utmlObject.getOffset().top + parseInt(offsetTop);
		utmlObject.deviation = deviation;

		return utmlObject.movement;
	}

	getLookedAt(utmlObject) {
		for (var key in utmlObject.isFacedBy) {
			utmlObject.isFacedBy[key].face(utmlObject);
		}
	}

	switchCellTo(utmlObject, cell) {
		utmlObject.element.style.marginLeft = 0;
		utmlObject.element.style.marginTop = 0;
		cell.element.appendChild(utmlObject.element);
	}

	orientate(rotation) {
		this.whiteboard.GreenSock.TweenLite.to(this.element, 0, { rotation: rotation });
	}

	getOffset() {

		var offset = {
			left: this.element.offsetLeft + this.element.offsetWidth / 2,
			top: this.element.offsetTop + this.element.offsetHeight / 2
		}

		return offset;
	}

}