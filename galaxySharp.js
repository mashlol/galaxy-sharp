var uniqueIndex = 0;
var getUniqueVariableName = function() {
    return "x_" + (uniqueIndex++);
};

var Trigger = {
    on: function() {
        if (arguments[0] == "chatMessage") {
            var name = getUniqueVariableName();
            this.triggerNames.push(name);
            console.log("trigger " + name + "_trigger" + ";");
            console.log("bool " + name + "_trigger_Func(bool testConds, bool runActions) {");
            var player = new Player("EventPlayer()");
            var message = new GalaxyObject("string", "EventChatMessage(false)");
            arguments[2](player, message);
            console.log("return true;");
            console.log("}");

            console.log("void " + name + "_trigger_Init() {");
            console.log(name + "_trigger = TriggerCreate(\"" + name + "_trigger_Func\");");
            console.log("TriggerAddEventChatMessage(" + name + "_trigger, c_playerAny, \"" + arguments[1] + "\", false);");
            console.log("}");
        }
    },
    triggerNames: []
};

var GalaxyObject = function(type, value) {
    this.name = getUniqueVariableName();
    this.type = type;
    console.log(type + " " + this.name + " = " + value + ";");
};

var Player = function(value) {
    this.intObject = new GalaxyObject("int", value);
};

Player.prototype.getName = function() {
    return new GalaxyObject("text", "PlayerName(" + this.intObject.name + ")");
};

var print = function(textObject) {
    console.log("UIDisplayMessage(PlayerGroupAll(), c_messageAreaSubtitle, " + textObject.name + ");");
};

var start = function() {
    console.log("include \"TriggerLibs/NativeLib\"");
};

var end = function() {
    console.log("void InitMap() {");
    console.log("libNtve_InitLib();");
    for (var x in Trigger.triggerNames) {
        console.log(Trigger.triggerNames[x] + "_trigger_Init();");
    }
    console.log("}");
};

module.exports = {
	Trigger: Trigger,
    Player: Player,
    print: print,
    start: start,
    end: end
}