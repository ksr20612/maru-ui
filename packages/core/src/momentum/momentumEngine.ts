import calculateVelocity from './calculateVelocity/calculateVelocity';
import decideSnap from './decideSnap/decideSnap';
import type {
  MomentumEngineConfig,
  MomentumEngineState,
  MomentumStepResult,
  VelocitySample,
} from './momentum.types';
import stepMomentum from './stepMomentum/stepMomentum';

export default class MomentumEngine {
  private config: MomentumEngineConfig;
  private state: MomentumEngineState = { position: 0, velocity: 0 };
  private samples: VelocitySample[] = [];
  private running = false;
  private snapping = false;

  constructor(config: MomentumEngineConfig) {
    this.config = {
      ...config,
      sampleWindowMs: config.sampleWindowMs ?? 100,
    };
  }

  configure(partial: Partial<MomentumEngineConfig>) {
    this.config = { ...this.config, ...partial };
  }

  pushSample(sample: VelocitySample) {
    const now = sample.time;
    const sampleWindowMs = this.config.sampleWindowMs ?? 100;

    this.samples = [...this.samples.filter((s) => now - s.time <= sampleWindowMs), sample];
  }

  clearSamples() {
    this.samples = [];
  }

  getVelocityFromSamples() {
    return calculateVelocity(this.samples, { maxVelocity: this.config.maxVelocity });
  }

  start(state: MomentumEngineState) {
    this.state = state;
    this.running = true;
    this.snapping = false;
  }

  stop() {
    this.running = false;
  }

  isRunning() {
    return this.running;
  }

  step(dt: number): MomentumStepResult {
    const next = stepMomentum(this.state, dt, {
      min: this.config.min,
      max: this.config.max,
      friction: this.config.friction,
    });
    this.state = next;

    const snap = decideSnap({
      position: next.position,
      velocity: next.velocity,
      itemHeight: this.config.itemHeight,
      length: this.config.length,
      config: {
        nearZeroVelocity: this.config.nearZeroVelocity,
        snapVelocityThreshold: this.config.snapVelocityThreshold,
        boundaryPx: this.config.boundaryPx,
      },
    });

    if (snap.shouldSnap) {
      this.running = false;
      this.snapping = true;
    }

    return {
      ...next,
      ...snap,
      isRunning: this.running,
      isSnapping: this.snapping,
    };
  }
}
