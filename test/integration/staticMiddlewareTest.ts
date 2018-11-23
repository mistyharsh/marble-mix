import request, { Response } from 'supertest';

import { app } from './appIntegration';

test('Simple Middleware Test', async () => {

    return request(app)
        .get('/public/test.html')
        .then((x: Response) => {
            // TODO: Pending work
        });

});
