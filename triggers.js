var G = require("./galaxySharp");
var Constants = require("./constants");

module.exports = {
	chatMessage: {
		name: "TriggerAddEventChatMessage",
		defaultParams: {
			player: Constants.ANY_PLAYER,
			message: "",
			exact: true
		},
		paramsOrder: ["player", "message", "exact"],
		args: ["EventPlayer()", "EventChatMessage(false)"]
	},
	mapInit: {
		name: "TriggerAddEventMapInit"
	},
	keyDown: {
		name: "TriggerAddEventKeyPressed",
		defaultParams: {
			player: Constants.ANY_PLAYER,
			key: Constants.W_KEY,
			down: true,
			shift: Constants.IGNORE,
			control: Constants.IGNORE,
			alt: Constants.IGNORE
		},
		paramsOrder: ["player", "key", "down", "shift", "control", "alt"]
		// argBuilder: function() {
		// 	var player = new G.Player("EventPlayer()");
  //           var key = new G.GalaxyObject("int", "EventKeyPressed()");
  //           var alt = new G.GalaxyObject("bool", "EventKeyAlt()");
  //           var shift = new G.GalaxyObject("bool", "EventKeyShift()");
  //           var control = new G.GalaxyObject("bool", "EventKeyControl()");
  //           return [player, key, alt, shift, control];
		// }
	},
	keyUp: {
		name: "TriggerAddEventKeyPressed",
		defaultParams: {
			player: Constants.ANY_PLAYER,
			key: Constants.W_KEY,
			down: false,
			shift: Constants.IGNORE,
			control: Constants.IGNORE,
			alt: Constants.IGNORE
		},
		paramsOrder: ["player", "key", "down", "shift", "control", "alt"]
	}
}
