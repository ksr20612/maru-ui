export interface StepMomentumState {
  position: number;
  velocity: number;
}

export interface StepMomentumConfig {
  min: number;
  max: number;
  friction: number;
}

export default function stepMomentum(
  { position, velocity }: StepMomentumState,
  dt: number,
  { min, max, friction }: StepMomentumConfig,
): StepMomentumState {
  if (dt <= 0) return { position, velocity };

  if (min > max) {
    [min, max] = [max, min];
  }

  const nextRaw = position + velocity * dt;
  let clamped = false;
  let next = nextRaw;

  if (next < min) {
    next = min;
    clamped = true;
  } else if (next > max) {
    next = max;
    clamped = true;
  }

  velocity *= friction;

  if (clamped) velocity = 0;

  return { position: next, velocity };
}
