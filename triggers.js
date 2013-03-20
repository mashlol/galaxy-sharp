module.exports = {
	onChatMessage: {
		argNum: 3,
		params: ["player", "string"],
		prepend: "Player $0 = EventPlayer(); string $1 = EventChatMessage(false);"
	}
}