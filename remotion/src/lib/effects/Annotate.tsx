import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// A hand-drawn circle (or underline) around one detail in the picture, an arrow drawing toward it
// and a short scrawled note: lighter than a spotlight, it points without darkening the scene.
// Coordinates are frame pixels; the stroke draws itself on.
export type AnnotateProps = {
  x: number;
  y: number;
  rx: number;
  ry?: number;
  shape?: 'circle' | 'underline';
  note?: string;
  noteX?: number;
  noteY?: number;
  at: number;
  len: number;
  color?: string;
};

export const Annotate: React.FC<AnnotateProps> = ({ x, y, rx, ry, shape = 'circle', note, noteX, noteY, at, len, color = COLORS.warn }) => {
  const f = useCurrentFrame();
  const draw = EASE_OUT(prog(f, at, at + 16));
  const arrow = EASE_OUT(prog(f, at + 12, at + 26));
  const noteOn = EASE_OUT(prog(f, at + 22, at + 32));
  const r2 = ry ?? rx * 0.62;
  // a slightly uneven loop that overshoots its start, the way a pen does
  const loop = `M ${x - rx} ${y} C ${x - rx} ${y - r2 * 1.1}, ${x + rx * 1.05} ${y - r2 * 1.05}, ${x + rx} ${y + 4} C ${x + rx * 0.95} ${y + r2 * 1.1}, ${x - rx * 1.08} ${y + r2}, ${x - rx * 0.92} ${y - r2 * 0.28}`;
  const under = `M ${x - rx} ${y} Q ${x} ${y + 14}, ${x + rx} ${y - 6}`;
  // the note sits beside the circle on whichever side has room, above it, inside the safe box
  const roomRight = FX_BOX.right - (x + rx + 30);
  const nx = noteX ?? (roomRight >= 320 ? x + rx + 30 : FX_BOX.left);
  const ny = noteY ?? Math.max(y - r2 - 200, FX_BOX.top);
  const ax = nx + 60;
  const ay = ny + 80;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path d={shape === 'circle' ? loop : under} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        {note ? (
          <path d={`M ${ax} ${ay} Q ${(ax + x) / 2 + 40} ${(ay + y) / 2 - 30}, ${x + (x < ax ? rx * 0.7 : -rx * 0.7)} ${y - r2 * 0.8}`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - arrow} />
        ) : null}
      </svg>
      {note ? (
        <div style={{ position: 'absolute', left: nx, top: ny, maxWidth: Math.max(320, (roomRight >= 320 ? FX_BOX.right : x - rx * 0.3) - nx), opacity: noteOn, transform: `rotate(-4deg) scale(${0.9 + 0.1 * noteOn})`, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 46, color, textShadow: '0 3px 14px rgba(0,0,0,0.7)' }}>{note}</div>
      ) : null}
    </AbsoluteFill>
  );
};
