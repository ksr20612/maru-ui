import getClampedPosition from './getClampedPosition';

describe('getClampedPosition', () => {
  it('returns position when it is within bounds', () => {
    const result = getClampedPosition({ position: 5, min: 0, max: 10 });

    expect(result).toBe(5);
  });

  it('clamps to min when position is below min', () => {
    const result = getClampedPosition({ position: -5, min: 0, max: 10 });

    expect(result).toBe(0);
  });

  it('clamps to max when position is above max', () => {
    const result = getClampedPosition({ position: 20, min: 0, max: 10 });

    expect(result).toBe(10);
  });

  it('handles min > max by swapping', () => {
    const result = getClampedPosition({ position: 5, min: 10, max: 0 });

    expect(result).toBe(5);
  });
});
