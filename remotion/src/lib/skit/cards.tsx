import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, LOGO } from '../../brand';
import { FONT_BODY, FONT_HEADLINE } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import type { VoLine } from '../shorts';
import DIRECTOR from '../../../../director.config.json';

// Shared by the skit series: the corner mark, the closing card and the voice-aware beds.
// Words and links come from each episode's beats.json "endCard"; the corner mark comes from director.config.json.

export const PoweredBy: React.FC<{ outAt: number; label?: string }> = ({ outAt, label = DIRECTOR.brand.cornerMark }) => {
  const f = useCurrentFrame();
  const a = prog(f, 0, 8) * (1 - prog(f, outAt - 4, outAt + 6));
  if (a <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 110,
        left: 54,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px 8px 9px',
        borderRadius: 999,
        background: 'rgba(8,14,22,0.42)',
        boxShadow: 'inset 0 0 0 1px rgba(243,239,232,0.10)',
        opacity: a,
      }}
    >
      <Img src={staticFile(LOGO.mark)} style={{ width: 32, height: 32, objectFit: 'contain' }} />
      <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 23, color: COLORS.onNight, opacity: 0.8 }}>{label}</span>
    </div>
  );
};

export type EndCardProps = { title: string; sub: string; cta: string; url: string };

// builds in under three seconds (logo, title, date, rule, call, link), then holds on a slow push
export const EndCard: React.FC<EndCardProps> = ({ title, sub, cta, url }) => {
  const f = useCurrentFrame();
  const rise = (a: number, b: number, px: number) => {
    const t = EASE_OUT(prog(f, a, b));
    return { opacity: t, transform: `translateY(${(1 - t) * px}px)` };
  };
  return (
    <AbsoluteFill style={{ background: COLORS.navy, opacity: prog(f, 0, 12) }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(242,178,27,0.07), transparent 70%), radial-gradient(ellipse 120% 90% at 50% 120%, rgba(232,121,42,0.06), transparent 60%)',
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '0 86px',
          transform: `scale(${1 + 0.035 * prog(f, 0, 189)})`,
        }}
      >
        <Img src={staticFile(LOGO.onNight)} style={{ width: 400, marginBottom: 72, ...rise(0, 26, 24) }} />
        <div style={{ fontFamily: FONT_HEADLINE, fontSize: 118, lineHeight: 1, color: COLORS.onNight, ...rise(6, 32, 34) }}>{title}</div>
        <div style={{ marginTop: 34, fontFamily: FONT_BODY, fontSize: 42, color: COLORS.onNightSoft, ...rise(26, 50, 18) }}>{sub}</div>
        <div style={{ width: 220 * EASE_OUT(prog(f, 38, 62)), height: 2, background: COLORS.warn, margin: '64px 0 56px' }} />
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 52, color: COLORS.onNight, ...rise(48, 70, 18) }}>{cta}</div>
        <div style={{ marginTop: 22, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 40, color: COLORS.warn, ...rise(56, 80, 14) }}>{url}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A bed level that eases between `under` (while anyone speaks) and `gap`, over about 13 frames,
// so beds duck smoothly instead of stepping at every line boundary.
export const makeBed = (vo: VoLine[], fps: number) => {
  const speaking = (fr: number) => vo.some((l) => fr >= l.start * fps && fr < l.end * fps + 6);
  const talk = (fr: number) => Array.from({ length: 13 }, (_, k) => speaking(fr + k - 6)).filter(Boolean).length / 13;
  return (fr: number, under: number, gap: number) => gap + (under - gap) * talk(fr);
};
