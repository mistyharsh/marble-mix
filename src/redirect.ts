import { EffectResponse } from '@marblejs/core';

function _temporary(url: string, writable: boolean = true): EffectResponse {
    const status = writable ? 303 : 307;
    const location = url;

    return { status, headers: { location } };
}

function _permanent(url: string, writable: boolean = true): EffectResponse {
    const status = writable ? 301 : 308;
    const location = url;

    return { status, headers: { location } };
}


/**
 * @export Traditional HTTP `302 Found` response with Location header set to url.
 * @param {string} url set `Location` header to url.
 * @returns {EffectResponse} Marble.js `EffectResponse` with status as 302.
 */
export function redirect(url: string): EffectResponse {
    const location = url;

    return { status: 302, headers: { location } };
}

// Use namespacing for user convenience

/**
 * Use HTTP `303` or `307` for redirect instead of `302`.
 * @param {string} url Set `Location` header to url.
 * @param {boolean} [writable=true] If true means original `POST/PUT/DELETE` will be followed by `GET` on redirect
 * by the client by setting the status code as `303`.
 * @returns {EffectResponse}
 */
redirect.temporary = _temporary;

/**
 * Redirect permanently. Use HTTP `301` or `308`.
 * @param {string} url Set `Location` header to url.
 * @param {boolean} [writable=true] If true means original `POST/PUT/DELETE` will be followed by `GET` on redirect
 * by the client by setting the status code as `301`.
 * @returns {EffectResponse}
 */
redirect.permanent = _permanent;
