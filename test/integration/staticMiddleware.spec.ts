import request, { Response } from 'supertest';

import { app } from './appIntegration';


describe('Static Middleware without fallthrough', () => {

    test('Return valid file', async () => {

        return request(app)
            .get('/public/test.html')
            .expect(200)
            .then((x: Response) =>
                expect(x.text).toEqual(expect.stringContaining('<h1>Hello world!!!</h1>')));
    });

    test('Return default reponse when invalid file', async () => {

        return request(app)
            .get('/public/test1.html')
            .expect(404)
            .then((x: Response) =>
                expect(x.text).toEqual(expect.stringMatching('<title>Error</title>')));
    });

});

describe('Static Middleware with fallthrough', () => {

    test('Return valid file', async () => {

        return request(app)
            .get('/public/fallthrough/test.html')
            .expect(200)
            .then((x: Response) =>
                expect(x.text).toEqual(expect.stringContaining('<h1>Hello world!!!</h1>')));
    });

    test('Return fallthrough reponse when invalid file', async () => {

        return request(app)
            .get('/public/fallthrough/test1.html')
            .expect(404)
            .then((x: Response) =>
                expect(x.text).toEqual(expect.stringMatching('fallthrough-response')));
    });

});


describe('File handler', () => {

    test('Return request file', async () => {

        return request(app)
            .get('/hello.txt')
            .expect(200)
            .then((x: Response) =>
                expect(x.text).toEqual(expect.stringMatching('Reply from File Handler')));
    });

    test('Return default reponse when invalid file', async () => {

        return request(app)
            .get('/hello-2.txt')
            .expect(404)
            .then((x: Response) => expect(x.text).toEqual(expect.stringMatching('<title>Error</title>')));
    });

});
