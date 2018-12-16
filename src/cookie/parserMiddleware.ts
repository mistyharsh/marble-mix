import { HttpRequest, HttpResponse } from '@marblejs/core';
import { defer, Observable, of } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';

// @ts-ignore
import Statehood from 'statehood';

// Provide three core functions
// 1. Reading cookies
// 2. Setting cookies
// 3. Cleaning cookies
// Some desired - Lazy, Functional flavor, Strict typing
// Some desired - Signed and encrypted cookies, encoding schemes

export interface HttpRequestWithState extends HttpRequest {
    state: any;
}

export type CookieError = 'ignore' | 'error';

export function cookieParser(action: CookieError = 'error') {

    const definitions = new Statehood.Definitions();

    return (req$: Observable<HttpRequest>, res: HttpResponse) => {

        return req$.pipe(
            // Attempt to parse cookie
            switchMap((req) => defer(() => definitions.parse(req.headers.cookie || '')).pipe(

                // If there is any error and we are ignoring it, send empty cookie object
                // Otherwise, send 400 response
                catchError((_err) => {
                    return action === 'ignore'
                        ? of({ states: {} }) : res.send({ status: 400 });
                }),

                // If cookie parsing is successful then, decorate request object
                tap((x: any) => req.state = x.states),

                // Carry forward orginal request object
                mapTo(req as HttpRequestWithState))));
    };
}
