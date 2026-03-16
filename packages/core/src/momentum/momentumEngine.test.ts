import { describe, expect, it } from 'vitest';
import MomentumEngine from './momentumEngine';

describe('MomentumEngine', () => {
  it('calculates velocity from pushed samples', () => {
    const engine = new MomentumEngine({
      min: 0,
      max: 100,
      friction: 0.95,
      itemHeight: 50,
      length: 10,
      nearZeroVelocity: 0.2,
      snapVelocityThreshold: 0.04,
      boundaryPx: 4,
      maxVelocity: 2,
    });

    engine.pushSample({ time: 0, value: 0 });
    engine.pushSample({ time: 100, value: 50 });

    expect(engine.getVelocityFromSamples()).toBeCloseTo(0.5, 5);
  });

  it('starts and steps momentum', () => {
    const engine = new MomentumEngine({
      min: 0,
      max: 1000,
      friction: 0.95,
      itemHeight: 50,
      length: 20,
      nearZeroVelocity: 0.2,
      snapVelocityThreshold: 0.04,
      boundaryPx: 4,
      maxVelocity: 2,
    });

    engine.start({ position: 0, velocity: 1 });
    const result = engine.step(16);

    expect(result.position).toBeGreaterThan(0);
    expect(result.isRunning).toBe(true);
  });
});
