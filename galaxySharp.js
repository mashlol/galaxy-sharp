triggers = require("./triggers.js");
pairs = require("./pairs.js");
_ = require("underscore");
compiledCode = [];

var bracketPairs = {}
var bracePairs = {}

var numTriggers = 0;

exports.compile = function(code) {
    bracketPairs = pairs.find("(", ")", code, 0, false);
    bracePairs = pairs.find("{", "}", code, 0, false);

    code = removeComments(code);

    includeAndInitLibs();

    findTriggers(code);
    createMapInit();
    return compiledCode.join("\n");
}

removeComments = function(code) {
    // Remove all the comments from the code, so we don't compile anything for them.

    return code;
}

findTriggers = function(code) {
    var lastFoundIndex = 0;
    while (true) {
        // Find any place the keyword "Trigger" occurs and store the index.
        var curIndex = code.indexOf("Trigger", lastFoundIndex);
        if (curIndex == -1) {
            break;
        }

        // Find the next "(" which indicates the trigger function name is over.
        var nextBracket = code.indexOf("(", curIndex + 1);
        if (nextBracket == -1) {
            throw new Error("Missing bracket.");
        }

        var triggerName = code.substring(curIndex + 8, nextBracket);
        var trigger = triggers[triggerName];
        if (!trigger) {
            throw new Error("Trigger type does not exist: " + triggerName + ".");
        }

        // Check to make sure it takes the correct number of parameters.
        // TODO: Do a better check, commas in strings shouldn't count.
        var closeBracket = bracketPairs[nextBracket];

        var args = code.substring(nextBracket+1, closeBracket);
        var numArgs = args.split(",").length;
        if (numArgs != trigger.argNum) {
            throw new Error("Invalid number of args for trigger type " + triggerName + ". Expected: " + trigger.argNum + ", got: " + numArgs);
        }

        // Find the next "function" keyword.
        var functionIndex = code.indexOf("function actions", closeBracket + 1);

        // Find the expected params and their names
        var nextBracket = code.indexOf("(", functionIndex);
        var closeBracket = bracketPairs[nextBracket];
        var params = code.substring(nextBracket+1, closeBracket).split(",");
        params = _.map(params, function(param) { 
            var split = param.trim().split(" ");
            return {
                type: split[0],
                name: split[1]
            }
        });

        if (params.length != trigger.params.length) {
            throw new Error("Invalid number of params for action on trigger of type " + triggerName + ". Expected: " + trigger.params.length + ", got: " + params.length);
        }

        // Find the next brace and it's matching pair, inside of here is regular Galaxy for now, store it and spit it out later.
        // TODO: Inside here will potentially be Galaxy Sharp code, compile it as such.
        var nextBrace = code.indexOf("{", closeBracket);
        var closeBrace = bracePairs[nextBrace];

        var rawCode = code.substring(nextBrace+1, closeBrace);

        var prependedCode = trigger.prepend;
        for (var x = 0; x < trigger.params.length; x++) {
            // console.log ("replacing " + "%" + x + " with " + params[x].name);
            prependedCode = prependedCode.replace("$" + x, params[x].name);
        }

        compiledCode.push("trigger someTrigger;");
        compiledCode.push("bool someTrigger_Func(bool testConds, bool runActions) {");
        compiledCode.push("    " + prependedCode);
        compiledCode.push(rawCode);
        compiledCode.push("}");

        compiledCode.push("\n");
        compiledCode.push("void someTrigger_Init() {");
        compiledCode.push("    someTrigger = TriggerCreate(\"someTrigger_Func\");");
        compiledCode.push("    " + trigger.triggerMethod + "(" + args + ");");
        compiledCode.push("}");

        numTriggers++;

        lastFoundIndex = curIndex + 1;
    }
}

createMapInit = function() {
    compiledCode.push("\n");
    compiledCode.push("void InitMap() {");
    compiledCode.push("    libNtve_InitLib();");
    compiledCode.push("    someTrigger_Init();");
    compiledCode.push("}");
}

includeAndInitLibs = function() {
    compiledCode.push("include \"TriggerLibs/NativeLib\"");
    compiledCode.push("");
}