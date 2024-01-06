import { DelayPipe } from './delay.pipe';

describe('DelayPipe', () => {
  it('create an instance', () => {
    const pipe = new DelayPipe();
    expect(pipe).toBeTruthy();
  });
});
