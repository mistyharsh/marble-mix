# Cookie Parser
`marble-mix` provides middleware for parsing HTTP cookies. It is build on top of battle-tested [Statehood](https://github.com/hapijs/statehood) library that powers Hapi.js framework.

## Usage
This middleware decorates incoming request object with `state` key i.e. `request.key` is a map containing **key-value** pair.

### Example

```typescript
import { cookieParser,  CookieError } from 'marble-mix';

const cookieEffect = EffectFactory
    .matchPath('/cookie-path')
    .matchType('GET')
    .use((req$, res) => req$.pipe(
        // use of middleware
        use(cookieParser(CookieError.ignore), res),
        map((req) => ({ body: JSON.stringify(req.state), code: 200 }))));


```
For the above code snippet, request object will contain following state object.

``` javascript
// Request header
'Cookie': 'hello=engineer; world=welcome'

// Parsed State object
{
    hello: 'engineer',
    world: 'welcome'
}


// Request header
'Cookie': 'hello=engineer; world=; today=great'

// Parsed State object
{
    hello: 'engineer',
    world: '',
    today: 'great'
}
```

## API

### `cookieParser(errorAction: 'ignore' | 'error')`
It creates a cookie parsing middleware. It accepts `errorAction` as an optional argument.

#### `errorAction: 'ignore' | 'error'`:
If the value is `ignore`, then any error during the parsing is ignored. Otherwise if invalid `Cookie` header is sent, then client request terminated with status code as `400`. Default value is `error`.

## About cookies and Marble.js
HTTP cookies are basically a stateful mechanism. As per the [discussion on this thread](https://github.com/marblejs/marble/issues/83):

> Marble.js is aimed at REST API and alike. It is not a full-fledged framework and probably not meant for server-rendered or typical server-side API development.

REST and cookies are not meant to play well together. However, for some small-to-medium scale applications, keeping single server for REST API and associated **Front-end code**/**UI Server** makes more sense. Also, some SPA first applications might use cookies as a storage medium and not as a session management mechanism. This is another use case for using cookies with Middleware. Read [Auth0 blog post](https://auth0.com/docs/security/store-tokens) for more details.

This middlware is purely meant to support above use cases. Using things outside of their intended purpose is a double edged sword. It can help it evolve or make your solution more messier.

## TODO
Cookie management needs extensible features. They will be developed in coming days:
  1. Signed cookies
  2. Encrypted cookies
  3. Encoding schemes (json, forms, etc.)









