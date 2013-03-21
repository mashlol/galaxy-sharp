// This file is a test Galaxy Sharp file.

int gv_some_global = 0;

Trigger onChatMessage(c_playerAny, "-hello", false) {
    function actions(Player player, string message) {
        print("Hello");
    }
}