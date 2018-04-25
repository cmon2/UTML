const Setup = require("./src/setup.js");
const Flow = require("./src/flow.js");
const Space = require("./src/space.js");

module.exports = class Whiteboard {

	constructor(setupDefinition, flowDefinition, spaceDefinition) {
		this.id = getUniqueId();
		this.assets = {};

		this.dummy = document.createElement('div');

		this.GreenSock = require('gsap');
		this.Snap = require(`snapsvg-cjs`);

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

		//Referenz von self und this ändern sich komischerweise ständig!
		var whiteboard = this;

		whiteboard.space.display(container);
		console.log(whiteboard.setup.actions);

		//Im ersten Schritt müssen die Assets für das Setup geladen werden
		whiteboard.provideAssets(whiteboard.setup.objects, function (assets) {
			whiteboard.assets = assets;
			console.log(assets);

			//Dann kann erstmal das Setup angezeigt werden
			whiteboard.setup.display(function () {

				//Wenn alles angezeigt ist können die Objekte provisorisch ausgerichtet werden
				whiteboard.setup.orientateObjects();

				//Jetzt werden im zweiten Schritt die Assets für Aktionen im Setup geladen
				whiteboard.provideAssets(whiteboard.setup.actions, function (assets) {
					whiteboard.assets = Object.assign(whiteboard.assets, assets);
					for (var key in whiteboard.setup.actions) {
						whiteboard.setup.actions[key].execute();
					}

					//Und im dritten Schritt werden die Assets für den Flow geladen und ausgeführt
					var actions = [];
					whiteboard.flow.actions.forEach(function (actionArray) {
						actionArray.forEach(function (action) {
							actions.push(action);
						});
					});

					whiteboard.provideAssets(actions, function (assets) {
						whiteboard.assets = Object.assign(whiteboard.assets, assets);
						setTimeout(function () {
							whiteboard.flow.prepare(function () {
								setTimeout(function () {
									whiteboard.flow.play();
								}, 2000);
							});
						}, 2000);

					});
				});
				console.log("----------- board finished -------------");
			});
		});
	}

	provideAssets(anythings, isReady) {
		var assets = {};
		var dublicates = 0;
		var i = 0;

		for (var key in anythings) {
			var anything = anythings[key];
			var something = anything.constructor.name.toLowerCase();

			if (!assets.hasOwnProperty(something)) {
				if (!document.querySelector("#whiteboard" + something)) {
					assets[something] = {};
					assets[something].element = document.createElement('template');
					assets[something].element.id = "whiteboard" + something;
					assets[something].name = something;
					assets[something].loaded = false;

					assets[something].xhr = new XMLHttpRequest();
					assets[something].xhr.open("GET", "./static/svg/" + anything.constructor.name.toLowerCase() + ".svg", true);
					assets[something].xhr.send();
					assets[something].xhr.onreadystatechange = function () {
						if (this.readyState === 4) {
							i++;
							var thing = this.responseURL.match(new RegExp("/svg/" + "(.*)" + ".svg"))[1];
							if (!document.querySelector("#whiteboard" + thing)) {
								document.getElementsByTagName("body")[0].appendChild(assets[thing].element);
								assets[thing].element.innerHTML = this.responseText;
								assets[thing].loaded = true;
							}
							else {
								assets[thing].element = document.querySelector("#whiteboard" + thing);
								assets[thing].loaded = true;
							}
							if (i === Object.keys(anythings).length) {
								isReady(assets);
							}
						}
					};
				}
				else {
					i++;
					assets[something] = {};
					assets[something].element = document.querySelector("#whiteboard" + something);
					assets[something].name = something;
					assets[something].loaded = true;
				}
			} else {
				i++;
				dublicates++;
			}

		}

		var allLoaded = true;
		for (var asset in assets) {
			if (!assets[asset].loaded) {
				allLoaded = false;
			}
		}
		if (allLoaded) {
			isReady(assets);
		}
	}
}