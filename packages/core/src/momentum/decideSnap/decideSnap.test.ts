import decideSnap, { type DecideSnapConfig, type DecideSnapOptions } from './decideSnap';

const baseConfig: DecideSnapConfig = {
  nearZeroVelocity: 0.2,
  snapVelocityThreshold: 0.04,
  boundaryPx: 4,
};

function makeOptions(partial: Partial<DecideSnapOptions>): DecideSnapOptions {
  return {
    position: 0,
    velocity: 0,
    itemHeight: 50,
    length: 10,
    config: baseConfig,
    ...partial,
  };
}

describe('decideSnap', () => {
  it('snaps when velocity is near zero and near boundary', () => {
    const result = decideSnap(
      makeOptions({
        position: 101, // near 100
        velocity: 0.1,
      }),
    );

    expect(result.shouldSnap).toBe(true);
  });

  it('snaps when velocity is slow enough even if not near boundary', () => {
    const result = decideSnap(
      makeOptions({
        position: 120,
        velocity: 0.03,
      }),
    );

    expect(result.shouldSnap).toBe(true);
  });

  it('does not snap when fast and far from boundary', () => {
    const result = decideSnap(
      makeOptions({
        position: 120,
        velocity: 1,
      }),
    );

    expect(result.shouldSnap).toBe(false);
  });
});
