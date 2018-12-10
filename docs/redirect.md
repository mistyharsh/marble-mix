# HTTP Redirect utilities

HTTP specification defined five status codes for redirection:
  1. `301`: Permanent
  2. `302`: Found
  3. `303`: Temporary
  4. `307`: Temporary (non-writable)
  5. `308`: Permanent (non-writable)

**Writable requests:** HTTP `301` and `303` are writable redirects in a sense that if original request was made using `POST`, `PUT` or `DELETE`, then the redirect request is changed to `GET` method.

**Non-writable requests:** On the contrary, HTTP `307` and `308` status code ensures that browser doesn't change HTTP method when making a redirected request.

HTTP status code `302` has been exploited in the past and hence should be used carefully. It strictly means `Found` and not really a redirect.

This library supports redirect using all the status codes.

## Usage

```typescript
import { redirect } from 'marble-mix';

// 302 Redirect
const helloEffect = EffectFactory
    .matchPath('/hello.txt')
    .matchType('GET')
    .use((req$) => req$.pipe(
        // TRANSFORM REQUEST HERE
        map(() => redirect('http://redirect.com/world.text'))));

// 303 Redirect
redirect.temporary('<redirect-url>', /* true */ );

// 307 Redirect - non-writable
redirect.temporary('<redirect-url>', false);

// 301 Permanent
redirect.permanent('<redirect-url>', /* true */);

// 308 Permanent - non-writable
redirect.permanent('<redirect-url>', false);
```

### Additional custom headers
All the redirect utility functions return following Marble.js `EffectResponse` object:

```javascript
{
    status: 302, /* Or others */
    headers: {
        location: 'redirect-url'
    }
}
```

If you need to send have additional custom headers, simply add additional headers to this response object.

```typescript
// 302 Redirect
const helloEffect = EffectFactory
    .matchPath('/hello.txt')
    .matchType('GET')
    .use((req$) => req$.pipe(
        // TRANSFORM REQUEST HERE
        map(() => {
            const response = redirect('http://redirect.com/world.text');

            // Add some more headers to the reponse.
            // Or you can do immutable header manipulation.
            response.headers['X-Custom-Header'] = 'Header Value';

            return response;
        })));
```
