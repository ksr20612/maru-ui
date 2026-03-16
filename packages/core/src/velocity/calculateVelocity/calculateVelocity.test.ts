import calculateVelocity from './calculateVelocity';
import type { VelocitySample } from '../velocity.types';

describe('calculateVelocity', () => {
  it('returns 0 when less than 2 samples are provided', () => {
    const samples: VelocitySample[] = [{ time: 0, value: 0 }];
    const result = calculateVelocity(samples, { maxVelocity: 100 });

    expect(result).toBe(0);
  });

  it('returns 0 when time difference is zero or negative', () => {
    const samples: VelocitySample[] = [
      { time: 1000, value: 0 },
      { time: 1000, value: 10 },
    ];
    const result = calculateVelocity(samples, { maxVelocity: 100 });

    expect(result).toBe(0);
  });

  it('computes positive velocity based on value delta over time', () => {
    const samples: VelocitySample[] = [
      { time: 0, value: 0 },
      { time: 100, value: 50 },
    ];
    const result = calculateVelocity(samples);

    expect(result).toBeCloseTo(0.5, 5);
  });

  it('computes negative velocity when value decreases', () => {
    const samples: VelocitySample[] = [
      { time: 0, value: 100 },
      { time: 200, value: 50 },
    ];
    const result = calculateVelocity(samples);

    expect(result).toBeCloseTo(-0.25, 5);
  });

  it('clamps velocity to maxVelocity', () => {
    const samples: VelocitySample[] = [
      { time: 0, value: 0 },
      { time: 1, value: 1000 },
    ];
    const result = calculateVelocity(samples, { maxVelocity: 2 });
    expect(result).toBe(2);
  });

  it('clamps velocity to -maxVelocity', () => {
    const samples: VelocitySample[] = [
      { time: 0, value: 0 },
      { time: 1, value: -1000 },
    ];
    const result = calculateVelocity(samples, { maxVelocity: 2 });

    expect(result).toBe(-2);
  });
});
