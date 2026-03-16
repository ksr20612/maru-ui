import type { DecideSnapConfig } from './decideSnap/decideSnap';

export interface VelocitySample {
  time: number;
  value: number;
}

export interface MomentumEngineConfig extends DecideSnapConfig {
  min: number;
  max: number;
  friction: number;
  itemHeight: number;
  length: number;
  maxVelocity: number;
  sampleWindowMs?: number;
}

export interface MomentumEngineState {
  position: number;
  velocity: number;
}

export interface MomentumStepResult extends MomentumEngineState {
  shouldSnap: boolean;
  snapIndex: number;
  snapPosition: number;
  distance: number;
  isRunning: boolean;
  isSnapping: boolean;
}
