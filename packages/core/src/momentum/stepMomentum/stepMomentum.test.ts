import stepMomentum, { type StepMomentumConfig, type StepMomentumState } from './stepMomentum';

const baseConfig: StepMomentumConfig = {
  min: 0,
  max: 100,
  friction: 0.5,
};

describe('stepMomentum', () => {
  it('returns same state when dt <= 0', () => {
    const state: StepMomentumState = { position: 10, velocity: 5 };

    expect(stepMomentum(state, 0, baseConfig)).toEqual(state);
  });

  it('updates position and applies friction to velocity', () => {
    const state: StepMomentumState = { position: 0, velocity: 10 };
    const next = stepMomentum(state, 1, baseConfig);

    expect(next.position).toBe(10);
    expect(next.velocity).toBeCloseTo(5, 5);
  });

  it('clamps position to bounds and zeroes velocity when hitting min/max', () => {
    const state: StepMomentumState = { position: 95, velocity: 10 };
    const next = stepMomentum(state, 1, baseConfig);

    expect(next.position).toBe(100);
    expect(next.velocity).toBe(0);
  });
});
