import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_INOUT, EASE_OUT, prog } from '../shorts';
import { tail } from './util';

// Dims everything except one place in the frame, then can glide to the next.
// Place it over the picture it points at; targets are in frame pixels (1080x1920).
export type SpotTarget = { x: number; y: number; r: number; at: number; label?: string };
export type SpotlightProps = { targets: SpotTarget[]; len: number; dim?: number };

export const Spotlight: React.FC<SpotlightProps> = ({ targets, len, dim = 0.72 }) => {
  const f = useCurrentFrame();
  if (!targets.length) return null;
  const i = targets.reduce((k, t, n) => (f >= t.at ? n : k), 0);
  const cur = targets[i];
  const prev = targets[Math.max(0, i - 1)];
  const m = i === 0 ? 1 : EASE_INOUT(prog(f, cur.at, cur.at + 14));
  const x = prev.x + (cur.x - prev.x) * m;
  const y = prev.y + (cur.y - prev.y) * m;
  const r = (prev.r + (cur.r - prev.r) * m) * (0.85 + 0.15 * EASE_OUT(prog(f, targets[0].at, targets[0].at + 12)));
  const on = EASE_OUT(prog(f, targets[0].at, targets[0].at + 10)) * tail(f, len);
  const labelOn = EASE_OUT(prog(f, cur.at + 8, cur.at + 18));
  const below = y + r + 40 < 1600;
  return (
    <AbsoluteFill style={{ opacity: on }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0, transparent ${r - 2}px, rgba(8,12,18,${dim}) ${r + 18}px)` }} />
      <div style={{ position: 'absolute', left: x - r - 8, top: y - r - 8, width: 2 * r + 16, height: 2 * r + 16, borderRadius: '50%', border: `4px solid ${COLORS.warn}`, boxShadow: `0 0 40px ${COLORS.warn}66` }} />
      {cur.label ? (
        <div style={{ position: 'absolute', left: 70, right: 70, top: below ? y + r + 40 : y - r - 130, textAlign: 'center', opacity: labelOn }}>
          <span style={{ display: 'inline-block', padding: '14px 26px', borderRadius: 18, background: COLORS.warn, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 42, color: COLORS.night }}>{cur.label}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
