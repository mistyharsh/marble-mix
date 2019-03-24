import request, { Response } from 'supertest';

import { server } from './appIntegration';


describe('GraphQL Playground middleware', () => {


    test('Return valid bootstrapping page', async () => {

        return request(server)
            .get('/gql')
            .expect(200)
            .then((x: Response) =>
                expect(x.type).toEqual('text/html'));

    });


});
