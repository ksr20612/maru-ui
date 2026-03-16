import type { VelocitySample } from '../momentum.types';

export interface CalculateVelocityOptions {
  maxVelocity?: number;
}

export default function calculateVelocity(
  samples: Array<VelocitySample>,
  options: CalculateVelocityOptions = {},
) {
  if (samples.length < 2) return 0;

  const first = samples[0];
  const last = samples[samples.length - 1];
  const time = last.time - first.time;
  const distance = last.value - first.value;

  if (time <= 0) return 0;

  const velocity = distance / time;

  return Math.max(
    -(options.maxVelocity ?? Number.POSITIVE_INFINITY),
    Math.min(options.maxVelocity ?? Number.POSITIVE_INFINITY, velocity),
  );
}

