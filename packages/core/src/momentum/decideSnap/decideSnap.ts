import getSnapIndex from '../getSnapIndex/getSnapIndex';

export interface DecideSnapConfig {
  nearZeroVelocity: number;
  snapVelocityThreshold: number;
  boundaryPx: number;
}

export interface DecideSnapOptions {
  position: number;
  velocity: number;
  itemHeight: number;
  length: number;
  config: DecideSnapConfig;
}

export interface DecideSnapResult {
  shouldSnap: boolean;
  snapIndex: number;
  snapPosition: number;
  distance: number;
}

export default function decideSnap({
  position,
  velocity,
  itemHeight,
  length,
  config,
}: DecideSnapOptions): DecideSnapResult {
  const snapIndex = getSnapIndex({ position, itemHeight, length });
  const snapPosition = snapIndex * itemHeight;
  const distance = Math.abs(position - snapPosition);

  const absVelocity = Math.abs(velocity);
  const isNearZeroVelocity = absVelocity <= config.nearZeroVelocity;
  const isSlowEnough = absVelocity <= config.snapVelocityThreshold;
  const isNearBoundary = distance <= config.boundaryPx;

  const shouldSnap = (isNearZeroVelocity && isNearBoundary) || isSlowEnough;

  return {
    shouldSnap,
    snapIndex,
    snapPosition,
    distance,
  };
}

