import React from 'react';
import { C, FONT } from './theme';

/** Props the guys conjure: drawn in code, flat and bold to sit with the street. */

const INK = '#15171C';

type Box = { x: number; y: number; w: number; rot?: number; scale?: number; opacity?: number };
const place = ({ x, y, w, rot = 0, scale = 1, opacity = 1 }: Box): React.CSSProperties => ({
  position: 'absolute',
  left: x - w / 2,
  top: y,
  width: w,
  transform: `translateY(-50%) rotate(${rot}deg) scale(${scale})`,
  opacity,
});

export type SiteKind = 'portfolio' | 'shop' | 'food' | 'estate' | 'school' | 'events';

const TINT: Record<SiteKind, [string, string]> = {
  portfolio: [C.navy, C.gold],
  shop: ['#FFF4E0', C.orange],
  food: ['#2B1408', '#F2B21B'],
  estate: ['#0F2A1E', '#30A46C'],
  school: ['#14234A', '#5B8DEF'],
  events: ['#3A1030', '#F06BB4'],
};

/** A small browser window with a made-up site in it. */
export const MiniSite: React.FC<Box & { kind: SiteKind }> = ({ kind, ...box }) => {
  const [bg, ac] = TINT[kind];
  const w = box.w;
  const u = w / 400;
  return (
    <div style={{ ...place(box), borderRadius: 18 * u, background: '#fff', border: `${6 * u}px solid ${INK}`, boxShadow: `0 ${14 * u}px 0 rgba(21,23,28,0.25)`, overflow: 'hidden' }}>
      <div style={{ height: 30 * u, background: '#EDEAE4', display: 'flex', alignItems: 'center', gap: 8 * u, paddingLeft: 14 * u, borderBottom: `${4 * u}px solid ${INK}` }}>
        {['#E5484D', '#F2B21B', '#30A46C'].map((c) => (
          <div key={c} style={{ width: 11 * u, height: 11 * u, borderRadius: 99, background: c }} />
        ))}
      </div>
      <div style={{ background: bg, padding: 22 * u, height: 230 * u, position: 'relative' }}>
        {kind === 'portfolio' ? (
          <div style={{ display: 'flex', gap: 18 * u, alignItems: 'center' }}>
            <div style={{ width: 70 * u, height: 70 * u, borderRadius: 99, background: ac }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 18 * u, width: '80%', background: C.cream, borderRadius: 6 * u }} />
              <div style={{ height: 11 * u, width: '55%', background: 'rgba(243,239,232,0.5)', borderRadius: 6 * u, marginTop: 10 * u }} />
            </div>
          </div>
        ) : kind === 'shop' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 * u }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 92 * u, borderRadius: 10 * u, background: i === 1 ? ac : '#F7D9A8' }} />
            ))}
          </div>
        ) : (
          <div>
            <div style={{ height: 22 * u, width: '70%', background: ac, borderRadius: 6 * u }} />
            <div style={{ height: 12 * u, width: '90%', background: 'rgba(255,255,255,0.45)', borderRadius: 6 * u, marginTop: 14 * u }} />
            <div style={{ height: 12 * u, width: '60%', background: 'rgba(255,255,255,0.45)', borderRadius: 6 * u, marginTop: 10 * u }} />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 22 * u,
            bottom: 24 * u,
            padding: `${10 * u}px ${22 * u}px`,
            borderRadius: 99,
            background: ac,
            fontFamily: FONT.sans,
            fontWeight: 600,
            fontSize: 22 * u,
            color: kind === 'shop' ? '#fff' : INK,
          }}
        >
          {kind === 'portfolio' ? 'Hire me' : kind === 'shop' ? 'Buy now' : 'Book now'}
        </div>
      </div>
    </div>
  );
};

/** A generic video thumbnail: no channel, no platform. */
export const Thumb: React.FC<Box & { hue: number }> = ({ hue, ...box }) => {
  const u = box.w / 160;
  return (
    <div
      style={{
        ...place(box),
        height: 96 * u,
        borderRadius: 12 * u,
        background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 40) % 360} 70% 30%))`,
        border: `${4 * u}px solid ${INK}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: 0, height: 0, borderTop: `${16 * u}px solid transparent`, borderBottom: `${16 * u}px solid transparent`, borderLeft: `${26 * u}px solid #fff`, marginLeft: 6 * u }} />
    </div>
  );
};

export const Calendar: React.FC<Box & { day: string; month: string }> = ({ day, month, ...box }) => {
  const u = box.w / 260;
  return (
    <div style={{ ...place(box), borderRadius: 22 * u, overflow: 'hidden', border: `${7 * u}px solid ${INK}`, background: '#fff', boxShadow: `0 ${16 * u}px 0 rgba(21,23,28,0.25)` }}>
      <div style={{ background: '#E5302B', color: '#fff', fontFamily: FONT.sans, fontWeight: 600, fontSize: 46 * u, textAlign: 'center', padding: `${10 * u}px 0`, letterSpacing: '0.08em' }}>{month}</div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 150 * u, lineHeight: 1, textAlign: 'center', padding: `${18 * u}px 0 ${24 * u}px`, color: INK }}>{day}</div>
    </div>
  );
};

