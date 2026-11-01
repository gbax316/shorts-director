import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// Phone notifications dropping in from the top and stacking: momentum the viewer can feel
// (orders, enquiries, payments landing). Each one is illustrative unless it is real; never show a
// stack of sales as if it were someone's actual result.
export type Note = { app: string; title: string; body: string; at: number; tone?: 'green' | 'gold' | 'blue' };
export type NotificationsProps = { notes: Note[]; len: number; top?: number };

export const Notifications: React.FC<NotificationsProps> = ({ notes, len, top = 260 }) => {
  const f = useCurrentFrame();
  const shown = notes.filter((n) => f >= n.at);
  const tone = { green: COLORS.signalAlt, gold: COLORS.warn, blue: COLORS.accent2 };
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      {shown.map((n, i) => {
        const depth = shown.length - 1 - i; // newest on top, older ones pushed down
        const t = EASE_OUT(prog(f, n.at, n.at + 10));
        const y = top + depth * 176 - (1 - t) * 140;
        return (
          <div key={i} style={{ position: 'absolute', left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, top: y, padding: '22px 26px', borderRadius: 30, background: 'rgba(245,247,250,0.94)', boxShadow: '0 16px 40px rgba(0,0,0,0.28)', opacity: t * (depth > 4 ? 0 : 1 - depth * 0.12), transform: `scale(${1 - depth * 0.03})`, transformOrigin: '50% 0%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT_BODY, fontSize: 24, color: '#5A6470' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: tone[n.tone ?? 'green'] }} />
              {n.app.toUpperCase()}
              <span style={{ marginLeft: 'auto' }}>now</span>
            </div>
            <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 34, color: '#11161C' }}>{n.title}</div>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 30, color: '#2F3A45' }}>{n.body}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
