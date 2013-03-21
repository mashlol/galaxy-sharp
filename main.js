#!/usr/bin/env node
var gs = require("./galaxySharp.js");
var fs = require("fs");
var args = require("optimist").argv._;

var code;
fs.readFile(args[0], {encoding: "utf8"}, function (err, data) {
    if (err) {
        throw err;
    }
    try {
        console.log(gs.compile(data));
    } catch (e) {
        console.log ("Compilation Error: " + e.message);
    }
});