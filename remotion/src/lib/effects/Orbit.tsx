import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { tail } from './util';

// One idea in the centre and the things it leads to circling it: "one skill, many doors".
// Satellites pop onto the ring in order and the ring turns slowly. (For real orbital physics,
// lib/orbit.tsx is the engine; this is the diagram.)
export type OrbitProps = {
  centre: string;
  items: { text: string; at: number }[];
  len: number;
  cx?: number;
  cy?: number;
  radius?: number;
  turnsPerSecond?: number;
};

export const Orbit: React.FC<OrbitProps> = ({ centre, items, len, cx = 540, cy = 860, radius = 360, turnsPerSecond = 0.04 }) => {
  const f = useCurrentFrame();
  const spin = (f / 30) * turnsPerSecond * Math.PI * 2;
  const core = EASE_OUT(prog(f, 0, 14));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: cx - radius, top: cy - radius, width: radius * 2, height: radius * 2, borderRadius: '50%', border: `3px dashed ${COLORS.warn}88`, transform: `scale(${core})` }} />
      <div style={{ position: 'absolute', left: cx - 170, top: cy - 170, width: 340, height: 340, borderRadius: '50%', background: COLORS.warn, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 30, transform: `scale(${core})`, boxShadow: `0 0 80px ${COLORS.warn}55` }}>
        <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 56, lineHeight: 1.05, color: COLORS.night }}>{centre}</div>
      </div>
      {items.map((it, i) => {
        const a = spin + (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const pop = EASE_OUT(prog(f, it.at, it.at + 12));
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 140, top: y - 52, width: 280, minHeight: 104, borderRadius: 26, background: COLORS.navy, border: `3px solid ${COLORS.warn}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '14px 18px', transform: `scale(${pop})`, opacity: pop }}>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 36, lineHeight: 1.15, color: COLORS.onNight }}>{it.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
