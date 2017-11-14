"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debugPackage = require("debug");
var nodePath = require("path");
var ts = require("typescript");
var debug = debugPackage("virtual-tsc");
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
    debug("resolveTypings(" + typings + ")");
    var pathParts = __dirname.split(nodePath.sep);
    // start with / on linux
    if (startsWith(__dirname, nodePath.sep))
        pathParts.unshift(nodePath.sep);
    // try all dirs up to the root
    for (var i = 0; i < pathParts.length; i++) {
        var path = nodePath.join.apply(nodePath, (pathParts.slice(0, pathParts.length - i)).concat(["node_modules", typings]));
        debug(" => trying " + path);
        if (ts.sys.fileExists(path)) {
            debug(" => success");
            return path;
        }
    }
    debug(" => no success");
    return null;
}
exports.resolveTypings = resolveTypings;
function resolveLib(libFile) {
    debug("resolving lib file " + libFile);
    // resolving lib file
    var libPath = nodePath.join(nodePath.dirname(require.resolve("typescript")), libFile);
    debug("libPath = " + libPath);
    if (ts.sys.fileExists(libPath))
        return libPath;
}
exports.resolveLib = resolveLib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Eb21pbmljL0RvY3VtZW50cy9WaXN1YWwgU3R1ZGlvIDIwMTcvUmVwb3NpdG9yaWVzL3ZpcnR1YWwtdHNjL3NyYy8iLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBc0M7QUFDdEMsK0JBQWlDO0FBQ2pDLCtCQUFpQztBQUVqQyxJQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFXMUMsc0JBQTZCLEdBQVcsRUFBRSxLQUFhO0lBQ3RELHNCQUFzQjtJQUN0QixFQUFFLENBQUMsQ0FBRSxHQUFXLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztRQUFDLE1BQU0sQ0FBRSxHQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25FLHNCQUFzQjtJQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUU7UUFBRSxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWixDQUFDO0FBUEQsb0NBT0M7QUFRRCxvQkFBMkIsR0FBVyxFQUFFLEtBQWE7SUFDcEQsTUFBTSxDQUFDLENBQ04sR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTTtRQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxDQUNyQyxDQUFDO0FBQ0gsQ0FBQztBQUxELGdDQUtDO0FBRUQsd0JBQStCLE9BQWU7SUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLDJCQUEyQjtRQUMzQixPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELEtBQUssQ0FBQyxvQkFBa0IsT0FBTyxNQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCx3QkFBd0I7SUFDeEIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6RSw4QkFBOEI7SUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDM0MsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksT0FBYixRQUFRLEVBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQUUsY0FBYyxFQUFFLE9BQU8sR0FBQyxDQUFDO1FBQ25HLEtBQUssQ0FBQyxnQkFBYyxJQUFNLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO0lBQ0YsQ0FBQztJQUNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDO0FBcEJELHdDQW9CQztBQUVELG9CQUEyQixPQUFlO0lBQ3pDLEtBQUssQ0FBQyx3QkFBc0IsT0FBUyxDQUFDLENBQUM7SUFDdkMscUJBQXFCO0lBQ3JCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEYsS0FBSyxDQUFDLGVBQWEsT0FBUyxDQUFDLENBQUM7SUFDOUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ2hELENBQUM7QUFORCxnQ0FNQyJ9