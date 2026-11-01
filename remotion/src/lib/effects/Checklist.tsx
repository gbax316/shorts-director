import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, appear, rise, tail, useFx } from './util';

// Items appear, then tick off one by one: a list the viewer can count, or what they get.
// Use it when the list is not already in the captions word for word; a list the narrator reads
// out in full is better carried by the captions alone.
// items[].at is when the item appears; items[].tickAt when it is ticked (defaults to 18 frames later).
export type ChecklistProps = {
  title?: string;
  items: { text: string; at: number; tickAt?: number }[];
  len: number;
  glass?: boolean; // frosted panel over a picture instead of a solid one
  ground?: Ground;
  top?: number;
};

const Tick: React.FC<{ t: number; size: number; ink: string }> = ({ t, size, ink }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill={t > 0 ? COLORS.signalAlt : 'transparent'} stroke={COLORS.signalAlt} strokeWidth="3" opacity={0.35 + 0.65 * t} />
    <path d="M11 21 L17.5 27 L29 14" fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 * (1 - t)} />
  </svg>
);

export const Checklist: React.FC<ChecklistProps> = ({ title, items, len, glass, ground, top = 330 }) => {
  const f = useCurrentFrame();
  const fx = useFx(glass ? 'night' : ground);
  const panel = glass
    ? { background: 'rgba(12,22,34,0.55)', backdropFilter: 'blur(18px)', boxShadow: 'inset 0 0 0 1px rgba(243,239,232,0.14)' }
    : { background: fx.panel, boxShadow: fx.night ? 'none' : '0 18px 50px rgba(11,13,16,0.12)' };
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, padding: '44px 44px 28px', borderRadius: 34, ...panel, ...rise(f, 0, 30) }}>
        {title ? <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 60, lineHeight: 1.05, color: fx.accent, marginBottom: 24 }}>{title}</div> : null}
        {items.map((it, i) => {
          const tickAt = it.tickAt ?? it.at + 18;
          const tick = EASE_OUT(prog(f, tickAt, tickAt + 10));
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 0', borderTop: i ? `1px solid ${fx.line}` : 'none', ...rise(f, it.at, 22) }}>
              <Tick t={tick} size={56} ink={fx.night ? COLORS.night : '#FFFFFF'} />
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: fx.text, opacity: 0.55 + 0.45 * appear(f, tickAt) }}>{it.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
