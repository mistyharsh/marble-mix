import request, { Response } from 'supertest';

import { app } from './cookieApp';

describe('Cookie parsing middleware - primary use cases', () => {

    test('Simple single cookie', () => {

        return request(app)
            .get('/cookie-path')
            .set('Cookie', 'hello=engineer')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => {
                expect(x).toEqual({ hello: 'engineer' });
            });
    });

    test('Multiple cookies', () => {

        return request(app)
            .get('/cookie-path')
            .set('Cookie', 'hello=engineer; world=welcome')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({ hello: 'engineer', world: 'welcome' }));
    });

    test('Multiple cookies with blank values', () => {

        return request(app)
            .get('/cookie-path')
            .set('Cookie', 'hello=engineer; world=; today=great')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({ hello: 'engineer', world: '', today: 'great' }));
    });

});

describe('Cookie parsing middleware - edge cases', () => {

    test('Empty state object for no cookies', () => {

        // Do not send cookie object
        return request(app)
            .get('/cookie-path')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({}));
    });

    test('Empty state object for empty cookies', () => {

        // Send cookie empty cookie header
        return request(app)
            .get('/cookie-path')
            .set('Cookie', '')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({}));
    });

    test('Handling weird white spaces', () => {

        // Send cookie empty cookie header
        return request(app)
            .get('/cookie-path')
            .set('Cookie', 'hello=engineer;   world    =        welcome')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({ hello: 'engineer', world: 'welcome' }));
    });
});

describe('Cookie parsing middleware - Negative tests', () => {

    // Middleware mode is `ignore`
    test('Swallow error on invalid cookie', () => {

        return request(app)
            .get('/cookie-path')
            .set('Cookie', 'invalid-cookie')
            .expect(200)
            .then((response: Response) => JSON.parse(response.body))
            .then((x: any) => expect(x).toEqual({}));
    });

    // Middleware mode is `error`
    test('Response 400 on invalid cookie', () => {

        return request(app)
            .get('/cookie-path-error')
            .set('Cookie', 'invalid-cookie')
            .expect(400);
    });

});
