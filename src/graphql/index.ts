import { HttpMiddlewareEffect } from '@marblejs/core';
import { RenderPageOptions, renderPlaygroundPage } from 'graphql-playground-html';
import { map, switchMap } from 'rxjs/operators';

import m from '../toolkit';

export function makeGraphQLPlayground(options: RenderPageOptions) {

    const playground$: HttpMiddlewareEffect = (req$, res) => {

        return req$.pipe(

            // graphql-playground-html returns html page as a string
            // Uses CDN to serve other assets
            map(() => renderPlaygroundPage(options)),

            switchMap((htmlPage) => m.make().pipe(
                m.body(htmlPage),
                m.header('Content-Type', 'text/html'))),

            switchMap((response) => res.send(response)));
    };

    return playground$;
}
