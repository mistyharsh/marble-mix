import { redirect } from '../src/index';

test('Should return 302 as status code', () => {

    // 1. Setup data
    const redirectUrl = 'http://example.com';

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const response = redirect(redirectUrl);

    // 4. Verify behaviour
    expect(response.status).toEqual(302);
    expect(response.headers).toMatchObject({ location: redirectUrl });

    // 5. Teardown (N/A)
});


test('Should return 303 as status code if writable redirect', () => {

    // 1. Setup data
    const redirectUrl = 'http://example.com';

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const response = redirect.temporary(redirectUrl);

    // 4. Verify behaviour
    expect(response.status).toEqual(303);
    expect(response.headers).toMatchObject({ location: redirectUrl });

    // 5. Teardown (N/A)

});


test('Should return 307 as status code for temporary redirect if nonwritable redirect', () => {

    // 1. Setup data
    const redirectUrl = 'http://example.com';

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const response = redirect.temporary(redirectUrl, false);

    // 4. Verify behaviour
    expect(response.status).toEqual(307);
    expect(response.headers).toMatchObject({ location: redirectUrl });

    // 5. Teardown (N/A)
});


test('Should return 301 as status code if writable redirect', () => {

    // 1. Setup data
    const redirectUrl = 'http://example.com';

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const response = redirect.permanent(redirectUrl);

    // 4. Verify behaviour
    expect(response.status).toEqual(301);
    expect(response.headers).toMatchObject({ location: redirectUrl });

    // 5. Teardown (N/A)

});


test('Should return 308 as status code if nonwritable redirect', () => {

    // 1. Setup data
    const redirectUrl = 'http://example.com';

    // 2. Setup data - mocks (N/A)

    // 3. SUT - System Under Test
    const response = redirect.permanent(redirectUrl, false);

    // 4. Verify behaviour
    expect(response.status).toEqual(308);
    expect(response.headers).toMatchObject({ location: redirectUrl });

    // 5. Teardown (N/A)

});
