import { useEffect, useRef } from 'react';
import { MomentumEngine } from '@maru-ui/core';

import type {
  MomentumEngineConfig,
  MomentumEngineState,
  MomentumStepResult,
  VelocitySample,
} from '@maru-ui/core';

export interface UseMomentumConfig extends MomentumEngineConfig {}

export interface UseMomentumReturn {
  pushSample: (sample: VelocitySample) => void;
  clearSamples: () => void;
  getVelocityFromSamples: () => number;
  start: (state: MomentumEngineState) => void;
  step: (dt: number) => MomentumStepResult;
  stop: () => void;
  isRunning: () => boolean;
}

export default function useMomentum(config: UseMomentumConfig): UseMomentumReturn {
  const engineRef = useRef<MomentumEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new MomentumEngine(config);
  }

  useEffect(() => {
    engineRef.current?.configure(config);
  }, [
    config.min,
    config.max,
    config.friction,
    config.itemHeight,
    config.length,
    config.nearZeroVelocity,
    config.snapVelocityThreshold,
    config.boundaryPx,
    config.maxVelocity,
    config.sampleWindowMs,
  ]);

  return {
    pushSample: (sample) => engineRef.current?.pushSample(sample),
    clearSamples: () => engineRef.current?.clearSamples(),
    getVelocityFromSamples: () => engineRef.current?.getVelocityFromSamples() ?? 0,
    start: (state) => engineRef.current?.start(state),
    step: (dt) => engineRef.current?.step(dt) as MomentumStepResult,
    stop: () => engineRef.current?.stop(),
    isRunning: () => engineRef.current?.isRunning() ?? false,
  };
}

