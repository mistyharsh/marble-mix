import path from 'path';

import { combineRoutes, EffectFactory, httpListener, use } from '@marblejs/core';
import { map, switchMap } from 'rxjs/operators';

import { replyFile, serveDirectory } from '../../src';

// Middleware with custom params and fallthrough
const fallthroughMiddleware = serveDirectory({
    fallthrough: true,
    params: ['dir'],
    root: path.join(__dirname, '../../assets/public')
});

// API Effect
const staticDirCustomError = EffectFactory
    .matchPath('/fallthrough/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(fallthroughMiddleware, res),
        map(() => ({ body: 'fallthrough-response', status: 404 }))));

// Catch all middleware
const defaultMiddleware = serveDirectory({
    fallthrough: false,
    root: path.join(__dirname, '../../assets')
});

// API Effect
const staticDirEffect = EffectFactory
    .matchPath('/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(defaultMiddleware, res),
        map(() => ({}))));

// API Effect - Single file handler
const singleFile = EffectFactory
    .matchPath('/hello.txt')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        switchMap((req) => replyFile(req, res, path.join(__dirname, '../../assets', 'hello.txt'))
    )));

// API Effect - Single file handler
const singleFileNonExist = EffectFactory
    .matchPath('/hello-2.txt')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        switchMap((req) => replyFile(req, res, path.join(__dirname, '../../assets', 'hello-2.txt'))
    )));

const staticFile$ = combineRoutes('/public', [staticDirCustomError, staticDirEffect]);

export const app = httpListener({ effects: [staticFile$, singleFile, singleFileNonExist], middlewares: [] });
