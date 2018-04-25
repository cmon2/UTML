const Cell  = require("./cell.js");
const provideCSSGridUtils  = require("./cssgridutils.js");

module.exports = class Space {
	
	constructor(spaceDefinition, whiteboard) {
		this.definition = spaceDefinition;
		this.whiteboard = whiteboard;
		this.element = document.createElement("div");
		this.element = provideCSSGridUtils(this.element);
		this.element.id = this.whiteboard.id + this.constructor.name;
		this.element.className += " " + this.whiteboard.id + this.constructor.name;
		this.element.className += " " + this.constructor.name;
		this.element.style.display = "grid";
		this.element.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
		this.element.style.gridTemplateRows = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
		this.element.style.width = "100%";
		this.element.style.height = "100%";
		
		this.cells = [];
		
		this.length = 9;
		this.width = 18;
		
		for(var i = 0; i < this.element.countRows(); i++)
		{
			for(var j = 1; j <= this.element.countColumns(); j++)
			{
				var cellID = String.fromCharCode(("a".charCodeAt(0) + i)) + j;
				var gridRows = (i + 1) + " / " + (i + 2);
				var gridColumns = j + " / " + (j + 1);
				var cell = new Cell(cellID, gridRows, gridColumns, this.whiteboard);
				this.cells[cellID] = cell;
			}
		}
		
		console.log(this);
	}
	
	display(container)
	{
		//determins if space is limited by containers width or height
		if(container.offsetHeight / container.offsetWidth > this.length / this.width)
		{
			this.element.style.width = "" + container.offsetWidth  + "px";
			this.element.style.height = "" + container.offsetWidth * ( this.length / this.width )  + "px";
		}
		else
		{
			this.element.style.width = "" + container.offsetHeight * ( this.width / this.length ) + "px";
			this.element.style.height = "" + container.offsetHeight + "px";
		}
		
		container.appendChild(this.element);
		
		for (var cell in this.cells) {
			this.cells[cell].display();
		}
	}
   
   attach(utmlObject)
   {
	   this.element.appendChild(utmlObject.element);
   }
}