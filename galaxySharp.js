var TRIGGERS = require("./triggers");
var FUNCTIONS_TO_TYPES = require("./functionsToTypes");
var Constants = require("./constants");

var G = {};

var outputGalaxy = function() {
    console.log.apply(this, arguments);
};

var uniqueIndex = 0;
var getUniqueVariableName = function() {
    return "x_" + (uniqueIndex++);
};

var override = function(defaults, params) {
    var result = {};
    for (var x in defaults) {
        if (params[x]) {
            result[x] = params[x];
        } else {
            result[x] = defaults[x];
        }
    }
    return result;
};

var Trigger = {
    on: function(triggerName, params, callback) {
        for (var x in TRIGGERS) {
            var TRIGGER = TRIGGERS[x];
            if (x == triggerName) {
                var name = getUniqueVariableName();
                this.triggerNames.push(name);
                outputGalaxy("trigger " + name + "_trigger" + ";");
                outputGalaxy("bool " + name + "_trigger_Func(bool testConds, bool runActions) {");
                var args = [];
                for (var x in TRIGGER.args) {
                    var argVal = TRIGGER.args[x];
                    args.push(new G[FUNCTIONS_TO_TYPES[argVal]](argVal));
                }
                callback.apply(null, args);
                outputGalaxy("return true;");
                outputGalaxy("}");

                outputGalaxy("void " + name + "_trigger_Init() {");
                outputGalaxy(name + "_trigger = TriggerCreate(\"" + name + "_trigger_Func\");");

                params = override(TRIGGER.defaultParams, params);

                var paramString = "";
                for (var x=0; x<TRIGGER.paramsOrder.length-1; x++) {
                    var param = TRIGGER.paramsOrder[x];
                    if (typeof params[param] == "string") {
                        paramString += "\"" + params[param] + "\", ";
                    } else {
                        paramString += params[param] + ", ";
                    }
                }
                paramString += params[TRIGGER.paramsOrder[TRIGGER.paramsOrder.length-1]]
                outputGalaxy(TRIGGER.name + "(" + name + "_trigger, " + paramString + ");");
                outputGalaxy("}");
                return;
            }
        }
    },
    triggerNames: []
};

var GalaxyObject = function(type, value) {
    this.name = getUniqueVariableName();
    this.type = type;
    outputGalaxy(type + " " + this.name + " = " + value + ";");
};

GalaxyObject.prototype._getGalaxyName = function() {
    return this.name;
};

GalaxyObject.prototype._getGalaxyType = function() {
    return this.type;
};

var Player = function(value) {
    this.intObject = new GalaxyObject("int", value);
};

Player.prototype.getName = function() {
    return new GalaxyObject("text", "PlayerName(" + this.intObject.name + ")");
};

Player.prototype._getGalaxyName = function() {
    return this.intObject._getGalaxyName();
};

Player.prototype._getGalaxyType = function() {
    return this.intObject._getGalaxyType();
}

var _String = function(value) {
    this.stringObject = new GalaxyObject("string", value);
};

_String.prototype._getGalaxyName = function() {
    return this.stringObject._getGalaxyName();
};

_String.prototype._getGalaxyType = function() {
    return this.stringObject._getGalaxyType();
}

var print = function(textObject) {
    if (textObject._getGalaxyType() == "text") {
        outputGalaxy("UIDisplayMessage(PlayerGroupAll(), c_messageAreaSubtitle, " + textObject._getGalaxyName() + ");");
    } else if (textObject._getGalaxyType() == "string") {
        outputGalaxy("UIDisplayMessage(PlayerGroupAll(), c_messageAreaSubtitle, StringToText(" + textObject._getGalaxyName() + "));");
    }
};

var start = function() {
    outputGalaxy("include \"TriggerLibs/NativeLib\"");
};

var end = function() {
    outputGalaxy("void InitMap() {");
    outputGalaxy("libNtve_InitLib();");
    for (var x in Trigger.triggerNames) {
        outputGalaxy(Trigger.triggerNames[x] + "_trigger_Init();");
    }
    outputGalaxy("}");
};

G.Trigger = Trigger;
G.Player = Player;
G.GalaxyObject = GalaxyObject;
G.String = _String;
G.print = print;
G.start = start;
G.end = end;
G.c = Constants;
G.Constants = Constants;
G.C = Constants;

module.exports = G;
