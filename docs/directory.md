# Directory Serving middleware
`marble-mix` provides a request pipeline middleware for serving static directory on a given route.

## Usage

In the following example, any `GET` request to `/public/:dir*` will serve files from `assets` folder. Assuming you have `main.ts` file, create `assets/public/` folder and few sample files inside the `public` folder.

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

| Request path            | File matched                  |
|-------------------------|-------------------------------|
| /public/index.html      | assets/public/index.html      |
| /public/test/style.scss | assets/public/test/style.scss |

## API
### `serveDirectory(options: StaticMiddlewareOpts)`
Creates a marble.js middleware. `options` is an optional configuration object. It accepts the same options as that of [send()](https://github.com/pillarjs/send#options) options. Additionally, there are few more options:

#### `fallthrough: boolean`:
If enabled, then requests are delegated to route handler whenever there is error in reading the requested file. User should send appropriate response. Most common causes of errors are file not found or accessing forbidden files. Default `false`.

#### `headers: (requestPath: string, status: any) => Array<[string, string]>`:
A callback function called right before sending the headers. It calls the function with request URL path and status and expects an list of tuple of `<header, value>` where `header` is actual header and value is the header value in string. Useful when sending custom header like `Content-Disposition`, `Cookie`, etc. `Default: null`.

#### `params: string[]`:
It is a list of path parameters that should participate in determining file to serve. For example, if you have a path `/public/:root/:dir*` and `root` set to `assets` folder. Without `params`, request to `/public/styles/core/style.css` will map to `assets/public/styles/core/style.css` file. Sometimes, prefix `/public` is not required. It means we end up creating extra `public` folder inside `assets`.

To avoid this, you can set `params` to `['root', 'dir']`. Now above request will look for `assets/styles/core/style.css` file.

If `params` is set to just `['dir']`, then it will look for `assets/core/style.scss` file.

### Example with `fallthrough` and `params`

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

