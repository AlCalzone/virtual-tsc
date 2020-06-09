"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.setCustomLogger = void 0;
// tslint:disable-next-line:no-var-requires
var colors = require("colors/safe");
var debug = require("debug");
var defaultNamespace = "virtual-tsc";
var customLogger;
function setCustomLogger(logger) {
    customLogger = logger;
}
exports.setCustomLogger = setCustomLogger;
colors.setTheme({
    silly: "white",
    debug: "white",
    error: "red",
    warn: "yellow",
    info: "blue",
});
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (customLogger === false)
        return;
    // we only accept strings
    if (!args || !args.length || !args.every(function (arg) { return typeof arg === "string"; })) {
        throw new Error("Invalid arguments passed to log()");
    }
    var namespace = "";
    var message;
    var severity;
    if (args.length === 2) {
        (message = args[0], severity = args[1]);
    }
    else if (args.length === 3) {
        (namespace = args[0], message = args[1], severity = args[2]);
        // add the namespace separator to append the namespace to the default one
        if (typeof namespace === "string" && namespace !== "")
            namespace = ":" + namespace;
    }
    function defaultLogger() {
        var prefix = "";
        if (severity !== "info") {
            prefix = "[" + severity.toUpperCase() + "] ";
        }
        debug(defaultNamespace + namespace)("" + prefix + colors[severity](message));
    }
    (customLogger || defaultLogger)(message, severity);
}
exports.log = log;
