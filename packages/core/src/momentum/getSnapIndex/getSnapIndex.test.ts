import getSnapIndex from './getSnapIndex';

describe('getSnapIndex', () => {
  it('returns 0 when length or itemHeight is non-positive', () => {
    expect(getSnapIndex({ position: 100, itemHeight: 0, length: 10 })).toBe(0);
    expect(getSnapIndex({ position: 100, itemHeight: 10, length: 0 })).toBe(0);
  });

  it('rounds position to nearest index and clamps within range', () => {
    expect(getSnapIndex({ position: 25, itemHeight: 10, length: 5 })).toBe(3);
    expect(getSnapIndex({ position: -5, itemHeight: 10, length: 5 })).toBe(0);
    expect(getSnapIndex({ position: 1000, itemHeight: 10, length: 5 })).toBe(4);
  });
});
