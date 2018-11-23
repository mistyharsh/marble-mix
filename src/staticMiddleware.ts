
import path from 'path';

import { Effect, HttpRequest, HttpResponse } from '@marblejs/core';
import { fromEvent, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import send from 'send';

export interface StaticMiddlewareOpts {
    root: string;
    data?: any;
}

function sendP(request: HttpRequest, response: HttpResponse, options: any): Observable<HttpRequest> {

    const responseStream = send(request, request.url, options).pipe(response);

    return fromEvent(responseStream, 'finish').pipe(take(1)) as any;
}

export function makeStatic$(options: StaticMiddlewareOpts): Effect<HttpRequest> {

    const static$: Effect<HttpRequest> = (req$: Observable<HttpRequest>, res: HttpResponse) => {

        const fileToServe = path.join(__dirname, '../assets/public/test.html');

        const _opts = { root: options.root };

        return req$.pipe(
            switchMap((x) => sendP(x, res, _opts))
        );
    };

    return static$;
}
