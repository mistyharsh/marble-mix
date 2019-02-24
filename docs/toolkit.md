# Toolkit

`marbix-mix` provide various utilities for manipulating the http response.The toolkit is inspired by the Hapi.js response toolkit.

## Usage
``` typescript
import { EffectFactory } from '@marblejs/core';
import { switchMap } from 'rxjs/operators';
import { m } from 'marble-mix';


const helloStream$ = EffectFactory
    .matchPath('/')
    .matchType('GET')
    .use(req$ => req$.pipe(
        switchMap(() => m.make()).pipe(
            m.header('accept', 'text/html'),
            m.body('Hello-World'),
            m.state('sample-cookie','Hello-JS', { isSecure: false }))));   
```
## API ##

### `make(statusCode: HttpStatus = HttpStatus.OK))`
`make` will return the observable with response object containing status code, which can be piped with the other utilities. Default status code is 200.
    
### `body(value: object | string)` ###
`body` will return the observable which contains the HTTP response body.
    
### `created(uri: string)` ###
Sets the status code to `201` and HTTP location header to the location `uri`.  
      
 
### `header(key: string, value: string, options?: HeaderOpts))` ###
#### Sets the HTTP header. Where:
**key** - Header key / name  
**value** - Header value  
**options** (optional) - It is configurabale object,where HeaderOpts can be   
* **append** - If `true` then appended the existing header value. Default is `true`.  
* **seperator** - String used as a seperator while appending the header value. Default is `||`.  
* **override** - If `false` then header value does not set. Default is `false`.   


### `location(uri: string)` ###
#### Sets the HTTP Location header.
Set the HTTP location header. 
* **uri** - Absolute/Relative URI used as a location header value.  
      

### `state(name: string, value: string, options?: CookieOptions)`        
#### Sets the HTTP cookies.
`state` will set the cookie.    
* **name** - Cookie name.  
* **value** - Cookie value.  
* **options** (optional) - Configuration object.

### `unstate(name: string, options?:  name | options )`
#### Unsets / Clears the cookie.
`unstate` will clear the cookie.   
**name** - Cookie name. 
* **options** (optional) - Configuration object for the cookie expiration.