import { RouteEffect, RouteEffectGroup } from '@marblejs/core';

import { printAPIEffects } from '../src/effectLogger';

const x: any[] = [

    { path: '/', method: 'GET', middlewares: [], effect: () => {} },

    { path: '/users', middlewares: [], effects: [
        { path: '/', method: 'GET', effect: () => {} },
        { path: '/', method: 'POST', effect: () => {} } ,

        { path: '/user', middlewares: [], effects: [
            { path: '/', method: 'GET', effect: () => {} },
            { path: '/', method: 'PUT', effect: () => {} } ]
        }]
    },

    { path: '/api', middlewares: [], effects: [
        { path: '/', method: 'GET', effect: () => {} },
        { path: '/', method: 'DELETE', effect: () => {} } ,

        { path: '/user', middlewares: [], effects: [
            { path: '/', method: 'GET', effect: () => {} },
            { path: '/', method: 'POST', effect: () => {} } ]
        }]
    }
];

test('adds 1 + 2 to equal 3', () => {
    printAPIEffects(x);
    expect(3).toBe(3);
});
