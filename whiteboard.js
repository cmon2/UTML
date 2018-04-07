import Setup from "./src/setup.js";
import Flow from "./src/flow.js";
import Space from "./src/space.js";

module.exports = class Whiteboard {

	constructor(setupDefinition, flowDefinition, spaceDefinition) {
		this.id = getUniqueId();

		this.space = new Space(spaceDefinition, this);
		this.setup = new Setup(setupDefinition, this);
		this.flow = new Flow(flowDefinition, this);

		function getUniqueId() {

			var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
			return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
				return (Math.random() * 16 | 0).toString(16);
			}).toLowerCase();
		}
	}

	display(container) {
		this.space.display(container);
		this.setup.display();
		this.setup.orientateObjects();
	}
}