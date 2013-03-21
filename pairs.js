exports.find = function(openChar, closeChar, string, startLocation, foundOpenChar) {
    var hash = {};
    findPairsRecurse = function(openChar, closeChar, string, startLocation, foundOpenChar) {
        var topLevel = !foundOpenChar;
        for (var x = startLocation; x < string.length; x++) {

            // We found an open character (Open bracket / open brace / open quote / other)
            if (string.charAt(x) == openChar && !foundOpenChar) {
                foundOpenChar = x;

            // We had previously found an open brace without finding it's closing pair.  Need to now search for the new pair recursively.
            } else if (string.charAt(x) == openChar && foundOpenChar) {
                x = findPairsRecurse(openChar, closeChar, string, x + 1, true) + 1;
            }

            // We found a close char, and we were searching for one
            if (string.charAt(x) == closeChar && foundOpenChar) {
                if (topLevel) {
                    // If we are at the top level of recursion, store our pairing in the hash, but keep searching in this level!
                    hash[foundOpenChar] = x
                    hash[x] = foundOpenChar
                    foundOpenChar = false;
                } else {
                    // If we are not in the top level of recursion, store our pairing in the hash, and jump to the next level up!
                    hash[startLocation-1] = x;
                    hash[x] = startLocation-1;
                    return x;
                }

            // We found a close char, but we weren't looking for one! Error out!
            } else if (string.charAt(x) == closeChar && !foundOpenChar) {
                throw new Error("Found a " + closeChar + " without a matching " + openChar + ".");
            }

            // We hit the end while still looking for a close char!  Error out!
            if (x == string.length - 1 && foundOpenChar) {
                throw new Error("Found a " + openChar + " without a matching " + closeChar = ".");
            }
        }
    }
    
    findPairsRecurse(openChar, closeChar, string, startLocation, foundOpenChar);

    return hash;
}