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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0RvbWluaWMvRG9jdW1lbnRzL1Zpc3VhbCBTdHVkaW8gMjAxNy9SZXBvc2l0b3JpZXMvdmlydHVhbC10c2Mvc3JjLyIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBQ3RDLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUkzQyx1QkFBdUIsT0FBZSxFQUFFLFFBQWdFO0lBQWhFLHlCQUFBLEVBQUEsaUJBQWdFO0lBQ3ZHLElBQUksTUFBTSxHQUFXLEVBQUUsQ0FBQztJQUN4QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLEdBQUcsTUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLE9BQUksQ0FBQztJQUN6QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUcsTUFBTSxHQUFHLE9BQVMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFDRCxJQUFJLFlBQTRCLENBQUM7QUFDakMseUJBQWdDLE1BQXNCO0lBQ3JELFlBQVksR0FBRyxNQUFNLENBQUM7QUFDdkIsQ0FBQztBQUZELDBDQUVDO0FBRUQsYUFBb0IsT0FBZSxFQUFFLFFBQWdFO0lBQWhFLHlCQUFBLEVBQUEsaUJBQWdFO0lBQ3BHLENBQUMsWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsa0JBRUMifQ==