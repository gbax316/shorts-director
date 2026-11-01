import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { rise, tail } from './util';

// A vertical line that draws down the screen, with dated milestones landing on it in order.
// Vertical suits 9:16; the newest milestone glows, earlier ones settle back.
export type TimelineProps = {
  items: { when: string; label: string; at: number }[];
  len: number;
  top?: number;
  bottom?: number;
};

export const Timeline: React.FC<TimelineProps> = ({ items, len, top = 300, bottom = 1360 }) => {
  const f = useCurrentFrame();
  const x = 200;
  const span = bottom - top;
  const last = items.length ? items[items.length - 1].at + 14 : 1;
  const drawn = EASE_OUT(prog(f, 0, Math.max(last, 20)));
  const active = items.reduce((k, it, i) => (f >= it.at ? i : k), -1);
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: x - 3, top, width: 6, height: span * drawn, borderRadius: 3, background: `linear-gradient(${COLORS.warn}, ${COLORS.accent})` }} />
      {items.map((it, i) => {
        const y = top + (items.length === 1 ? 0 : (span * i) / (items.length - 1));
        const on = EASE_OUT(prog(f, it.at, it.at + 10));
        const now = i === active;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: now ? COLORS.warn : COLORS.navy, border: `5px solid ${COLORS.warn}`, transform: `scale(${on})`, boxShadow: now ? `0 0 34px ${COLORS.warn}` : 'none' }} />
            <div style={{ position: 'absolute', left: x + 60, top: y - 50, right: 60, ...rise(f, it.at, 20) }}>
              <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: COLORS.warn }}>{it.when}</div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 48, lineHeight: 1.15, color: COLORS.onNight, opacity: now ? 1 : 0.6 }}>{it.label}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
