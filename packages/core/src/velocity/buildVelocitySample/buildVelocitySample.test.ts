import { describe, expect, it } from 'vitest';
import buildVelocitySample from './buildVelocitySample';

describe('buildVelocitySample', () => {
  it('builds a VelocitySample with given time and value', () => {
    const sample = buildVelocitySample(100, 42);

    expect(sample).toEqual({ time: 100, value: 42 });
  });

  it('allows zero and negative values', () => {
    expect(buildVelocitySample(0, 0)).toEqual({ time: 0, value: 0 });
    expect(buildVelocitySample(200, -10)).toEqual({ time: 200, value: -10 });
  });
});

