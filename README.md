# marble-mix
Common Utilities for [Marble.js](https://github.com/marblejs/marble). It provides:
  1. Static directory serving middleware
  2. File serving helper
  3. API Effect logger

Middleware for streaming files and directories streaming is build on-top of awesome [send](https://github.com/pillarjs/send) library.

## Installation
Install using `npm install --save marble-mix`; Even if the library is written in TypeScript, it is published as CommonJS module and hence can be used directly from Node.js code without any compilation.

## Directory Serving middleware
`marble-mix` provides a request pipeline middleware for serving static directory on a given route.

### Usage

In the following example, any `GET` request to `/public/:dir*` will serve files from `assets` folder. Assuming you have `main.ts` file, create `assets/public` folder and few sample files inside public folder.

```typescript
import * as path from 'path';

import { combineRoutes, EffectFactory, httpListener, use } from '@marblejs/core';
import { map } from 'rxjs/operators';
import { serveDirectory } from 'marble-mix';


// Initialize middleware
const defaultMiddleware = serveDirectory({
    root: path.join(__dirname, 'assets')
});

// API Effect
const staticDirEffect = EffectFactory
    .matchPath('/:dir*')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        use(defaultMiddleware, res),
        map(() => ({})))); // Map is required here to make TypeScript happy

// Combine routes
const staticFile$ = combineRoutes('/public', [staticDirEffect, /* Other route effects */]);

export const app = httpListener({ effects: [staticFile$], middlewares: [] });
```

Requests will be mapped as:

| Requests                | File matched                  |
|-------------------------|-------------------------------|
| /public/index.html      | assets/public/index.html      |
| /public/test/style.scss | assets/public/test/style.scss |

### API
#### `serveDirectory(options: StaticMiddlewareOpts)`
Creates a marble.js middleware. `options` is an optional config object. It accepts the same options as that of [send()](https://github.com/pillarjs/send#options) options. Additionally, there are few more options:

##### `fallthrough: boolean`:
If enabled, then requests are delegated to route handler whenever there is error in reading the requested file. User should send appropriate response. Most common causes of errors are file not found or accessing forbidden files. Default `false`.

##### `headers: (requestPath: string, status: any) => Array<[string, string]>`:
A callback function called right before sending the headers. It calls the function with request URL path and status and expects an list of tuple of `<header, value>` where `header` is actual header and value is the header value in string. Useful when sending custom header like `Content-Disposition`, `Cookie`, etc. `Default: null`.

##### `params: string[]`:
It is a list of path parameters that should participate in determining file to serve. For example, if you have a path `/public/:root/:dir*` and `root` set to `assets` folder. Without `params`, request to `/public/styles/core/style.css` will map to `assets/public/styles/core/style.css` file. Sometimes, prefix `/public` is not required. It means we end up creating extra `public` inside assets folder. To avoid this, you can set `params` to `['root', 'dir']`. Now above request will look for `assets/styles/core/style.css` file. If `params` is set to just `['dir']`, then it will look for `assets/core/style.scss` file.

#### Example with `fallthrough` and `params`

```typescript
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
```


## Static file handler
In few cases, plain directory handler is not enough. You might want to transform request before serving the file. In that case, you should use `replyFile` interface.

### Usage

Following code serves a single file `assets/hello.text` for the request `GET /hello.text`.

```typescript
import { replyFile } from 'marble-mix';

const fileToServe = path.join(__dirname, 'assets', 'hello.txt');

const singleFile = EffectFactory
    .matchPath('/hello.txt')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        // TRANSFORM REQUEST HERE
        switchMap((req) => replyFile(req, res, fileToServe))));
```

### API
#### `replyFile(req: HttpRequest, res: HttpResponse, filePath: string, options: StaticMiddlewareOpts)`
Here `req` and `res` are the standard request and response objects provided by Marble.js. `filePath` an absolute or relative (restricted to CWD) path of the file. `options` is same as that of `serveDirectory` options. However, `fallthrough` and `params` are ignored in this case.


## API Effect Logger
A simple Marble.js utility to display the routes table to console at startup. This is mostly used by developers to verify if they have setup the routing correctly.

### Usage
In your, `main.ts` or `index.ts`, before you initialize HTTP Server:

```typescript
printAPIEffects(routeEffects);

const httpServer = http
  .createServer({ middlewares: [], routeEffects })
  .listen(PORT, HOSTNAME);
```

### Examples

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