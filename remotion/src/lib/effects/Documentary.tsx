import React from 'react';
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_HEADLINE, FONT_MONO } from '../../fonts';
import { EASE_INOUT, prog } from '../shorts';
import { rise, tail } from './util';

// The documentary look for one still: a slow pan and push across it, a film-grain and vignette
// pass, a date stamp in the corner and a lower third naming what we are looking at.
// `src` is a path under the media root (staticFile). `pan` picks the direction of travel.
export type DocumentaryProps = {
  src: string;
  len: number;
  date?: string;
  title?: string;
  subtitle?: string;
  pan?: 'left' | 'right' | 'up' | 'in';
  sepia?: boolean;
};

export const Documentary: React.FC<DocumentaryProps> = ({ src, len, date, title, subtitle, pan = 'right', sepia }) => {
  const f = useCurrentFrame();
  const t = EASE_INOUT(prog(f, 0, len));
  const move = { left: [40, 0], right: [-40, 0], up: [0, -50], in: [0, 0] }[pan];
  const scale = 1.12 + 0.08 * t;
  const grain = Math.floor(random(`grain-${Math.floor(f / 2)}`) * 100);
  return (
    <AbsoluteFill style={{ background: COLORS.night, opacity: tail(f, len, 8) }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translate(${move[0] * t}px, ${move[1] * t}px)`, filter: sepia ? 'sepia(0.55) contrast(1.05)' : 'contrast(1.04) saturate(1.05)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
      <AbsoluteFill style={{ opacity: 0.09, backgroundImage: 'repeating-radial-gradient(circle at 17% 32%, #fff 0, #fff 1px, transparent 1px, transparent 3px)', backgroundSize: '7px 7px', backgroundPosition: `${grain}px ${grain * 0.7}px`, mixBlendMode: 'overlay' }} />
      {date ? (
        <div style={{ position: 'absolute', top: 220, right: 64, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 38, letterSpacing: 3, color: COLORS.warn, textShadow: '0 2px 10px rgba(0,0,0,0.7)', ...rise(f, 6, 14) }}>{date}</div>
      ) : null}
      {title ? (
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 560, ...rise(f, 12, 22) }}>
          <div style={{ width: 120, height: 5, background: COLORS.warn, marginBottom: 18 }} />
          <div style={{ fontFamily: FONT_HEADLINE, fontSize: 78, lineHeight: 1, color: '#FFFFFF', textShadow: '0 3px 18px rgba(0,0,0,0.75)' }}>{title}</div>
          {subtitle ? <div style={{ marginTop: 12, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 38, color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.75)' }}>{subtitle}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
