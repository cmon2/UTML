module.exports = class Cell {

	constructor(cellID, gridRows, gridColumns, whiteboard) {
		this.whiteboard = whiteboard;
		this.cellID = cellID;

		this.element = document.createElement("div");
		this.element.id = this.whiteboard.id + this.constructor.name + this.cellID;
		this.element.style.width = "100%";
		this.element.style.height = "100%";
		this.element.style.gridRows = gridRows;
		this.element.style.gridColumns = gridColumns;
		this.element.style.display = "flex";
		this.element.style.justifyContent = "center";
		this.element.style.alignItems = "center";
		//this.element.style.border = "1px solid black";
	}

	display() {
		this.whiteboard.space.element.appendChild(this.element);
	}

	getOffset() {
		var offset = {
			left: this.element.offsetLeft + this.element.offsetWidth / 2,
			top: this.element.offsetTop + this.element.offsetHeight / 2
		}

		return offset;
	}
}