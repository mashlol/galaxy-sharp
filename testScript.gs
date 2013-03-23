// This file is a test Galaxy Sharp file
int gv_some_global = 0;

void default_galaxy_method(int arg) {
    UIDisplayMessage(PlayerGroupAll(), c_messageAreaDebug, "Default Galaxy works too!");
}

Trigger onChatMessage(c_playerAny, "-hello", false) {
    function actions(Player player, string message) {
        print("Hello");
    }
}

Trigger onMapInit() {
    function actions() {
        // You can call default methods as well!
        default_galaxy_method();
    }
}