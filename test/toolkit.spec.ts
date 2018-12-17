import { mr } from '../src';

describe('make() function', () => {

    test('returns Observable<EffectResponse> with default 200 status code', () =>
        mr.make()
            .toPromise()
            .then((x) => expect(x).toEqual({ status: 200 })));

    test('returns Observable<EffectResponse>', () =>
        mr.make(201)
            .toPromise()
            .then((x) => expect(x).toEqual({ status: 201 })));

});


describe('body() function', () => {

    test('returns Observable<EffectResponse> with given string body', () =>
        mr.make().pipe(
            mr.body('hello-response'))
            .toPromise()
            .then((x) => expect(x).toMatchObject({ body: 'hello-response' })));

    test('returns Observable<EffectResponse> with serialized body', () =>
        mr.make().pipe(
            mr.body({ data: 10 }))
            .toPromise()
            .then((x) => expect(x.body).toContain('{"data":10}')));
});


describe('code() function', () => {

    test('returns Observable<EffectResponse> with given status code', () =>
        mr.make().pipe(
            mr.code(400))
            .toPromise()
            .then((x) => expect(x.status).toEqual(400)));

    test('returns Observable<EffectResponse> with serialized body', () =>
        mr.make(204).pipe(
            mr.code(200))
            .toPromise()
            .then((x) => expect(x.status).toEqual(200)));
});


describe('created() function', () => {

    test('returns Observable<EffectResponse> with given 201 status and location header', () =>
        mr.make().pipe(
            mr.created('/relative-redirect'))
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
        mr.make().pipe(
            mr.header('accept', 'text/html'),
            mr.header('x-meta', 'custom-header'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'accept': 'text/html',
                'x-meta': 'custom-header'
            })));

    test('returns header with append mode', () =>
        mr.make().pipe(
            mr.header('accept', 'text/html'),
            mr.header('accept', 'text/plain', appendHeaders))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                accept: 'text/html,text/plain'
            })));

    test('returns header with override mode', () =>
        mr.make().pipe(
            mr.header('accept', 'text/html'),
            mr.header('accept', 'application/json'),
            mr.header('accept', 'text/plain', overrideHeaders))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({ accept: 'text/plain' })));

    test('returns header with custom seprator', () =>
        mr.make().pipe(
            mr.header('accept', 'text/html'),
            mr.header('accept', 'text/plain', { append: true, separator: '||', override: false }))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({ accept: 'text/html||text/plain' })));

    test('returns header with mixed combinations', () =>
        mr.make().pipe(
            mr.header('accept', 'text/html'),
            mr.header('accept', 'text/plain', { append: true, override: false }),
            mr.header('x-range', 'items=10'),
            mr.header('x-range', 'items=30'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                'accept': 'text/html,text/plain',
                'x-range': 'items=30'
            })));
});


describe('headers() function', () => {

    test('returns headers object by reducing over a list', () =>
        mr.make().pipe(
            mr.headers([
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
        mr.make().pipe(
            mr.location('http://example.com/redirect-path'))
            .toPromise()
            .then((x) => expect(x.headers).toEqual({
                location: 'http://example.com/redirect-path'
            })));

    test('handle multiple location headers', () =>
            mr.make().pipe(
                mr.location('http://example.com/redirect-path'),
                mr.location('http://example.com/redirect-path-new'))
                .toPromise()
                .then((x) => expect(x.headers).toEqual({
                    location: 'http://example.com/redirect-path-new'
                })));
});
