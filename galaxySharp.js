triggers = require("./triggers.js");
compiledCode = "";

exports.compile = function(code) {
    code = removeComments(code);
    findTriggers(code);
    return compiledCode;
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
            break;
        }

        var triggerName = code.substring(curIndex + 8, nextBracket);
        var trigger = triggers[triggerName];
        if (!trigger) {
            throw new Error("Trigger type does not exist: " + triggerName + ".");
            break;
        }

        // Check to make sure it takes the correct number of parameters.
        // TODO: Do a better check, commas in strings shouldn't count.
        var closeBracket = code.indexOf(")", nextBracket + 1);
        if (closeBracket == -1) {
            throw new Error("ERROR: Missing bracket.");
            break;
        }

        var args = code.substring(nextBracket+1, closeBracket);
        var numArgs = args.split(",").length;
        if (numArgs != trigger.argNum) {
            throw new Error("Invalid number of args for trigger type " + triggerName + ". Expected: " + trigger.argNum + ", got: " + numArgs);
        }

        compiledCode += "Trigger with name " + triggerName + " found.\n";

        lastFoundIndex = curIndex + 1;
    }
}