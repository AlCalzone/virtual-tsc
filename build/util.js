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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFDakMsK0JBQWlDO0FBQ2pDLG1DQUErQjtBQVcvQixzQkFBNkIsR0FBVyxFQUFFLEtBQWE7SUFDdEQsc0JBQXNCO0lBQ3RCLEVBQUUsQ0FBQyxDQUFFLEdBQVcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQUMsTUFBTSxDQUFFLEdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkUsc0JBQXNCO0lBQ3RCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRTtRQUFFLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNaLENBQUM7QUFQRCxvQ0FPQztBQVFELG9CQUEyQixHQUFXLEVBQUUsS0FBYTtJQUNwRCxNQUFNLENBQUMsQ0FDTixHQUFHLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNO1FBQzFCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLENBQ3JDLENBQUM7QUFDSCxDQUFDO0FBTEQsZ0NBS0M7QUFFRCx3QkFBK0IsT0FBZTtJQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsMkJBQTJCO1FBQzNCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsWUFBRyxDQUFDLG9CQUFrQixPQUFPLE1BQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzQyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RSw4QkFBOEI7SUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0MsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksT0FBYixRQUFRLEVBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQUUsY0FBYyxFQUFFLE9BQU8sR0FBQyxDQUFDO1FBQ25HLFlBQUcsQ0FBQyxnQkFBYyxJQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFlBQUcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNiLENBQUM7SUFDRixDQUFDO0lBQ0QsWUFBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDO0FBcEJELHdDQW9CQztBQUVELG9CQUEyQixPQUFlO0lBQ3pDLFlBQUcsQ0FBQyx3QkFBc0IsT0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLHFCQUFxQjtJQUNyQixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hGLFlBQUcsQ0FBQyxlQUFhLE9BQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNyQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDaEQsQ0FBQztBQU5ELGdDQU1DIn0=