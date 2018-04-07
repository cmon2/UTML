module.exports = class UTMLObject {

	constructor(args, whiteboard) {
		this.whiteboard = whiteboard;
		this.name = args[0];
		this.position = args[1];

		this.element = document.createElement("img");
		this.element.id = this.whiteboard.id + this.constructor.name + this.name;
		this.element.className += " " + this.whiteboard.id + this.constructor.name;
		this.element.className += " " + this.constructor.name;

		this.xPosition = this.position.replace(/^\D+/g, '');
		this.yPosition = this.position.replace(/\d+$/, '');

		this.element.src = "./static/svg/" + this.constructor.name.toLowerCase() + ".svg";
		this.element.style.position = "absolute";
		this.element.style.width = "60px";
		this.element.style.height = "60px";
	}

	display() {
		this.whiteboard.space.cells[this.position].element.appendChild(this.element);
	}

	orientate()
	{
	}

	getOffset()
	{
		var offset = {
			left: this.element.offsetLeft,
			top: this.element.offsetTop
		}

		return offset;
	}

}