import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// A ranked list revealed from the bottom of the ranking up, the number first and the item a beat
// later, so each reveal is a small payoff and the viewer stays for number one. Earlier entries stay
// on screen, dimmed. items are given best first; they are revealed in reverse.
export type RankRevealProps = {
  title?: string;
  items: { text: string; note?: string }[];
  at: number[]; // frame each rank is revealed, in reveal order (last rank first)
  len: number;
  ground?: Ground;
  top?: number;
};

export const RankReveal: React.FC<RankRevealProps> = ({ title, items, at, len, ground, top = 300 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const n = items.length;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      {title ? <div style={{ position: 'absolute', top, left: FX_BOX.left, right: 1080 - FX_BOX.right, fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: fx.text, ...rise(f, 0, 20) }}>{title}</div> : null}
      {items.map((it, rank) => {
        const order = n - 1 - rank; // rank n is revealed first
        const t0 = at[order] ?? order * 20;
        const num = EASE_OUT(prog(f, t0, t0 + 8));
        const txt = EASE_OUT(prog(f, t0 + 8, t0 + 18));
        const newest = at.filter((a) => f >= a).length - 1 === order;
        const y = top + (title ? 130 : 0) + rank * 170;
        return (
          <div key={rank} style={{ position: 'absolute', top: y, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, display: 'flex', alignItems: 'center', gap: 28, opacity: num * (newest ? 1 : 0.55) }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: rank === 0 ? fx.accent : fx.panel, border: `4px solid ${fx.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 70, color: rank === 0 ? fx.onAccent : fx.accent, transform: `scale(${0.6 + 0.4 * num})` }}>{rank + 1}</div>
            <div style={{ opacity: txt, transform: `translateX(${(1 - txt) * 30}px)` }}>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 46, color: fx.text }}>{it.text}</div>
              {it.note ? <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: fx.soft }}>{it.note}</div> : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
