import { Easing, interpolate } from 'remotion';
import { loadFont as loadGeist } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif';

const geist = loadGeist('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });
const geistMono = loadGeistMono('normal', { weights: ['400'], subsets: ['latin'] });
const serif = loadSerif('normal', { weights: ['400'], subsets: ['latin'] });
const serifItalic = loadSerif('italic', { weights: ['400'], subsets: ['latin'] });

export const FONT = {
  serif: serif.fontFamily,
  serifItalic: serifItalic.fontFamily,
  sans: geist.fontFamily,
  mono: geistMono.fontFamily,
  // the "AI default" mock is meant to look generic
  generic: 'Arial, Helvetica, sans-serif',
};

export const C = {
  navy: '#0C1622',
  ink: '#0B0D10',
  gold: '#F2B21B',
  orange: '#E8792A',
  cream: '#F3EFE8',
  creamDim: 'rgba(243,239,232,0.72)',
  line: 'rgba(243,239,232,0.12)',
  navyLift: '#132132',
  navyDeep: '#08101A',
  // AI default mock
  purple: '#6D28D9',
  blue: '#3B82F6',
  // states
  red: '#E5484D',
  redDeep: '#3A1416',
  green: '#30A46C',
  greenDeep: '#0F2A1E',
};

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

// Easing vocabulary, used everywhere so the film moves with one hand.
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out: entrances
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera moves, morphs
  in: Easing.bezier(0.7, 0, 0.84, 0), // exits
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0..1 progress between two frames with an easing curve. */
export const prog = (frame: number, from: number, to: number, ease: (t: number) => number = E.out) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Mix two hex colours. */
export const mixColor = (a: string, b: string, t: number) => {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(mix(v, pb[i], t)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const hex = (h: string) => {
  const v = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};
