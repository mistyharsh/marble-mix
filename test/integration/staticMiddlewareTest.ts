import request, { Response } from 'supertest';

import { app } from './appIntegration';

test('Simple Middleware Test', async () => {

    return request(app)
        .get('/public/test1.html')
        .then((x: Response) => {
            console.log(x.text);
            // TODO: Pending work
        });

});
