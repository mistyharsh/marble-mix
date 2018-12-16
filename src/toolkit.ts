import { EffectResponse, HttpStatus } from '@marblejs/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export type Response$ = Observable<EffectResponse>;
export type Pipeable = (source: Response$) => Response$;

export interface HeaderOpts {
    append: boolean;
    separator: string;
    override: boolean;
}

export type MultipleHeaders = Array<[string, string, HeaderOpts?]>;

const defaultHeaderOpts: HeaderOpts = { append: false, separator: ',', override: true };

export function body(value: object | string): Pipeable {
    return (source) => source.pipe(
        map((x) => typeof value === 'string'
            ? { ...x, body: value }
            : { ...x, body: JSON.stringify(value) }));
}

export function charset() {}

export function code() {}

export function created(uri: string) { }

export function header(key: string, value: string, opts?: Partial<HeaderOpts>): Pipeable {
    return (source) => source.pipe(
        map((x) => setHeader(key, value, x, opts)));
}

export function headers(list: MultipleHeaders): Pipeable {
    return (source) => source.pipe(
        map((x) => list.reduce((y, z) => setHeader(z[0], z[1], y, z[2]), x)));
}

export function location() {}

export function make(statusCode: HttpStatus = HttpStatus.OK): Observable<EffectResponse> {
    return of({ status: statusCode });
}

export function state() {}

export function type() {}

export function unstate() {}

function findHeader(key: string, record?: Record<string, string>) {
    return (record && record[key]) || null;
}

function setHeader(key: string, value: string, x: EffectResponse, options?: Partial<HeaderOpts>): EffectResponse {

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

const mr = {
    body, charset, code, created,
    header, headers, location, make,
    state, type, unstate
};

export default mr;

