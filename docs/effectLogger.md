# API Effect Logger
A simple Marble.js utility to display the routes table to console at startup. This is mostly used by developers to verify if they have setup the routing correctly.

## Usage
In your, `main.ts` or `index.ts`, before you initialize HTTP Server:

```typescript
printAPIEffects(routeEffects);

const httpServer = http
  .createServer({ middlewares: [], routeEffects })
  .listen(PORT, HOSTNAME);
```

## Examples

Consider the follow API endpoint effects or routes:
```typescript
import { printAPIEffects } from 'marble-mix';

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

// Print API Endpoints to console.
printAPIEffects(routeEffects);
```
It should show the routes on the console:

![Simple Routes](images/simple-routes.png)

A more complex example is:

```typescript
import { printAPIEffects } from 'marble-mix';

const handler$ = (req$: Observable<HttpRequest>) => req$.pipe(mapTo({ body: {} }));

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

const routes = printAPIEffects([allRoutes$]);
```

It should print:

![Complex Routes](images/complex-routes.png)