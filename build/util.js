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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJEOi92aXJ0dWFsLXRzYy9zcmMvIiwic291cmNlcyI6WyJ1dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXNDO0FBQ3RDLCtCQUFpQztBQUNqQywrQkFBaUM7QUFFakMsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBVzFDLHNCQUE2QixHQUFXLEVBQUUsS0FBYTtJQUN0RCxzQkFBc0I7SUFDdEIsRUFBRSxDQUFDLENBQUUsR0FBVyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUUsR0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRSxzQkFBc0I7SUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFO1FBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ1osQ0FBQztBQVBELG9DQU9DO0FBUUQsb0JBQTJCLEdBQVcsRUFBRSxLQUFhO0lBQ3BELE1BQU0sQ0FBQyxDQUNOLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU07UUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssQ0FDckMsQ0FBQztBQUNILENBQUM7QUFMRCxnQ0FLQztBQUVELHdCQUErQixPQUFlO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSwyQkFBMkI7UUFDM0IsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxLQUFLLENBQUMsb0JBQWtCLE9BQU8sTUFBRyxDQUFDLENBQUM7SUFDcEMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsd0JBQXdCO0lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekUsOEJBQThCO0lBQzlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzNDLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLE9BQWIsUUFBUSxFQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFFLGNBQWMsRUFBRSxPQUFPLEdBQUMsQ0FBQztRQUNuRyxLQUFLLENBQUMsZ0JBQWMsSUFBTSxDQUFDLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztJQUNGLENBQUM7SUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQXBCRCx3Q0FvQkMifQ==