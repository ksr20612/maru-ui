import type { VelocitySample } from '../velocity.types';

export default function buildVelocitySample(time: number, value: number): VelocitySample {
  return { time, value };
}
