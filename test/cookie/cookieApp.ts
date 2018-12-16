import { EffectFactory, httpListener, use } from '@marblejs/core';
import { map } from 'rxjs/operators';

import { cookieParser } from '../../src';
import { CookieError } from '../../src/cookie/parserMiddleware';

const cookieEffect = EffectFactory
    .matchPath('/cookie-path')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(cookieParser(CookieError.ignore), res),
        map((req) => ({ body: JSON.stringify(req.state), code: 200 }))));

const cookieErrorEffect = EffectFactory
    .matchPath('/cookie-path-error')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(cookieParser(CookieError.error), res),
        map((req) => ({ body: JSON.stringify(req.state), code: 200 }))));

const effects = [cookieEffect, cookieErrorEffect];

export const app = httpListener({ effects, middlewares: [] });
