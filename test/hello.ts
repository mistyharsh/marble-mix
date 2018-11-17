import { printAPIEffects } from '../src/effectLogger';

test('adds 1 + 2 to equal 3', () => {
    console.log(printAPIEffects);
    expect(3).toBe(3);
});