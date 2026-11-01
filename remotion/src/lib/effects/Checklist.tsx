import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { appear, rise, tail } from './util';

// Items appear, then tick off one by one: a list the viewer can count, or what you get.
// items[].at is when the item appears; items[].tickAt when it is ticked (defaults to 18 frames later).
export type ChecklistProps = {
  title?: string;
  items: { text: string; at: number; tickAt?: number }[];
  len: number;
  ground?: 'night' | 'glass';
  top?: number;
};

const Tick: React.FC<{ t: number; size: number }> = ({ t, size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill={t > 0 ? COLORS.signalAlt : 'transparent'} stroke={COLORS.signalAlt} strokeWidth="3" opacity={0.35 + 0.65 * t} />
    <path d="M11 21 L17.5 27 L29 14" fill="none" stroke={COLORS.night} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - t)} />
  </svg>
);

export const Checklist: React.FC<ChecklistProps> = ({ title, items, len, ground = 'night', top = 330 }) => {
  const f = useCurrentFrame();
  const panel = ground === 'glass'
    ? { background: 'rgba(12,22,34,0.55)', backdropFilter: 'blur(18px)', boxShadow: 'inset 0 0 0 1px rgba(243,239,232,0.14)' }
    : { background: COLORS.navy };
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: 70, right: 70, padding: '46px 48px 30px', borderRadius: 34, ...panel, ...rise(f, 0, 30) }}>
        {title ? <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 64, lineHeight: 1.05, color: COLORS.warn, marginBottom: 26 }}>{title}</div> : null}
        {items.map((it, i) => {
          const tick = EASE_OUT(prog(f, it.tickAt ?? it.at + 18, (it.tickAt ?? it.at + 18) + 10));
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '18px 0', borderTop: i ? `1px solid ${COLORS.lineNight}` : 'none', ...rise(f, it.at, 22) }}>
              <Tick t={tick} size={58} />
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 46, color: COLORS.onNight, opacity: 0.55 + 0.45 * appear(f, it.tickAt ?? it.at + 18) }}>{it.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
