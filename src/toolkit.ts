import { HttpEffectResponse, HttpHeaders, HttpStatus } from '@marblejs/core';
import { defer, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// @ts-ignore
import Statehood from 'statehood';

export type Response$ = Observable<HttpEffectResponse>;
export type Pipeable = (source: Response$) => Response$;

export interface CookieOptions {
    ttl?: number | null;
    isSecure?: boolean;
    isHttpOnly?: boolean;
    isSameSite?: false | 'Strict' | 'Lax';
    path?: string | null;
    domain?: string | null;
}

export interface HeaderOpts {
    append: boolean;
    separator: string;
    override: boolean;
}

export type MultipleHeaders = Array<[string, string, HeaderOpts?]>;

const defaultHeaderOpts: HeaderOpts = { append: false, separator: ',', override: true };

const defaultCookieOpts: CookieOptions = {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    isSameSite: 'Strict',
    path: null,
    domain: null
};

export function body(value: object | string): Pipeable {
    return (source) => source.pipe(
        map((x) => ({ ...x, body: value })));
}

export function charset() {}

export function code(statusCode: HttpStatus): Pipeable {
    return (source) => source.pipe(
        map((x) => ({ ...x, status: statusCode })));
}

export function created(uri: string): Pipeable {
    return (source) => source.pipe(code(201), location(uri));
}

export function header(key: string, value: string, opts?: Partial<HeaderOpts>): Pipeable {
    return (source) => source.pipe(
        map((x) => setHeader(key, value, x, opts)));
}

export function headers(list: MultipleHeaders): Pipeable {
    return (source) => source.pipe(
        map((x) => list.reduce((y, z) => setHeader(z[0], z[1], y, z[2]), x)));
}

export function location(uri: string): Pipeable {
    return header('location', uri, { override: true });
}

export function make(statusCode: HttpStatus = HttpStatus.OK): Observable<HttpEffectResponse> {
    return of({ status: statusCode });
}

export function state(name: string, value: string, options?: Partial<CookieOptions>): Pipeable {

    const opts: CookieOptions = { ...defaultCookieOpts, ...options };
    const definitions = new Statehood.Definitions();

    return (source) => source.pipe(
        switchMap((x) => defer(() => definitions.format({ name, value, options: opts })).pipe(
            map((cookies) => setCookieHeader((cookies as any[])[0], x)))));
}

export function type() {}

export function unstate(name: string, options?: Partial<CookieOptions>): Pipeable {

    // Set the ttl to 0 means remove the cookie
    const opts = { ...options, ttl: 0 };

    return state(name, '', opts);
}

function findHeader(key: string, record?: HttpHeaders) {
    return (record && record[key]) || null;
}

function setHeader(key: string, value: string, x: HttpEffectResponse, options?: Partial<HeaderOpts>): HttpEffectResponse {

    const opts = { ...defaultHeaderOpts, ...options };
    const { append, separator, override } = opts;

    const headerValue = findHeader(key, x.headers);

    if (headerValue) {
        if (override) {
            // If header value is found and overriding is allowed
            return { ...x, headers: { ...x.headers, [key]: value } };
        } else if (append) {
            // If header value is found and appending is allowed
            const newValue = `${x.headers![key]}${separator}${value}`;

            return { ...x, headers: { ...x.headers, [key]: newValue } };
        }
        // If header value is present, but not allowed to override or append
        return x;
    } else {
        // Simplest case when headerValue is not found
        return { ...x, headers: { ...x.headers, [key]: value } };
    }

}

function setCookieHeader(formattedCookie: string, x: HttpEffectResponse): HttpEffectResponse {

    const existing = x.headers && x.headers['set-cookie'] as string | undefined | string[];

    if (!existing) {
        return { ...x, headers: { ...x.headers, 'set-cookie': [formattedCookie] } as any };
    } else if (existing instanceof Array) {

        const newValue = existing.concat(formattedCookie) as any;

        return { ...x, headers: { ...x.headers, 'set-cookie': newValue } };
    } else if (typeof existing === 'string') {

        const newValue = [existing, formattedCookie] as any;

        return { ...x, headers: { ...x.headers, 'set-cookie': newValue } };
    }

    return x;
}

const mr = {
    body, charset, code, created,
    header, headers, location, make,
    state, type, unstate
};

export default mr;

