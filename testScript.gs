// This file is a test Galaxy Sharp file.

some_global = 0

Trigger onChatMessage(c_playerAny, "-hello", false) {
    bool actions(Player player, string message) {
        if (player.getAlliance(c_allianceIdPassive, 0)) {
            print("Hello");
        }
    }
}