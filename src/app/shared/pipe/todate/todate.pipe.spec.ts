import { ToDatePipe } from './todate.pipe';

describe('ToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
