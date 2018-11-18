import * as path from 'path';

import { RouteEffect, RouteEffectGroup } from '@marblejs/core';

import chalk from 'chalk';
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

    const printData = flattenedRoutes.map((x) => ([getMethod(x.method), x.path]));

    // tslint:disable-next-line:no-console
    console.log(table(printData));

    return flattenedRoutes;
}

function flatten(effects: Routes, prefix: string = '', routes: FlatRoute[] = []) {

    effects.forEach((x) => {

        const routePath = path.join(prefix, x.path);

        if (isRouteEffectGroup(x)) {
            flatten(x.effects, routePath, routes);
        } else {
            routes.push({ path: routePath, method: x.method.toUpperCase() });
        }
    });

    return routes;
}

function isRouteEffectGroup(x: any): x is RouteEffectGroup {
    return Array.isArray(x.effects) && Array.isArray(x.middlewares);
}

function sortPaths(first: string, second: string) {
    const a = first.toLowerCase();
    const b = second.toLowerCase();

    return a > b ? 1 : b > a ? -1 : 0;
}

function getMethod(x: string) {
    if (x === 'GET') {
        return chalk.green(x);
    } else if (x === 'POST') {
        return chalk.yellow(x);
    } else if (x === 'PUT') {
        return chalk.blue(x);
    } else if (x === 'DELETE') {
        return chalk.red(x);
    } else {
        return x;
    }
}
