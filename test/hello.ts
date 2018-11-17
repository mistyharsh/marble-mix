import { printAPIEffects } from '../src/effectLogger';
import { RouteEffect, RouteEffectGroup } from '@marblejs/core';

const x: (RouteEffect | RouteEffectGroup)[] = [
    { path: '/', method: 'GET', middlewares: [], effect: () => {} },

    { path: '/user', middlewares: [], effects: [
        { path: '/', method: 'GET', effect: () => {} },
        { path: '/', method: 'POST', effect: () => {} } ,

        { path: '/user', middlewares: [], effects: [
            { path: '/', method: 'GET', effect: () => {} },
            { path: '/', method: 'POST', effect: () => {} } ],
        }]
    },

    { path: '/api', middlewares: [], effects: [
        { path: '/', method: 'GET', effect: () => {} },
        { path: '/', method: 'POST', effect: () => {} } ,

        { path: '/user', middlewares: [], effects: [
            { path: '/', method: 'GET', effect: () => {} },
            { path: '/', method: 'POST', effect: () => {} } ],
        }]
    }
];

test('adds 1 + 2 to equal 3', () => {
    printAPIEffects(x);
    expect(3).toBe(3);
});