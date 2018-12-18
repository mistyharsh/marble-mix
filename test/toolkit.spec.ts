import { m } from '../src';

describe('make() function', () => {

    test('returns Observable<EffectResponse> with default 200 status code', () =>
        m.make()
            .toPromise()
            .then((x) => expect(x).toEqual({ status: 200 })));

    test('returns Observable<EffectResponse>', () =>
        m.make(201)
            .toPromise()
            .then((x) => expect(x).toEqual({ status: 201 })));

});


describe('body() function', () => {

    test('returns Observable<EffectResponse> with given string body', () =>
        m.make().pipe(
            m.body('hello-response'))
            .toPromise()
            .then((x) => expect(x).toMatchObject({ body: 'hello-response' })));

    test('returns Observable<EffectResponse> with serialized body', () =>
        m.make().pipe(
            m.body({ data: 10 }))
            .toPromise()
            .then((x) => expect(x.body).toContain('{"data":10}')));
});


describe('code() function', () => {

    test('returns Observable<EffectResponse> with given status code', () =>
        m.make().pipe(
            m.code(400))
            .toPromise()
            .then((x) => expect(x.status).toEqual(400)));

    test('returns Observable<EffectResponse> with serialized body', () =>
        m.make(204).pipe(
            m.code(200))
            .toPromise()
            .then((x) => expect(x.status).toEqual(200)));
});


describe('created() function', () => {

    test('returns Observable<EffectResponse> with given 201 status and location header', () =>
        m.make().pipe(
            m.created('/relative-redirect'))
            .toPromise()
            .then((x) => expect(x).toEqual({
                status: 201,
                headers: {
                    location: '/relative-redirect'
                }
            })));
});


describe('header() function', () => {

    const appendHeaders = { append: true, override: false };
    const overrideHeaders = { append: true, override: true };

    test('returns appropriate header object', () =>
        m.make().pipe(
            m.header('accept', 'text/html'),
            m.header('x-meta', 'custom-header'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'accept': 'text/html',
                'x-meta': 'custom-header'
            })));

    test('returns header with append mode', () =>
        m.make().pipe(
            m.header('accept', 'text/html'),
            m.header('accept', 'text/plain', appendHeaders))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                accept: 'text/html,text/plain'
            })));

    test('returns header with override mode', () =>
        m.make().pipe(
            m.header('accept', 'text/html'),
            m.header('accept', 'application/json'),
            m.header('accept', 'text/plain', overrideHeaders))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({ accept: 'text/plain' })));

    test('returns header with custom seprator', () =>
        m.make().pipe(
            m.header('accept', 'text/html'),
            m.header('accept', 'text/plain', { append: true, separator: '||', override: false }))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({ accept: 'text/html||text/plain' })));

    test('returns header with mixed combinations', () =>
        m.make().pipe(
            m.header('accept', 'text/html'),
            m.header('accept', 'text/plain', { append: true, override: false }),
            m.header('x-range', 'items=10'),
            m.header('x-range', 'items=30'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'accept': 'text/html,text/plain',
                'x-range': 'items=30'
            })));
});


describe('headers() function', () => {

    test('returns headers object by reducing over a list', () =>
        m.make().pipe(
            m.headers([
                ['accept', 'text/html'],
                ['x-range', 'items=30'],
                ['x-count', '100']
            ]))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'accept': 'text/html',
                'x-range': 'items=30',
                'x-count': '100'
            })));
});


describe('location() function', () => {

    test('returns headers with location', () =>
        m.make().pipe(
            m.location('http://example.com/redirect-path'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                location: 'http://example.com/redirect-path'
            })));

    test('handle multiple location headers', () =>
            m.make().pipe(
                m.location('http://example.com/redirect-path'),
                m.location('http://example.com/redirect-path-new'))
                .toPromise()
                .then((x) => expect(x.headers).toEqual({
                    location: 'http://example.com/redirect-path-new'
                })));
});

describe('state() function', () => {

    test('return simple cookie with default options', () =>
        m.make().pipe(
            m.state('hello', 'world'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'set-cookie': ['hello=world; Secure; HttpOnly; SameSite=Strict']
            })));

    test('return cookie with custom time to live', () => {
        return m.make().pipe(
            m.state('hello', 'world', { ttl: 3600 }))
            .toPromise()
            .then((x) => {
                const time = new Date(Date.now() + 3600);
                expect(x.headers).toEqual({
                    'set-cookie': [`hello=world; Max-Age=3; Expires=${time.toUTCString()}; Secure; HttpOnly; SameSite=Strict`]
                });
            });
    });

    test('return multiple cookies cookie with default options', () =>
        m.make().pipe(
            m.state('hello', 'world'),
            m.state('welcome', 'engineer'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'set-cookie': [
                    'hello=world; Secure; HttpOnly; SameSite=Strict',
                    'welcome=engineer; Secure; HttpOnly; SameSite=Strict'
                ]
            })));
});

describe('unstate() function', () => {

    test('return expired cookie with default options', () =>
        m.make().pipe(
            m.unstate('hello'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'set-cookie': ['hello=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Strict']
            })));
});
