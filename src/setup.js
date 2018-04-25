const Player = require("./player.js");
const Ball = require("./ball.js");

module.exports = class Setup {

	constructor(setupDefinition, whiteboard) {
		self = this;
		this.whiteboard = whiteboard;
		this.definition = setupDefinition;
		this.objectDefinitions = getObjectDefinitions(this.definition);

		this.objects = {};
		this.actions = {};

		this.objectDefinitions.forEach(function (objectDefinition) {
			var utmlObject = invokeObject(objectDefinition);
			self.objects[utmlObject.name] = utmlObject;
		});

		//Wenn sich 2 Objekte auf einem Feld befinden, werden die "meets"-Methoden der beiden Objekte aufgerufen
		for (var key in self.objects) {
			var utmlObject = self.objects[key];
			for (var otherKey in self.objects) {
				var otherUtmlObject = self.objects[otherKey];
				if (utmlObject.position === otherUtmlObject.position && key !== otherKey) {
					var action = utmlObject.meets(otherUtmlObject);
					if (typeof action === 'object') {
						self.actions[action.id] = action;
					}
				}
			}
		}

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

	display(callback) {
		for (var key in this.objects) {
			this.objects[key].display();
		}
		callback();
	}

	orientateObjects() {
		for (var key in this.objects) {
			this.objects[key].orientate();
		}
	}
}