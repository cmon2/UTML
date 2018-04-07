import Player from "./player.js";
import Ball from "./ball.js";

module.exports = class Setup {

	constructor(setupDefinition, whiteboard) {
		self = this;
		this.whiteboard = whiteboard;
		this.definition = setupDefinition;
		this.objectDefinitions = getObjectDefinitions(setupDefinition);

		this.objects = [];

		this.objectDefinitions.forEach(function (objectDefinition) {
			var utmlObject = invokeObject(objectDefinition);
			self.objects.push(utmlObject);
		});

		function getObjectDefinitions(setupDefinition) {
			var objectDefinitionStrings = setupDefinition.split(/\r?\n/);
			var objectDefinitions = [];

			objectDefinitionStrings.forEach(function (objectDefinitionString) {
				objectDefinitions.push(objectDefinitionString.split(" "));
			});

			return objectDefinitions;
		}

		function invokeObject(objectDefinition) {
			var utmlType = objectDefinition[0];
			objectDefinition.shift();
			switch (utmlType) {
				case 'player':
					return new Player(objectDefinition, whiteboard);
				case 'ball':
					return new Ball(objectDefinition, whiteboard);
				default:
					console.error("Did not find an utmlObject " + utmlType + " either the UTML is corrupt or something is wrong with the class.");
			}
		}

		console.log(this);
	}

	display() {
		this.objects.forEach(function (utmlObject) {
			utmlObject.display();
		});
	}

	orientateObjects()
	{
		this.objects.forEach(function (utmlObject) {
			utmlObject.orientate();
		});
	}
}