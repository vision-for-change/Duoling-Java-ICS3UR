/**
 * Stadium sound, synthesized with the Web Audio API (no audio files): a crowd murmur that runs under
 * the match, cheers and groans, the kick, the whistle, footsteps, and a sound for every superpower.
 * Everything respects the Sound setting.
 */
import type { PowerKind } from '../data/stadium'
import { store } from '../state/store'

let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null
let crowd: { src: AudioBufferSourceNode; gain: GainNode; lfo: OscillatorNode } | null = null

function audio(): AudioContext | null {
  if (!store.getSnapshot().settings.sound) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function noiseBuffer(a: AudioContext): AudioBuffer {
  if (noise) return noise
  noise = a.createBuffer(1, a.sampleRate * 2, a.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return noise
}

/** A burst of filtered noise with an attack and a decay. */
function hiss(opts: { start?: number; dur: number; gain: number; type?: BiquadFilterType; freq: number; freqTo?: number; q?: number; attack?: number }) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + (opts.start ?? 0)
  const src = a.createBufferSource()
  src.buffer = noiseBuffer(a)
  src.loop = true
  const filter = a.createBiquadFilter()
  filter.type = opts.type ?? 'bandpass'
  filter.Q.value = opts.q ?? 0.8
  filter.frequency.setValueAtTime(opts.freq, t0)
  if (opts.freqTo) filter.frequency.exponentialRampToValueAtTime(opts.freqTo, t0 + opts.dur)
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + (opts.attack ?? 0.02))
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  src.connect(filter).connect(g).connect(a.destination)
  src.start(t0, Math.random())
  src.stop(t0 + opts.dur + 0.05)
}

function tone(opts: { start?: number; dur: number; freq: number; freqTo?: number; type?: OscillatorType; gain: number; vibrato?: number }) {
  const a = audio()
  if (!a) return
  const t0 = a.currentTime + (opts.start ?? 0)
  const osc = a.createOscillator()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(opts.freq, t0)
  if (opts.freqTo) osc.frequency.exponentialRampToValueAtTime(opts.freqTo, t0 + opts.dur)
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  if (opts.vibrato) {
    const lfo = a.createOscillator()
    const depth = a.createGain()
    lfo.frequency.value = opts.vibrato
    depth.gain.value = opts.freq * 0.04
    lfo.connect(depth).connect(osc.frequency)
    lfo.start(t0)
    lfo.stop(t0 + opts.dur + 0.05)
  }
  osc.connect(g).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + opts.dur + 0.05)
}

export const stadiumSound = {
  /** the crowd murmur under the whole match */
  startCrowd() {
    const a = audio()
    if (!a || crowd) return
    const src = a.createBufferSource()
    src.buffer = noiseBuffer(a)
    src.loop = true
    const band = a.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 650
    band.Q.value = 0.5
    const low = a.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 1600
    const gain = a.createGain()
    gain.gain.value = 0.028
    // the murmur swells and settles slowly, like a real crowd
    const lfo = a.createOscillator()
    const depth = a.createGain()
    lfo.frequency.value = 0.13
    depth.gain.value = 0.01
    lfo.connect(depth).connect(gain.gain)
    src.connect(band).connect(low).connect(gain).connect(a.destination)
    src.start()
    lfo.start()
    crowd = { src, gain, lfo }
  },
  stopCrowd() {
    if (!crowd) return
    try {
      crowd.src.stop()
      crowd.lfo.stop()
    } catch {
      // already stopped
    }
    crowd = null
  },
  cheer(strength = 1) {
    hiss({ dur: 2.2 * strength, gain: 0.11 * strength, freq: 900, q: 0.6, attack: 0.25 })
    hiss({ dur: 1.8 * strength, gain: 0.05 * strength, freq: 2200, q: 0.8, attack: 0.2, start: 0.05 })
  },
  groan() {
    hiss({ dur: 1.1, gain: 0.07, freq: 700, freqTo: 260, q: 0.7, attack: 0.15 })
  },
  kick() {
    tone({ dur: 0.16, freq: 140, freqTo: 48, gain: 0.42 })
    hiss({ dur: 0.05, gain: 0.08, freq: 2400, type: 'highpass' })
  },
  step() {
    hiss({ dur: 0.05, gain: 0.035, freq: 700, type: 'lowpass' })
  },
  whistle(blasts = 1) {
    for (let i = 0; i < blasts; i++) tone({ start: i * 0.42, dur: i === blasts - 1 ? 0.6 : 0.3, freq: 2900, type: 'sine', gain: 0.07, vibrato: 32 })
  },
  shatter() {
    for (let i = 0; i < 5; i++) hiss({ start: i * 0.035, dur: 0.12, gain: 0.07, freq: 3500 + i * 600, type: 'highpass' })
  },
  net() {
    hiss({ dur: 0.45, gain: 0.06, freq: 1200, q: 0.4, attack: 0.04 })
  },
  power(kind: PowerKind) {
    switch (kind) {
      case 'firewall':
        hiss({ dur: 0.9, gain: 0.09, freq: 300, freqTo: 2200, q: 0.9, attack: 0.1 })
        tone({ dur: 0.7, freq: 70, freqTo: 55, type: 'sawtooth', gain: 0.05 })
        break
      case 'speed':
        hiss({ dur: 0.35, gain: 0.1, freq: 900, freqTo: 5000, type: 'highpass', attack: 0.03 })
        break
      case 'ice':
        ;[3100, 3900, 2600, 4400].forEach((f, i) => tone({ start: i * 0.06, dur: 0.25, freq: f, gain: 0.04 }))
        hiss({ start: 0.15, dur: 0.18, gain: 0.07, freq: 4000, type: 'highpass' })
        break
      case 'teleport':
        ;[1400, 1000, 700, 1800].forEach((f, i) => tone({ start: i * 0.05, dur: 0.07, freq: f, type: 'square', gain: 0.035 }))
        break
      case 'gravity':
        tone({ dur: 1.0, freq: 220, freqTo: 55, type: 'sine', gain: 0.12, vibrato: 6 })
        break
      case 'magnet':
        tone({ dur: 0.8, freq: 90, type: 'sawtooth', gain: 0.05, vibrato: 14 })
        break
      case 'quake':
        tone({ dur: 0.9, freq: 52, freqTo: 34, type: 'sine', gain: 0.3 })
        hiss({ dur: 0.9, gain: 0.12, freq: 180, type: 'lowpass', attack: 0.01 })
        break
      case 'shield':
        tone({ dur: 0.6, freq: 520, freqTo: 980, type: 'triangle', gain: 0.06 })
        hiss({ dur: 0.3, gain: 0.05, freq: 3000, type: 'highpass', start: 0.1 })
        break
    }
  },
}
