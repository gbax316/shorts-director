import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, useFx } from './util';

// "3 of 5": an honest progress marker for a short built from parts (facts, steps, reasons). It tells
// the viewer how far they are and that more is coming, which a fake progress bar only pretends to.
// Runs for the whole short; `at` lists the frame each part starts.
export type StepCounterProps = { at: number[]; label?: string; ground?: Ground; overPicture?: boolean };

export const StepCounter: React.FC<StepCounterProps> = ({ at, label = '', ground, overPicture }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const i = at.reduce((k, a, n) => (f >= a ? n : k), -1);
  if (i < 0) return null;
  const pop = EASE_OUT(prog(f, at[i], at[i] + 8));
  const bg = overPicture ? 'rgba(8,12,18,0.6)' : fx.panel;
  const ink = overPicture ? '#FFFFFF' : fx.text;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: FX_BOX.top, left: FX_BOX.left, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderRadius: 999, background: bg, transform: `scale(${0.9 + 0.1 * pop})`, transformOrigin: '0 50%' }}>
        <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, color: fx.accent }}>{i + 1}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 26, color: ink, opacity: 0.8 }}>of {at.length}{label ? ` ${label}` : ''}</span>
        <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>
          {at.map((_, n) => <div key={n} style={{ width: n === i ? 26 : 10, height: 10, borderRadius: 5, background: n <= i ? fx.accent : `${ink}44` }} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
