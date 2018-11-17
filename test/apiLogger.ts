import { EffectFactory } from '@marblejs/core';
import { mapTo } from 'rxjs/operators';

import { printAPIEffects } from '../src/effectLogger';

// const x: any[] = [

//     { path: '/', method: 'GET', middlewares: [], effect: () => {} },

//     { path: '/users', middlewares: [], effects: [
//         { path: '/', method: 'GET', effect: () => {} },
//         { path: '/', method: 'POST', effect: () => {} } ,

//         { path: '/user', middlewares: [], effects: [
//             { path: '/', method: 'GET', effect: () => {} },
//             { path: '/', method: 'PUT', effect: () => {} } ]
//         }]
//     },

//     { path: '/api', middlewares: [], effects: [
//         { path: '/', method: 'GET', effect: () => {} },
//         { path: '/', method: 'DELETE', effect: () => {} } ,

//         { path: '/user', middlewares: [], effects: [
//             { path: '/', method: 'GET', effect: () => {} },
//             { path: '/', method: 'POST', effect: () => {} } ]
//         }]
//     }
// ];

test('Simple API Endpoint effects', () => {

    const route1 = EffectFactory
        .matchPath('/')
        .matchType('GET')
        .use((req$) => req$.pipe(
            mapTo({ body: {} })));

    const route2 = EffectFactory
            .matchPath('/users')
            .matchType('GET')
            .use((req$) => req$.pipe(
                mapTo({ body: {} })));

    const routeEffects = [route1, route2];

    const routes = printAPIEffects(routeEffects);

    expect(routes.length).toBe(2);
});
