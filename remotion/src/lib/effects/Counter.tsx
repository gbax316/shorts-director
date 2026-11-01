import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// A number that rolls like an odometer to its value, digit by digit, then holds: one figure that
// should land with weight (a price, a total, a count). Digits roll from the right, so the big
// places settle last. `prefix` and `suffix` carry the unit (₦, %, M).
export type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  source?: string;
  rollFrom?: number;
  rollTo?: number;
  len: number;
  ground?: Ground;
  overPicture?: boolean;
  top?: number;
  size?: number;
};

const Digit: React.FC<{ d: number; t: number; h: number }> = ({ d, t, h }) => {
  const pos = d * EASE_OUT(t) + (1 - EASE_OUT(t)) * 10 * 2; // spins down through extra turns before landing
  const y = -((pos % 10) * h);
  return (
    <span style={{ display: 'inline-block', height: h, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{ display: 'flex', flexDirection: 'column', transform: `translateY(${y}px)` }}>
        {Array.from({ length: 11 }, (_, i) => <span key={i} style={{ height: h, lineHeight: `${h}px` }}>{i % 10}</span>)}
      </span>
    </span>
  );
};

export const Counter: React.FC<CounterProps> = ({ to, prefix = '', suffix = '', label, source, rollFrom = 4, rollTo = 40, len, ground, overPicture, top = 620, size: maxSize = 190 }) => {
  let size = maxSize;
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const digits = Math.round(to).toLocaleString('en-GB').split('');
  // fit the number to the safe box: a long figure shrinks instead of wrapping
  const chars = digits.length + prefix.length + suffix.length;
  size = Math.min(size, Math.floor((FX_BOX.right - FX_BOX.left) / (chars * 0.66)));
  const ink = overPicture ? '#FFFFFF' : fx.text;
  let k = 0;
  const nDigits = digits.filter((c) => /\d/.test(c)).length;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: size, lineHeight: 1, color: fx.accent, textShadow: overPicture ? '0 6px 30px rgba(0,0,0,0.6)' : 'none', ...rise(f, 0, 20) }}>
          {prefix}
          {digits.map((c, i) => {
            if (!/\d/.test(c)) return <span key={i}>{c}</span>;
            const place = nDigits - 1 - k++;
            const end = rollTo - (nDigits - 1 - place) * 0 + place * 4; // higher places land later
            return <Digit key={i} d={Number(c)} t={prog(f, rollFrom, end)} h={size} />;
          })}
          {suffix}
        </div>
        {label ? <div style={{ marginTop: 18, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: ink, ...rise(f, rollTo - 6, 16) }}>{label}</div> : null}
        {source ? <div style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 26, color: overPicture ? 'rgba(255,255,255,0.75)' : fx.soft }}>Source: {source}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
