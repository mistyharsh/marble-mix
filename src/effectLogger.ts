import * as path from 'path';

import { RouteEffect, RouteEffectGroup } from '@marblejs/core';
import { table } from 'table';

type Route = RouteEffect | RouteEffectGroup;
type Routes = Route[];

interface FlatRoute {
    path: string;
    method: string;
}

export function printAPIEffects(effects: Routes) {
    const flattenedRoutes = flatten(effects);
    flattenedRoutes.sort((x, y) => sortPaths(x.path, y.path));

    const printData = flattenedRoutes.map((x) => ([x.method, x.path]));

    console.log(table(printData));

    return flattenedRoutes;
}

function flatten(effects: Routes, prefix: string = '', routes: FlatRoute[] = []) {

    effects.forEach((x) => {

        const routePath = path.join(prefix, x.path);

        if (isRouteEffectGroup(x)) {
            flatten(x.effects, routePath, routes);
        } else {
            routes.push({ path: routePath, method: x.method.toUpperCase() })
        }
    });

    return routes;
}

function isRouteEffectGroup(x: any): x is RouteEffectGroup {
    return Array.isArray(x.effects) && Array.isArray(x.middlewares);
}

function sortPaths(a: string, b: string) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? 1 : b > a ? -1 : 0;
}
