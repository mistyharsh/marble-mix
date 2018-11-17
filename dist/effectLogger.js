"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
function printAPIEffects(effects) {
    const flattenedRoutes = flatten(effects);
    flattenedRoutes.sort((x, y) => sortPaths(x.path, y.path));
    const printData = flattenedRoutes.map((x) => ([getMethod(x.method), x.path]));
    console.log(table_1.table(printData));
    return flattenedRoutes;
}
exports.printAPIEffects = printAPIEffects;
function flatten(effects, prefix = '', routes = []) {
    effects.forEach((x) => {
        const routePath = path.join(prefix, x.path);
        if (isRouteEffectGroup(x)) {
            flatten(x.effects, routePath, routes);
        }
        else {
            routes.push({ path: routePath, method: x.method.toUpperCase() });
        }
    });
    return routes;
}
function isRouteEffectGroup(x) {
    return Array.isArray(x.effects) && Array.isArray(x.middlewares);
}
function sortPaths(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? 1 : b > a ? -1 : 0;
}
function getMethod(x) {
    if (x === 'GET') {
        return chalk_1.default.green(x);
    }
    else if (x === 'POST') {
        return chalk_1.default.yellow(x);
    }
    else if (x === 'PUT') {
        return chalk_1.default.blue(x);
    }
    else if (x === 'DELETE') {
        return chalk_1.default.red(x);
    }
    else {
        return x;
    }
}
//# sourceMappingURL=effectLogger.js.map