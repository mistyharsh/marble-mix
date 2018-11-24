
import { Stats } from 'fs';

import { Effect, HttpRequest, HttpResponse } from '@marblejs/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import send, { SendOptions } from 'send';

export type Header = [string, string];
export type Headers = Header[];

export interface StaticMiddlewareOpts extends SendOptions {
    fallthrough?: boolean;
    headers?: (requestPath: string, status: any) => Array<[string, string]>;
}

function setHeaders(response: any, headers: Headers) {
    headers.forEach(([key, value]: Header) => response.setHeader(key, value));
}

// https://www.bennadel.com/blog/2823-does-the-http-response-stream-need-error-event-handlers-in-node-js.htm
// https://stackoverflow.com/q/53455973/5723098
// Following event handlers are critical
// File read stream - error
// Http response stream - finish
function sendP(request: HttpRequest, response: HttpResponse, options: StaticMiddlewareOpts): Promise<HttpRequest> {

    return new Promise((resolve, reject) => {
        const readStream = send(request, request.url, options);

        // TODO: Decorate request with error object and then forward to route effect
        if (options.fallthrough) {
            readStream.on('error', () => reject(request));
        }

        // If custom headers, then set them here
        if (options.headers) {
            const headers = options.headers;
            const callback = (res: HttpResponse, requestPath: string, stats: Stats) => setHeaders(res, headers(requestPath, stats));
            readStream.on('headers', callback);
        }

        const responseStream = readStream.pipe(response);

        // File response is written to the client and hence resolve the request
        responseStream.on('finish', () => resolve(request));

    });
}

export function makeStatic$(options: StaticMiddlewareOpts): Effect<HttpRequest> {

    const static$: Effect<HttpRequest> = (req$: Observable<HttpRequest>, res: HttpResponse) => {

        return req$.pipe(
            switchMap((x) => sendP(x, res, options)),
            catchError((x) => of(x)));
    };

    return static$;
}