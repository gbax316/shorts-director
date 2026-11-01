import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_EDITORIAL, FONT_MONO } from '../../fonts';
import { EASE_OUT, prog } from '../../lib/shorts';

// Screens drawn in code and pinned onto the blank screens in the stills with a CSS perspective
// transform, so the words on them stay sharp and legible.

type Pt = [number, number];

// the 3x3 homography that sends (0,0) (w,0) (w,h) (0,h) to the four points, as a CSS matrix3d
const homography = (w: number, h: number, q: [Pt, Pt, Pt, Pt]) => {
  const src: Pt[] = [[0, 0], [w, 0], [w, h], [0, h]];
  const A: number[][] = [];
  src.forEach(([x, y], i) => {
    const [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  });
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  const [a, b, c2, d, e, f, g, hh] = A.map((row, i) => row[8] / row[i]);
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${hh},0,0,1,0,${c2},${f},0,1)`;
};

export const Pinned: React.FC<{ w: number; h: number; quad: [Pt, Pt, Pt, Pt]; children: React.ReactNode }> = ({ w, h, quad, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: homography(w, h, quad), overflow: 'hidden' }}>
    {children}
  </div>
);

// beat 4: the plan first, then the site it builds, on the laptop in 06-over-shoulder
export const LaptopScreen: React.FC<{ buildAt: number }> = ({ buildAt }) => {
  const f = useCurrentFrame();
  const lines = ['For: neighbours who want fresh bread', 'Pages: home, menu, order', 'Every enquiry: saved and emailed'];
  const site = EASE_OUT(prog(f, buildAt, buildAt + 14));
  const bit = (k: number) => EASE_OUT(prog(f, buildAt + 6 + k * 6, buildAt + 16 + k * 6));
  return (
    <div style={{ width: 600, height: 400, background: '#F7F5F0', position: 'relative', fontFamily: FONT_BODY }}>
      <div style={{ position: 'absolute', inset: 0, padding: '30px 34px', opacity: 1 - site }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: COLORS.accentOnDay, marginBottom: 18 }}>plan.md</div>
        {lines.map((l, i) => {
          const t = prog(f, 4 + i * 14, 16 + i * 14);
          return (
            <div key={l} style={{ fontFamily: FONT_MONO, fontSize: 25, lineHeight: 1.5, color: COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', width: `${t * 100}%` }}>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: site, background: '#FFF8EC' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: '#3B1F12', color: '#FFF3DE' }}>
          <span style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 28 }}>Mama Tee's</span>
          <span style={{ fontSize: 20 }}>Menu · Order · Find us</span>
        </div>
        <div style={{ padding: '26px 28px', opacity: bit(0), transform: `translateY(${(1 - bit(0)) * 16}px)` }}>
          <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 46, lineHeight: 1.02, color: '#3B1F12' }}>Fresh bread, Yaba, every morning</div>
        </div>
        <div style={{ display: 'flex', gap: 14, padding: '0 28px', opacity: bit(1) }}>
          {['Bread', 'Puff-puff', 'Meat pie'].map((x) => (
            <div key={x} style={{ flex: 1, height: 92, borderRadius: 12, background: '#F2B21B33', display: 'flex', alignItems: 'flex-end', padding: 10, fontSize: 20, color: '#3B1F12' }}>
              {x}
            </div>
          ))}
        </div>
        <div style={{ margin: '18px 28px', opacity: bit(2), display: 'inline-block', padding: '10px 22px', borderRadius: 999, background: COLORS.accent, color: '#fff', fontSize: 22, fontWeight: 600 }}>
          Order for collection
        </div>
      </div>
    </div>
  );
};

// beat 5, third door: a booking app on the salon owner's phone in 08-salon-owner
export const PhoneScreen: React.FC = () => {
  const f = useCurrentFrame();
  const t = (k: number) => EASE_OUT(prog(f, 6 + k * 5, 14 + k * 5));
  return (
    <div style={{ width: 220, height: 460, background: '#FFFFFF', fontFamily: FONT_BODY, padding: '26px 16px', boxSizing: 'border-box' }}>
      <div style={{ fontFamily: FONT_EDITORIAL, fontWeight: 900, fontSize: 26, color: COLORS.navy, opacity: t(0) }}>Book a slot</div>
      {['Braids, Sat 10:00', 'Wash and set, Sat 1:00', 'Cut, Sun 2:30'].map((x, i) => (
        <div key={x} style={{ marginTop: 14, padding: '12px 10px', borderRadius: 10, background: i === 0 ? '#2BB3AB22' : '#F3EFE8', fontSize: 16, color: COLORS.ink, opacity: t(i + 1) }}>
          {x}
        </div>
      ))}
      <div style={{ marginTop: 22, padding: '12px 0', borderRadius: 999, background: COLORS.signal, color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 600, opacity: t(4) }}>
        Confirm
      </div>
    </div>
  );
};
