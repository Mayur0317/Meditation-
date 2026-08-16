/**
 * High-fidelity Web Audio API Acoustic Synthesizer for Meditation
 * Simulates physical acoustic Tibetan singing bowls, gongs, tingsha,
 * binaural meditation waves, and organic ambient noise.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Active ambient noise sources
  private rainSource: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private hissSource: AudioNode | null = null;
  private hissGain: GainNode | null = null;
  private droneOscLeft: OscillatorNode | null = null;
  private droneOscRight: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Strike a Tibetan Singing Bowl with physical non-integer harmonic overtones
   * @param fundamentalFreq Hz (e.g. 216Hz, 432Hz, 528Hz)
   * @param intensity 0.1 to 1.0
   */
  public playSingingBowl(fundamentalFreq: number = 432, intensity: number = 0.8) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Harmonic overtone ratios typical of hand-hammered Tibetan bronze alloy
    const overtones = [
      { ratio: 1.00, amp: 1.0, decay: 7.0 },
      { ratio: 2.76, amp: 0.65, decay: 5.5 },
      { ratio: 5.40, amp: 0.35, decay: 4.2 },
      { ratio: 8.93, amp: 0.18, decay: 2.8 },
      { ratio: 11.20, amp: 0.08, decay: 1.8 }
    ];

    // Create subtle LFO for bowl wobble / acoustic pulsation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 1.8; // 1.8 Hz pulsing
    lfoGain.gain.value = 3.0; // +/- 3 Hz wobble
    lfo.start(now);
    lfo.stop(now + 8.0);

    const bowlMaster = this.ctx.createGain();
    bowlMaster.gain.setValueAtTime(0.4 * intensity, now);
    bowlMaster.connect(this.masterGain);

    overtones.forEach(ot => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamentalFreq * ot.ratio, now);
      lfoGain.connect(osc.frequency);

      // Acoustic envelope: fast attack, organic exponential resonance decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(ot.amp * intensity, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + ot.decay);

      osc.connect(gain);
      gain.connect(bowlMaster);

      osc.start(now);
      osc.stop(now + ot.decay + 0.1);
    });
  }

  /**
   * Deep Ashram Temple Gong strike
   */
  public playTempleGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const baseFreq = 86.4; // Deep 86.4Hz sacred frequency

    const freqs = [
      { f: baseFreq, gain: 0.7, decay: 9.0 },
      { f: baseFreq * 1.48, gain: 0.5, decay: 7.0 },
      { f: baseFreq * 2.14, gain: 0.35, decay: 5.5 },
      { f: baseFreq * 3.25, gain: 0.2, decay: 4.0 },
      { f: baseFreq * 4.8, gain: 0.1, decay: 2.5 }
    ];

    freqs.forEach(item => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(item.gain * 0.4, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + item.decay);

      osc.connect(g);
      g.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + item.decay + 0.1);
    });
  }

  /**
   * Tibetan Tingsha Cymbal (Crisp high brass prayer bell)
   */
  public playTingsha() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const bellFreqs = [2048, 2056, 3072, 4096]; // Slight detuning creates bell shimmer

    bellFreqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 4.6);
    });
  }

  /**
   * Mala Wooden Bead Tactile Click Sound
   */
  public playMalaClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    // Sandalwood pitch drop
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Japanese Bamboo Water Fountain Drop (Shishi-odoshi)
   */
  public playWaterDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Continuous Analog Tape Hiss & Warmth Generator
   */
  public setTapeHiss(volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (volume <= 0) {
      if (this.hissGain && this.ctx) {
        this.hissGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    if (!this.hissSource) {
      // Create white noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for analog CrO2 cassette tape hiss profile
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 4200;
      bandpass.Q.value = 0.8;

      this.hissGain = this.ctx.createGain();
      this.hissGain.gain.value = 0;

      whiteNoise.connect(bandpass);
      bandpass.connect(this.hissGain);
      this.hissGain.connect(this.masterGain);

      whiteNoise.start();
      this.hissSource = whiteNoise;
    }

    if (this.hissGain && this.ctx) {
      this.hissGain.gain.setTargetAtTime(volume * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Continuous Mountain Rain Ambient Generator
   */
  public setMonsoonRain(volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (volume <= 0) {
      if (this.rainGain && this.ctx) {
        this.rainGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    if (!this.rainSource) {
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      // Pink/Brown noise for deep soothing rain
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const rainNoise = this.ctx.createBufferSource();
      rainNoise.buffer = noiseBuffer;
      rainNoise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1100;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.value = 0;

      rainNoise.connect(lowpass);
      lowpass.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);

      rainNoise.start();
      this.rainSource = rainNoise;
    }

    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(volume * 0.25, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Binaural Theta Wave Drone (108Hz / 114Hz - 6Hz brainwave entrainment)
   */
  public setBinauralDrone(volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (volume <= 0) {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      return;
    }

    if (!this.droneOscLeft) {
      this.droneOscLeft = this.ctx.createOscillator();
      this.droneOscRight = this.ctx.createOscillator();

      const merger = this.ctx.createChannelMerger(2);
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0;

      // 108Hz left ear, 114Hz right ear -> 6Hz Theta frequency
      this.droneOscLeft.type = 'sine';
      this.droneOscLeft.frequency.value = 108.0;

      this.droneOscRight.type = 'sine';
      this.droneOscRight.frequency.value = 114.0;

      this.droneOscLeft.connect(merger, 0, 0);
      this.droneOscRight.connect(merger, 0, 1);

      merger.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOscLeft.start();
      this.droneOscRight.start();
    }

    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(volume * 0.22, this.ctx.currentTime, 0.2);
    }
  }
}

export const soundEngine = new SoundEngine();
