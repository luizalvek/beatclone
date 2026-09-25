// Web Audio Synth Engine for Beatfy

let audioCtx: AudioContext | null = null;
let currentSynth: { stop: () => void; analyser: AnalyserNode } | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSynthBeat(style: 'travis' | 'drake' | 'metro'): { stop: () => void; analyser: AnalyserNode } {
  // Stop existing synth if any
  if (currentSynth) {
    currentSynth.stop();
  }

  const ctx = getAudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 128;
  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0.3, ctx.currentTime); // Safe volume
  mainGain.connect(analyser);
  analyser.connect(ctx.destination);

  let isPlaying = true;
  const nodes: AudioNode[] = [];
  const intervals: any[] = [];

  // Helper to schedule synthetic kick drum
  const playKick = (time: number) => {
    if (!isPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(mainGain);

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.start(time);
    osc.stop(time + 0.22);
    nodes.push(osc, gain);
  };

  // Helper to schedule synthetic hi-hat
  const playHihat = (time: number, accent = false) => {
    if (!isPlaying) return;
    // Create white noise hi-hat
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.15 : 0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(mainGain);

    noise.start(time);
    noise.stop(time + 0.05);
    nodes.push(noise, filter, gain);
  };

  // Helper for snare/clap
  const playClap = (time: number) => {
    if (!isPlaying) return;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(mainGain);

    noise.start(time);
    noise.stop(time + 0.15);
    nodes.push(noise, filter, gain);
  };

  // Scheduler loop
  let step = 0;
  const tempo = style === 'travis' ? 130 : style === 'drake' ? 95 : 140; // BPM
  const stepDuration = 60 / tempo / 2; // Eighth notes

  const scheduleNextBeats = () => {
    const lookAhead = 0.3; // schedule ahead
    let scheduleTime = ctx.currentTime;

    const intervalId = setInterval(() => {
      if (!isPlaying) {
        clearInterval(intervalId);
        return;
      }

      while (scheduleTime < ctx.currentTime + lookAhead) {
        // Core Rhythms
        if (style === 'travis') {
          // Travis Scott Dark Trap: Kick on 0, Snare on 4, Double kick on 6
          const gridStep = step % 8;
          if (gridStep === 0 || gridStep === 5) playKick(scheduleTime);
          if (gridStep === 4) playClap(scheduleTime);
          // Fast hi-hats
          if (step % 2 === 0) playHihat(scheduleTime, gridStep === 0);
          if (step % 3 === 0) playHihat(scheduleTime + stepDuration / 2, false); // rolls

          // Atmosphere synth chord (spacey, dark)
          if (step % 16 === 0) {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const synthGain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'triangle';

            // minor chord: root A (220Hz), C (261.63Hz), E (329.63Hz)
            const rootFreq = 110; // low A
            osc1.frequency.setValueAtTime(rootFreq * 2, scheduleTime);
            osc2.frequency.setValueAtTime(rootFreq * 2 * 1.5, scheduleTime); // Fifth

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, scheduleTime);
            filter.frequency.exponentialRampToValueAtTime(1200, scheduleTime + 1.2);
            filter.frequency.exponentialRampToValueAtTime(400, scheduleTime + 2.4);

            synthGain.gain.setValueAtTime(0, scheduleTime);
            synthGain.gain.linearRampToValueAtTime(0.2, scheduleTime + 0.4);
            synthGain.gain.exponentialRampToValueAtTime(0.001, scheduleTime + 3.0);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(synthGain);
            synthGain.connect(mainGain);

            osc1.start(scheduleTime);
            osc2.start(scheduleTime);
            osc1.stop(scheduleTime + 3.1);
            osc2.stop(scheduleTime + 3.1);
            nodes.push(osc1, osc2, filter, synthGain);
          }
        } 
        else if (style === 'drake') {
          // Drake Style: Smooth R&B / Moody
          const gridStep = step % 8;
          if (gridStep === 0) playKick(scheduleTime);
          if (gridStep === 4) playClap(scheduleTime);
          if (gridStep === 6) playHihat(scheduleTime, true);

          // Atmospheric moody electric piano chords
          if (step % 16 === 0) {
            const chord = [261.63, 311.13, 392.00, 466.16]; // Cm7 chord: C, Eb, G, Bb
            chord.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, scheduleTime);

              // gentle velocity strike
              gainNode.gain.setValueAtTime(0, scheduleTime);
              gainNode.gain.linearRampToValueAtTime(0.06, scheduleTime + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.001, scheduleTime + 3.5);

              osc.connect(gainNode);
              gainNode.connect(mainGain);

              osc.start(scheduleTime);
              osc.stop(scheduleTime + 3.6);
              nodes.push(osc, gainNode);
            });
          }
        } 
        else if (style === 'metro') {
          // Metro Boomin: Dark, cinematic, orchestral trap
          const gridStep = step % 8;
          if (gridStep === 0 || gridStep === 3) playKick(scheduleTime);
          if (gridStep === 4) playClap(scheduleTime);
          // Continuous rolling hihats
          playHihat(scheduleTime, gridStep === 0 || gridStep === 4);
          if (step % 2 === 1) {
            playHihat(scheduleTime, false);
          }

          // Sinister minor-key brass stabs
          if (step % 8 === 0) {
            const brassFreqs = [146.83, 220.00, 293.66, 349.23]; // D minor stabs: D3, A3, D4, F4
            brassFreqs.forEach((freq) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              const filter = ctx.createBiquadFilter();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, scheduleTime);

              filter.type = 'peaking';
              filter.frequency.setValueAtTime(800, scheduleTime);
              filter.Q.setValueAtTime(3, scheduleTime);

              gainNode.gain.setValueAtTime(0, scheduleTime);
              gainNode.gain.linearRampToValueAtTime(0.12, scheduleTime + 0.02);
              gainNode.gain.exponentialRampToValueAtTime(0.001, scheduleTime + 0.8);

              osc.connect(filter);
              filter.connect(gainNode);
              gainNode.connect(mainGain);

              osc.start(scheduleTime);
              osc.stop(scheduleTime + 0.9);
              nodes.push(osc, filter, gainNode);
            });
          }
        }

        scheduleTime += stepDuration;
        step++;
      }
    }, 100);

    intervals.push(intervalId);
  };

  scheduleNextBeats();

  const stop = () => {
    isPlaying = false;
    intervals.forEach(clearInterval);
    nodes.forEach((n) => {
      try {
        (n as any).stop();
      } catch (e) {}
    });
    mainGain.disconnect();
  };

  currentSynth = { stop, analyser };
  return { stop, analyser };
}

export function stopAllSynths() {
  if (currentSynth) {
    currentSynth.stop();
    currentSynth = null;
  }
}
