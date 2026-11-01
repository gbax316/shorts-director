import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail, useFx } from './util';

// A list with a centre: one idea and the things it leads to, circling it. Satellites pop onto
// the ring in order and the ring turns slowly. (For real orbital physics, lib/orbit.tsx is the
// engine; this is the diagram.)
export type OrbitProps = {
  centre: string;
  items: { text: string; at: number }[];
  len: number;
  ground?: Ground;
  cy?: number;
  radius?: number;
  turnsPerSecond?: number;
};

export const Orbit: React.FC<OrbitProps> = ({ centre, items, len, ground, cy = 820, radius = 280, turnsPerSecond = 0.04 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const cx = (FX_BOX.left + FX_BOX.right) / 2; // centred in the safe box, clear of the platform buttons
  const spin = (f / 30) * turnsPerSecond * Math.PI * 2;
  const core = EASE_OUT(prog(f, 0, 14));
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', left: cx - radius, top: cy - radius, width: radius * 2, height: radius * 2, borderRadius: '50%', border: `3px dashed ${fx.accent}88`, transform: `scale(${core})` }} />
      <div style={{ position: 'absolute', left: cx - 150, top: cy - 150, width: 300, height: 300, borderRadius: '50%', background: fx.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 28, transform: `scale(${core})`, boxShadow: `0 0 80px ${fx.accent}55` }}>
        <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: fx.onAccent }}>{centre}</div>
      </div>
      {items.map((it, i) => {
        const a = spin + (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const pop = EASE_OUT(prog(f, it.at, it.at + 12));
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        return (
          <div key={i} style={{ position: 'absolute', left: x - 115, top: y - 46, width: 230, minHeight: 92, borderRadius: 24, background: fx.panel, border: `3px solid ${fx.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '12px 16px', transform: `scale(${pop})`, opacity: pop }}>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 34, lineHeight: 1.15, color: fx.text }}>{it.text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
