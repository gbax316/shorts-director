import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// A vertical line that draws down the screen, with dated milestones landing on it in order.
// Vertical suits 9:16; the newest milestone glows, earlier ones settle back. For an order in
// time the viewer has to follow, not for a list with no order (that is Checklist).
export type TimelineProps = {
  items: { when: string; label: string; at: number }[];
  len: number;
  ground?: Ground;
  top?: number;
  bottom?: number;
};

export const Timeline: React.FC<TimelineProps> = ({ items, len, ground, top = 320, bottom = 1240 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const x = FX_BOX.left + 120;
  const span = Math.min(bottom, FX_BOX.bottom - 120) - top;
  const last = items.length ? items[items.length - 1].at + 14 : 1;
  const drawn = EASE_OUT(prog(f, 0, Math.max(last, 20)));
  const active = items.reduce((k, it, i) => (f >= it.at ? i : k), -1);
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: x - 3, top, width: 6, height: span * drawn, borderRadius: 3, background: `linear-gradient(${fx.accent}, ${COLORS.accent})` }} />
      {items.map((it, i) => {
        const y = top + (items.length === 1 ? 0 : (span * i) / (items.length - 1));
        const on = EASE_OUT(prog(f, it.at, it.at + 10));
        const now = i === active;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: now ? fx.accent : fx.panel, border: `5px solid ${fx.accent}`, transform: `scale(${on})`, boxShadow: now ? `0 0 34px ${fx.accent}` : 'none' }} />
            <div style={{ position: 'absolute', left: x + 60, top: y - 50, width: FX_BOX.right - x - 60, ...rise(f, it.at, 20) }}>
              <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 32, letterSpacing: 2, color: fx.accent }}>{it.when}</div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 46, lineHeight: 1.15, color: fx.text, opacity: now ? 1 : 0.6 }}>{it.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
