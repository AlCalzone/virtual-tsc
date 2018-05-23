"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodePath = require("path");
var ts = require("typescript");
var logger_1 = require("./logger");
function repeatString(str, count) {
    // newer node versions
    if (str.repeat != null)
        return str.repeat(count);
    // older node versions
    var ret = "";
    for (var i = 0; i < count; i++)
        ret += str;
    return ret;
}
exports.repeatString = repeatString;
function startsWith(str, match) {
    return (str.length >= match.length &&
        str.substr(0, match.length) === match);
}
exports.startsWith = startsWith;
function resolveTypings(typings) {
    if (!startsWith(typings, "@types") || nodePath.isAbsolute(typings)) {
        // this is an absolute path
        typings = typings.substr(typings.indexOf("@types"));
    }
    logger_1.log("resolveTypings(" + typings + ")", "debug");
    var pathParts = __dirname.split(nodePath.sep);
    // start with / on linux
    if (startsWith(__dirname, nodePath.sep))
        pathParts.unshift(nodePath.sep);
    // try all dirs up to the root
    for (var i = 0; i < pathParts.length; i++) {
        var path = nodePath.join.apply(nodePath, (pathParts.slice(0, pathParts.length - i)).concat(["node_modules", typings]));
        logger_1.log(" => trying " + path, "debug");
        if (ts.sys.fileExists(path)) {
            logger_1.log(" => success", "debug");
            return path;
        }
    }
    logger_1.log(" => no success", "debug");
    return null;
}
exports.resolveTypings = resolveTypings;
function resolveLib(libFile) {
    logger_1.log("resolving lib file " + libFile, "debug");
    // resolving lib file
    var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), libFile);
    logger_1.log("libPath = " + libPath, "debug");
    if (ts.sys.fileExists(libPath))
        return libPath;
}
exports.resolveLib = resolveLib;
