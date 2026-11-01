import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_EDITORIAL } from '../../fonts';
import { prog } from '../shorts';
import { FX_BOX, tail, useFx } from './util';

// The first two seconds: a few words slam in one at a time with a small overshoot, the key word
// in the accent colour. For the hook only, and only words the voice is saying at that moment,
// so the eye and ear land together. words[].at is when each word hits.
export type HookTextProps = {
  words: { text: string; at: number; key?: boolean }[];
  len: number;
  ground?: Ground;
  overPicture?: boolean; // white text with a shadow, over a plate or clip
  top?: number;
  size?: number;
};

// a quick scale that overshoots and settles: 0 -> 1.18 -> 1
const slam = (f: number, at: number) => {
  const t = prog(f, at, at + 9);
  return t <= 0 ? 0 : t < 0.6 ? (t / 0.6) * 1.18 : 1.18 - (0.18 * (t - 0.6)) / 0.4;
};

export const HookText: React.FC<HookTextProps> = ({ words, len, ground, overPicture, top = 520, size = 132 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const ink = overPicture ? '#FFFFFF' : fx.text;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len, 6) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, display: 'flex', flexWrap: 'wrap', gap: '6px 26px', alignContent: 'flex-start' }}>
        {words.map((w, i) => {
          const s = slam(f, w.at);
          return (
            <span key={i} style={{ display: 'inline-block', fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: w.key ? fx.accent : ink, transform: `scale(${s})`, transformOrigin: '50% 70%', opacity: s > 0 ? 1 : 0, textShadow: overPicture ? '0 6px 30px rgba(0,0,0,0.65)' : 'none' }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
