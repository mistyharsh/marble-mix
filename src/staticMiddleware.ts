
import { Stats } from 'fs';

import { HttpMiddlewareEffect, HttpRequest, HttpResponse } from '@marblejs/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import send, { SendOptions } from 'send';

export type Header = [string, string];
export type Headers = Header[];

export interface StaticMiddlewareOpts extends SendOptions {
    // If error in finding requested file, then forward the request and let user handle it
    fallthrough?: boolean;

    // If you need to send custom headers, use this function
    headers?: (requestPath: string, status: any) => Array<[string, string]>;

    // Which parameters should participate in serving static file
    params?: string[];
}

function setHeaders(response: any, headers: Headers) {
    headers.forEach(([key, value]: Header) => response.setHeader(key, value));
}

// https://www.bennadel.com/blog/2823-does-the-http-response-stream-need-error-event-handlers-in-node-js.htm
// https://stackoverflow.com/q/53455973/5723098
// Following event handlers are critical
// File read stream - error
// Http response stream - finish
export function sendP(request: HttpRequest, response: HttpResponse,
    options: StaticMiddlewareOpts = {}, urlPath: string = request.url): Promise<HttpRequest> {

    return new Promise((resolve, reject) => {

        const rquestUrl = options.params
            ? options.params.map((x) => (request.params as any)[x]).join('/')
            : urlPath;

        const readStream = send(request, rquestUrl, options);

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

export function serveDirectory(options?: StaticMiddlewareOpts): HttpMiddlewareEffect {

    const static$: HttpMiddlewareEffect = (req$: Observable<HttpRequest>, res: HttpResponse) => {

        return req$.pipe(
            switchMap((x) => sendP(x, res, options)),
            catchError((x) => of(x)));
    };

    return static$;
}
