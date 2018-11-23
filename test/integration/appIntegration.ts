import path from 'path';

import { combineRoutes, EffectFactory, httpListener, use } from '@marblejs/core';
import { map } from 'rxjs/operators';

import { makeStatic$ } from '../../src';

const staticServer$ = makeStatic$({
    root: path.join(__dirname, '../../assets')
});

const staticFiles = EffectFactory
    .matchPath('/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(staticServer$, res),
        map(() => {
            // TODO: Pending work
            return { body: 'FALLTHROUGH' };
        })
    ));

const file$ = combineRoutes('/public', [staticFiles]);

export const app = httpListener({ effects: [file$], middlewares: [] });
