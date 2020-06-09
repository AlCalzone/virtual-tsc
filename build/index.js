"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("./compiler");
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return compiler_1.compile; } });
Object.defineProperty(exports, "compileAsync", { enumerable: true, get: function () { return compiler_1.compileAsync; } });
var util_1 = require("./util");
Object.defineProperty(exports, "setTypeScriptResolveOptions", { enumerable: true, get: function () { return util_1.setTypeScriptResolveOptions; } });
var server_1 = require("./server");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return server_1.Server; } });
