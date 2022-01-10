"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.setCustomLogger = void 0;
// tslint:disable-next-line:no-var-requires
var debug_1 = __importDefault(require("debug"));
var picocolors_1 = __importDefault(require("picocolors"));
var defaultNamespace = "virtual-tsc";
var customLogger;
function setCustomLogger(logger) {
    customLogger = logger;
}
exports.setCustomLogger = setCustomLogger;
var formatters = {
    info: function (message) { return picocolors_1.default.blue(message); },
    warn: function (message) { return picocolors_1.default.yellow(message); },
    debug: function (message) { return picocolors_1.default.white(message); },
    error: function (message) { return picocolors_1.default.red(message); },
    silly: function (message) { return picocolors_1.default.white(message); },
};
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
        debug_1.default(defaultNamespace + namespace)("" + prefix + formatters[severity](message));
    }
    (customLogger || defaultLogger)(message, severity);
}
exports.log = log;
