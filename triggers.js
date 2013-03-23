module.exports = {
	onChatMessage: {
		argNum: 3,
		params: ["Player", "string"],
		prepend: "int $0 = EventPlayer(); string $1 = EventChatMessage(false);",
		triggerMethod: "TriggerAddEventChatMessage"
	},
	onMapInit: {
		argNum: 0,
		params: [],
		prepend: "",
		triggerMethod: "TriggerAddEventMapInit"
	}
}