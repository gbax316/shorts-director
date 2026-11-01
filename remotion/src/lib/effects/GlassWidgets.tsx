import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL, FONT_MONO } from '../../fonts';
import { FX_BOX, countUp, rise, tail } from './util';

// Frosted stat cards floating over the picture behind them (a plate, a clip, a night map).
// A card's value counts up when `to` is given; otherwise `value` shows as written.
// Every figure and every chip that states a fact carries its source in small type, as the
// fact gate asks; a chip that only names something (a place, a course) needs none.
export type GlassCard = { label: string; value?: string; to?: number; fmt?: (n: number) => string; source?: string; at: number };
export type GlassWidgetsProps = {
  cards: GlassCard[];
  chips?: { text: string; at: number; source?: string }[];
  len: number;
  top?: number;
};

const glass: React.CSSProperties = {
  background: 'linear-gradient(140deg, rgba(255,255,255,0.20), rgba(255,255,255,0.06))',
  backdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.28), 0 24px 60px rgba(0,0,0,0.30)',
  borderRadius: 36,
};

export const GlassWidgets: React.FC<GlassWidgetsProps> = ({ cards, chips = [], len, top = 300 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: FX_BOX.right - FX_BOX.left, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ ...glass, padding: '34px 40px', ...rise(f, c.at, 40, 16) }}>
            <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 104, lineHeight: 1, color: COLORS.warn }}>
              {c.to !== undefined ? countUp(f, c.at, c.at + 30, c.to, c.fmt) : c.value}
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, lineHeight: 1.2, color: '#FFFFFF' }}>{c.label}</div>
            {c.source ? <div style={{ marginTop: 14, fontFamily: FONT_MONO, fontSize: 24, color: 'rgba(255,255,255,0.72)' }}>Source: {c.source}</div> : null}
          </div>
        ))}
        {chips.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {chips.map((ch, i) => (
              <div key={i} style={{ ...glass, borderRadius: 999, padding: '16px 28px', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 34, color: '#FFFFFF', ...rise(f, ch.at, 18, 10) }}>
                {ch.text}
                {ch.source ? <span style={{ marginLeft: 12, fontFamily: FONT_MONO, fontWeight: 400, fontSize: 22, color: 'rgba(255,255,255,0.72)' }}>{ch.source}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
