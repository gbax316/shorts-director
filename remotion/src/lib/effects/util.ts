// Shared timing helpers for the effects library. Every effect reads its own local frame
// (place it inside a <Sequence>), and every "at" in an effect's props is in frames from
// that effect's start, so a beat can be re-timed by moving the Sequence alone.
import type { CSSProperties } from 'react';
import { COLORS, useGround } from '../../brand';
import type { Ground } from '../../brand';
import { EASE_OUT, SAFE, prog } from '../shorts';

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

// ---- where effects may draw, and in which colours -------------------------------------
// Keep clear of the platform's buttons on the right (SAFE.right) and of the caption band:
// the skits and documentaries caption at y 1430 to 1450, so effects stay above FX_BOX.bottom.

export const FX_BOX = { left: SAFE.left + 10, right: 1080 - SAFE.right, top: SAFE.top + 70, bottom: 1380 } as const;

// Colours for an effect that draws its own panel, following the shot's ground (useGround)
// unless the effect is given one. Effects drawn over a picture (glass, spotlight, documentary)
// keep light text and do not need this.
export const useFx = (ground?: Ground) => {
  const shot = useGround(); // always called, so the hook order never changes
  const night = (ground ?? shot) === 'night';
  return night
    ? { night, panel: COLORS.navy, text: COLORS.onNight, soft: COLORS.onNightSoft, line: COLORS.lineNight, accent: COLORS.warn, onAccent: COLORS.night }
    : { night, panel: '#FFFFFF', text: COLORS.ink, soft: COLORS.muted, line: COLORS.line, accent: COLORS.accentOnDay, onAccent: '#FFFFFF' };
};
