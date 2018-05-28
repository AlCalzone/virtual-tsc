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
function endsWith(str, match) {
    return (str.length >= match.length &&
        str.substr(-match.length) === match);
}
exports.endsWith = endsWith;
function resolveTypings(typings) {
    if (!startsWith(typings, "@types") || nodePath.isAbsolute(typings)) {
        // this is an absolute path
        typings = typings.substr(typings.indexOf("@types"));
    }
    logger_1.log("resolveTypings(" + typings + ")", "debug");
    if (!endsWith(typings, ".d.ts")) {
        typings = nodePath.join(typings, "index.d.ts");
    }
    try {
        var ret = require.resolve(typings);
        logger_1.log(" => " + ret, "debug");
        return ret;
    }
    catch (e) {
        logger_1.log(" => no success: " + e, "debug");
        return null;
    }
}
exports.resolveTypings = resolveTypings;
function resolveLib(libFile) {
    logger_1.log("resolving lib file " + libFile, "debug");
    var libPath = require.resolve("typescript/lib/" + libFile);
    logger_1.log("libPath = " + libPath, "debug");
    if (ts.sys.fileExists(libPath))
        return libPath;
}
exports.resolveLib = resolveLib;
