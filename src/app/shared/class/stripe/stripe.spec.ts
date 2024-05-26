import { Stripe } from './stripe';

describe('Stripe', () => {
  it('should create an instance', () => {
    expect(new Stripe()).toBeTruthy();
  });
});
