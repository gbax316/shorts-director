// Shared timing helpers for the effects library. Every effect reads its own local frame
// (place it inside a <Sequence>), and every "at" in an effect's props is in frames from
// that effect's start, so a beat can be re-timed by moving the Sequence alone.
import type { CSSProperties } from 'react';
import { EASE_OUT, prog } from '../shorts';

export const appear = (f: number, at: number, dur = 12) => EASE_OUT(prog(f, at, at + dur));

// fade and lift in from `px` below, starting at frame `at`
export const rise = (f: number, at: number, px = 28, dur = 14): CSSProperties => {
  const t = appear(f, at, dur);
  return { opacity: t, transform: `translateY(${(1 - t) * px}px)` };
};

// fade out over the last `dur` frames of an effect that lasts `len` frames
export const tail = (f: number, len: number, dur = 10) => 1 - prog(f, len - dur, len);

// a number counting up from 0 to `to` between frames a and b, formatted by `fmt`
export const countUp = (f: number, a: number, b: number, to: number, fmt: (n: number) => string = (n) => Math.round(n).toLocaleString('en-GB')) =>
  fmt(to * EASE_OUT(prog(f, a, b)));
