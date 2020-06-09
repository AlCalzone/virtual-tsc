"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumLibFiles = exports.resolveLib = exports.resolveTypings = exports.getTypeScript = exports.getTypeScriptResolveOptions = exports.setTypeScriptResolveOptions = exports.endsWith = exports.startsWith = exports.repeatString = void 0;
var nodeFS = require("fs");
var nodePath = require("path");
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
var tsResolveOptions;
function setTypeScriptResolveOptions(options) {
    tsResolveOptions = options;
}
exports.setTypeScriptResolveOptions = setTypeScriptResolveOptions;
function getTypeScriptResolveOptions() {
    return tsResolveOptions;
}
exports.getTypeScriptResolveOptions = getTypeScriptResolveOptions;
function getTypeScript() {
    return require(require.resolve("typescript", getTypeScriptResolveOptions()));
}
exports.getTypeScript = getTypeScript;
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
        var ret = require.resolve(typings, getTypeScriptResolveOptions());
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
    var libPath = require.resolve("typescript/lib/" + libFile, getTypeScriptResolveOptions());
    var ts = getTypeScript();
    logger_1.log("libPath = " + libPath, "debug");
    if (ts.sys.fileExists(libPath))
        return libPath;
}
exports.resolveLib = resolveLib;
function enumLibFiles() {
    logger_1.log("util", "enumLibFiles() =>", "debug");
    var tsPath = require.resolve("typescript", getTypeScriptResolveOptions());
    var libFiles = nodeFS.readdirSync(nodePath.dirname(tsPath))
        .filter(function (name) { return /^lib(\.[\w\d]+)*?\.d\.ts$/.test(name); })
        .map(function (file) { return nodePath.join(nodePath.dirname(tsPath), file); });
    for (var _i = 0, libFiles_1 = libFiles; _i < libFiles_1.length; _i++) {
        var file = libFiles_1[_i];
        logger_1.log("util", "  " + file, "debug");
    }
    return libFiles;
}
exports.enumLibFiles = enumLibFiles;
