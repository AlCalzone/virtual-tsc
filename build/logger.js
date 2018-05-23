"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var _debug = debugPackage("virtual-tsc");
function defaultLogger(message, severity) {
    if (severity === void 0) { severity = "info"; }
    var prefix = "";
    if (severity !== "info") {
        prefix = "[" + severity.toUpperCase() + "] ";
    }
    _debug("" + prefix + message);
}
var customLogger;
function setCustomLogger(logger) {
    customLogger = logger;
}
exports.setCustomLogger = setCustomLogger;
function log(message, severity) {
    if (severity === void 0) { severity = "info"; }
    (customLogger || defaultLogger)(message, severity);
}
exports.log = log;
