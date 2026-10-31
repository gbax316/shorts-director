// Brand reference frame: one Qodeup hook laid out on a given ground, built only from the
// shorts kit and the brand tokens. Not a shot itself; BrandSampleNight/Day in shots/brand
// render it so a brand change can be judged on a real frame, not a swatch board.
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, RADIUS, SHADOW } from '../brand';
import { FONT_BODY, FONT_HEADLINE, FONT_MONO } from '../fonts';
import { BrandBg } from './kit';
import { Captions, Kicker, ProgressBar, SAFE, ShortsBackdrop, VoLine } from './shorts';

const VO: VoLine[] = [{
  text: 'How many hours did WhatsApp orders eat this week?', start: 0.4, end: 3.2,
  words: [
    { w: 'How', start: 0.4, end: 0.6 }, { w: 'many', start: 0.6, end: 0.85 },
    { w: 'hours', start: 0.85, end: 1.3 }, { w: 'did', start: 1.3, end: 1.5 },
    { w: 'WhatsApp', start: 1.5, end: 2.0 }, { w: 'orders', start: 2.0, end: 2.4 },
    { w: 'eat', start: 2.4, end: 2.7 }, { w: 'this', start: 2.7, end: 2.9 }, { w: 'week?', start: 2.9, end: 3.2 },
  ],
}];

const STEPS = ['WhatsApp', 'Spreadsheet', 'Bank alert'];

export const BrandSample: React.FC<{ ground: 'day' | 'night' }> = ({ ground }) => {
  const night = ground === 'night';
  const text = night ? COLORS.onNight : COLORS.ink;
  const soft = night ? COLORS.onNightSoft : COLORS.muted;
  const hot = night ? COLORS.warn : COLORS.accentOnDay;
  return (
    <AbsoluteFill>
      {night ? <ShortsBackdrop /> : <BrandBg ground="day" />}
      <Img src={staticFile(`library/logos/qodeup-logo-${night ? 'light' : 'dark'}.png`)}
        style={{ position: 'absolute', left: SAFE.left, top: 70, height: 64 }} />
      <Kicker text="FOR BUSINESS OWNERS" y={230} color={hot} bg={night ? undefined : '#ffffff'} />
      <div style={{ position: 'absolute', left: 90, right: SAFE.right + 20, top: 360,
        fontFamily: FONT_HEADLINE, fontSize: 132, lineHeight: 1.02, color: text, letterSpacing: -1 }}>
        How many <span style={{ fontStyle: 'italic', color: hot }}>hours</span> did WhatsApp orders eat this week?
      </div>
      <div style={{ position: 'absolute', left: 90, right: SAFE.right + 20, top: 1040, display: 'flex', gap: 18 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '22px 18px', borderRadius: RADIUS.card,
            background: night ? COLORS.surface : '#ffffff',
            border: `2px solid ${[COLORS.signal, COLORS.warn, COLORS.accent][i]}`,
            boxShadow: night ? SHADOW.night : SHADOW.card }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 2, color: soft }}>STEP {i + 1}</div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 34, color: text, marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>
      {/* on day the captions sit on a dark plate, so the bright orange reads there */}
      <Captions lines={VO} y={1450} accent={night ? COLORS.warn : COLORS.accent} plate={!night} />
      <ProgressBar color={COLORS.accent} />
    </AbsoluteFill>
  );
};
