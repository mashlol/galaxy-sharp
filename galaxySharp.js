triggers = require("./triggers.js");
pairs = require("./pairs.js");
_ = require("underscore");


var compiledCode = [];

var bracketPairs = {};
var bracePairs = {};

var triggerLocations = [];

var numTriggers = 0;

exports.compile = function(code) {
    code = removeComments(code);

    bracketPairs = pairs.find("(", ")", code, 0, false);
    bracePairs = pairs.find("{", "}", code, 0, false);

    findTriggers(code);

    appendNonGSCode(code);

    createMapInit();
    return compiledCode.join("\n");
}

removeComments = function(code) {
    // Remove all the comments from the code, so we don't compile anything for them.
    // TODO: Don't remove comments when inside strings!
    var unCommentedCode = code;
    var lineEnd = 0;
    while (true) {
        var comment = code.indexOf("//", lineEnd);
        if (comment == -1) {
            break;
        }

        var lineEnd = code.indexOf("\n", comment+1);
        if (lineEnd == -1) {
            lineEnd = code.length;
        }

        unCommentedCode = unCommentedCode.replace(code.substring(comment, lineEnd+1), "");
    }

    return unCommentedCode;
}

findTriggers = function(code) {
    var lastFoundIndex = 0;
    while (true) {
        // Find any place the keyword "Trigger" occurs and store the index.
        var startIndex = code.indexOf("Trigger", lastFoundIndex);
        if (startIndex == -1) {
            break;
        }

        // Find the next "(" which indicates the trigger function name is over.
        var nextBracket = code.indexOf("(", startIndex + 1);
        if (nextBracket == -1) {
            throw new Error("Missing bracket.");
        }

        var triggerName = code.substring(startIndex + 8, nextBracket);
        var trigger = triggers[triggerName];
        if (!trigger) {
            throw new Error("Trigger type does not exist: " + triggerName + ".");
        }

        // Check to make sure it takes the correct number of parameters.
        // TODO: Do a better check, commas in strings shouldn't count.
        var closeBracket = bracketPairs[nextBracket];

        var args = code.substring(nextBracket+1, closeBracket);
        var numArgs = args.split(",").length;
        if (args.isEmpty()) { numArgs = 0; }
        if (numArgs != trigger.argNum) {
            throw new Error("Invalid number of args for trigger type " + triggerName + ". Expected: " + trigger.argNum + ", got: " + numArgs);
        }

        // Find the open brace for later use
        var triggerOpenBrace = code.indexOf("{", closeBracket + 1);

        // Find the next "function" keyword.
        var functionIndex = code.indexOf("function actions", closeBracket + 1);

        // Find the expected params and their names
        var nextBracket = code.indexOf("(", functionIndex);
        var closeBracket = bracketPairs[nextBracket];

        var paramString = code.substring(nextBracket+1, closeBracket);
        var params = paramString.split(",");
        params = _.map(params, function(param) { 
            var split = param.trim().split(" ");
            return {
                type: split[0],
                name: split[1]
            }
        });

        if (paramString.isEmpty()) { params = []; }

        if (params.length != trigger.params.length) {
            throw new Error("Invalid number of params for action on trigger of type " + triggerName + ". Expected: " + trigger.params.length + ", got: " + params.length);
        }

        // Find the next brace and it's matching pair, inside of here is regular Galaxy for now, store it and spit it out later.
        // TODO: Inside here will potentially be Galaxy Sharp code, compile it as such.
        var nextBrace = code.indexOf("{", closeBracket);
        var closeBrace = bracePairs[nextBrace];

        var rawCode = code.substring(nextBrace+1, closeBrace);

        // This prepended code is from the triggers.js file, designed to prepend code into a trigger of a specific type.  This helps create the parameters and such.
        var prependedCode = trigger.prepend;
        // Replace all the $0 - $9, etc with the parameter names chosen by the user
        for (var x = 0; x < trigger.params.length; x++) {
            prependedCode = prependedCode.replace("$" + x, params[x].name);
        }

        // Print out some compiled code!
        compiledCode.push("trigger " + numTriggers + "_trigger" + ";");
        compiledCode.push("bool " + numTriggers + "_trigger" + "_Func(bool testConds, bool runActions) {");
        if (!prependedCode.isEmpty()) { compiledCode.push("    " + prependedCode); }
        rawCode = _.map(_.compact(_.map(rawCode.split("\n"), function(line) { return line.trim(); })), function(line) { return "    " + line; }).join("\n");
        compiledCode.push(rawCode);
        compiledCode.push("}");

        compiledCode.push("");
        compiledCode.push("void " + numTriggers + "_trigger" + "_Init() {");
        compiledCode.push("    " + numTriggers + "_trigger" + " = TriggerCreate(\"" + numTriggers + "_trigger" + "_Func\");");
        compiledCode.push("    " + trigger.triggerMethod + "(" + numTriggers + "_trigger" + (!args.isEmpty() ? ", " : "") + args + ");");
        compiledCode.push("}");
        compiledCode.push("");
        compiledCode.push("");

        // Found a Galaxy Sharp trigger, increment this number so we can call the init method in the map init method.
        numTriggers++;

        // Store the start and end locations of this Galaxy Sharp trigger, so we can ignore it when we grab the default galaxy code.
        triggerLocations.push({
            start: startIndex,
            end: bracePairs[triggerOpenBrace]
        });

        // Keep searching for more triggers from the closing brace on
        lastFoundIndex = bracePairs[triggerOpenBrace] + 1;
    }
}


appendNonGSCode = function(code) {
    // Append the non Galaxy Sharp code at the top of the compiled file.
    var appendedCode = code;

    for (x in triggerLocations) {
        appendedCode = appendedCode.replace(code.substring(triggerLocations[x].start, triggerLocations[x].end+1), "");
    }

    compiledCode.unshift("// The below code has been compiled by Galaxy Sharp.");
    compiledCode.unshift("");
    compiledCode.unshift(appendedCode);
    compiledCode.unshift("// The following code has not been compiled by Galaxy Sharp.");
}

createMapInit = function() {
    // Include the native libs
    compiledCode.unshift("include \"TriggerLibs/NativeLib\"");

    // Include a map init method which will init the native libs as well as our Galaxy Sharp triggers.
    compiledCode.push("void InitMap() {");
    compiledCode.push("    libNtve_InitLib();");
    for (var x = 0; x < numTriggers; x++) {
        compiledCode.push("    " + x + "_trigger" + "_Init();");
    }
    compiledCode.push("}");
}

String.prototype.isEmpty = function() {
    if (!this.match(/\S/)) {
        return true;
    }
    return false;
}