export const Pill: React.FC<Box & { children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({ children, bg = C.gold, color = INK, size = 44, ...box }) => (
  <div style={{ ...place(box), display: 'flex', justifyContent: 'center' }}>
    <div
      style={{
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: 999,
        background: bg,
        color,
        border: `5px solid ${INK}`,
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: 'nowrap',
        boxShadow: '0 10px 0 rgba(21,23,28,0.25)',
      }}
    >
      {children}
    </div>
  </div>
);

/** Little four-point stars bursting out from a point; t runs 0..1 over the burst. */
export const Sparkles: React.FC<{ x: number; y: number; t: number; spread?: number; n?: number }> = ({ x, y, t, spread = 220, n = 12 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + i * 0.4;
        const r = spread * (0.5 + ((i * 37) % 10) / 20) * Math.sqrt(t);
        const s = (1 - t) * (14 + (i % 3) * 8);
        const cx = x + Math.cos(a) * r;
        const cy = y + Math.sin(a) * r;
        return <path key={i} d={`M${cx} ${cy - s} L${cx + s * 0.3} ${cy} L${cx} ${cy + s} L${cx - s * 0.3} ${cy}Z M${cx - s} ${cy} L${cx} ${cy - s * 0.3} L${cx + s} ${cy} L${cx} ${cy + s * 0.3}Z`} fill={i % 2 ? '#FFFFFF' : C.gold} stroke={INK} strokeWidth={2} />;
      })}
    </svg>
  );
};

/** A yellow Lagos danfo, side view, nose to the right. */
export const Danfo: React.FC<{ x: number; y: number; w?: number; flip?: boolean; wheel: number }> = ({ x, y, w = 420, flip, wheel }) => {
  const k = w / 420;
  return (
    <svg style={{ position: 'absolute', left: x - w / 2, top: y - 190 * k, overflow: 'visible' }} width={w} height={190 * k} viewBox="0 0 420 190">
      <g transform={flip ? 'translate(420 0) scale(-1 1)' : undefined} stroke={INK} strokeWidth={7} strokeLinejoin="round">
        <path d="M14 150 L14 52 Q14 30 40 28 L330 26 Q352 26 362 44 L400 100 Q408 112 408 128 L408 150 Z" fill="#F7C21B" />
        <path d="M14 104 L408 104" stroke={INK} strokeWidth={9} />
        <path d="M14 122 L408 122" stroke={INK} strokeWidth={9} />
        {[40, 112, 184, 256].map((wx) => (
          <rect key={wx} x={wx} y={42} width={58} height={44} rx={6} fill="#9FD3F0" />
        ))}
        <path d="M330 42 L352 42 L388 96 L330 96 Z" fill="#9FD3F0" />
        <rect x={398} y={128} width={14} height={14} rx={3} fill="#FFFFFF" />
        {[92, 330].map((wx) => (
          <g key={wx} transform={`rotate(${wheel} ${wx} 152)`}>
            <circle cx={wx} cy={152} r={30} fill={INK} />
            <circle cx={wx} cy={152} r={11} fill="#BFC3C9" stroke="none" />
            <path d={`M${wx} 128 L${wx} 140`} stroke="#BFC3C9" strokeWidth={5} />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** A speech bubble with its tail pointing down at the speaker. */
export const Bubble: React.FC<{ x: number; bottom: number; tailX: number; text: string; t: number }> = ({ x, bottom, tailX, text, t }) => {
  if (t <= 0) return null;
  const w = 860;
  const left = Math.max(40, Math.min(1080 - 40 - w, x - w / 2));
  return (
    <div style={{ position: 'absolute', left, top: bottom, width: w, transform: `translateY(-100%) scale(${0.85 + 0.15 * t})`, transformOrigin: `${tailX - left}px 100%`, opacity: t }}>
      <div
        style={{
          position: 'relative',
          margin: '0 auto',
          width: 'fit-content',
          maxWidth: w,
          background: '#FFFFFF',
          border: `7px solid ${INK}`,
          borderRadius: 44,
          padding: '22px 36px',
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.18,
          color: INK,
          textAlign: 'center',
          textWrap: 'balance',
          boxShadow: '0 12px 0 rgba(21,23,28,0.22)',
        }}
      >
        {text}
      </div>
      <svg style={{ position: 'absolute', left: tailX - left - 30, bottom: -42, overflow: 'visible' }} width={60} height={48}>
        <path d="M6 -4 L30 44 L54 -4" fill="#FFFFFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d="M2 -9 L58 -9" stroke="#FFFFFF" strokeWidth={10} />
      </svg>
    </div>
  );
};
