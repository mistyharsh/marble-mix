import { parse } from 'path';

import { HttpEffectResponse, HttpRequest, HttpResponse } from '@marblejs/core';
import { defer, empty, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { sendP, StaticMiddlewareOpts } from './staticMiddleware';

export function replyFile(request: HttpRequest, response: HttpResponse, filepath: string,
    options: StaticMiddlewareOpts = {}): Observable<HttpEffectResponse> {

    const { dir, base } = parse(filepath);

    const opts: StaticMiddlewareOpts = { ...options, root: dir, params: undefined, fallthrough: false };

    return defer(() => sendP(request, response, opts, base)).pipe(
        switchMap(() => empty()));
}

