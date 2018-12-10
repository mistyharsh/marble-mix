import { combineRoutes, EffectFactory, HttpRequest } from '@marblejs/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { printAPIEffects } from '../src/apiEffectLogger';

test('Simple API Endpoint effects', () => {

    // 1. Setup Data
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

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const routes = printAPIEffects(routeEffects);

    // 4. Verify behaviour
    expect(routes.length).toBe(2);

    // 5. Teardown (N/A)
});

test('Nested API Endpoint effects', () => {

    const handler$ = (req$: Observable<HttpRequest>) => req$.pipe(mapTo({ body: {} }));

    // 1. Setup Data
    const root$ = EffectFactory
        .matchPath('/')
        .matchType('GET')
        .use(handler$);

    const getUsers$ = EffectFactory
        .matchPath('/')
        .matchType('GET')
        .use(handler$);

    const newUser$ = EffectFactory
        .matchPath('/')
        .matchType('POST')
        .use(handler$);

    const getUser$ = EffectFactory
        .matchPath('/:userId')
        .matchType('GET')
        .use(handler$);

    const updateUser$ = EffectFactory
        .matchPath('/:userId')
        .matchType('PUT')
        .use(handler$);

    const deleteUser$ = EffectFactory
        .matchPath('/:userId')
        .matchType('DELETE')
        .use(handler$);

    const user$ = combineRoutes('users', {
        middlewares: [],
        effects: [getUsers$, newUser$, getUser$, updateUser$, deleteUser$]
    });

    const allRoutes$ = combineRoutes('api/v1', {
        middlewares: [],
        effects: [root$, user$]
    });

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const routes = printAPIEffects([allRoutes$]);

    // 4. VERIFY
    expect(routes.length).toBe(6);

    // 5. Teardown (N/A)

});
