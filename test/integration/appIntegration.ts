import path from 'path';

import { combineRoutes, EffectFactory, httpListener, use } from '@marblejs/core';
import { map } from 'rxjs/operators';

import { makeStatic$ } from '../../src';

// Middleware with custom params and fallthrough
const staticFallthroughMiddleware = makeStatic$({
    fallthrough: true,
    params: ['dir'],
    root: path.join(__dirname, '../../assets/public')
});

const staticFilesCustomError = EffectFactory
    .matchPath('/fallthrough/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(staticFallthroughMiddleware, res),
        map(() => ({ body: 'fallthrough-response', status: 404 }))));

// Catch all middleware
const staticDefaultMiddleware = makeStatic$({
    fallthrough: false,
    root: path.join(__dirname, '../../assets')
});

const staticFiles = EffectFactory
    .matchPath('/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(staticDefaultMiddleware, res),
        map(() => ({}))));

const file$ = combineRoutes('/public', [staticFilesCustomError, staticFiles]);

export const app = httpListener({ effects: [file$], middlewares: [] });
