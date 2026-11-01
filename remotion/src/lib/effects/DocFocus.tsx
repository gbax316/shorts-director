import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { EASE_INOUT, EASE_OUT, prog } from '../shorts';
import { FX_BOX, tail } from './util';

// The document callout: a real page (a website, an article, a PDF) on screen, the camera pushes in
// on one passage, the rest of the page blurs and dims, the passage lifts toward the viewer, and each
// line is marked as the narrator reads it. Proof the viewer can see: the claim, in its source.
// Capture the page and the passage's line boxes with tools/capture_passage.py; pass its JSON fields
// (w, h, lines) straight in. On a light page the mark is a highlighter; on a dark page, an underline
// with a soft glow, because a highlighter over light text on a dark ground hides the words.
export type DocLine = { x: number; y: number; w: number; h: number };
export type DocFocusProps = {
  src: string; // the screenshot, under the media root
  w: number; // screenshot size in pixels (from the JSON)
  h: number;
  lines: DocLine[]; // the passage, one box per line (from the JSON)
  len: number;
  page?: 'light' | 'dark';
  pushFrom?: number; // camera starts moving in
  pushTo?: number; // camera arrives; the blur and lift land here
  readFrom?: number; // the first line starts being marked
  readTo?: number; // the last line is fully marked (pace it to the narration)
  source?: string; // shown small at the top: where this page is
};

export const DocFocus: React.FC<DocFocusProps> = ({ src, w, h, lines, len, page = 'light', pushFrom = 4, pushTo = 34, readFrom, readTo, source }) => {
  const f = useCurrentFrame();
  const view = 1000; // the page's width on screen before the push
  const k = view / w;
  const bx = Math.min(...lines.map((l) => l.x)) * k;
  const by = Math.min(...lines.map((l) => l.y)) * k;
  const bw = Math.max(...lines.map((l) => l.x + l.w)) * k - bx;
  const bh = Math.max(...lines.map((l) => l.y + l.h)) * k - by;
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  // end of the push: the passage fills the safe width and sits above the caption band
  const z = Math.min(2.2, (FX_BOX.right - FX_BOX.left) / bw);
  const t = EASE_INOUT(prog(f, pushFrom, pushTo));
  const s = 1 + (z - 1) * t;
  const startX = (1080 - view) / 2;
  const startY = 760 - cy; // the passage starts at the same height it will end at, so the move is a push, not a scroll
  const ox = startX + (540 - cx * z - startX) * t;
  const oy = startY + (760 - cy * z - startY) * t;
  const focus = EASE_OUT(prog(f, pushTo - 8, pushTo + 6));
  const r0 = readFrom ?? pushTo + 4;
  const r1 = readTo ?? r0 + 30 * lines.length;
  const total = lines.reduce((a, l) => a + l.w, 0);
  const pad = 14;
  const sheet = (filter: string) => (
    <div style={{ position: 'absolute', left: ox, top: oy, width: view, height: h * k, transform: `scale(${s})`, transformOrigin: '0 0', filter }}>
      <Img src={staticFile(src)} style={{ width: view, height: h * k, display: 'block' }} />
    </div>
  );
  // the lifted passage: the same page, unblurred, clipped to the passage box and scaled up a touch
  const lift = 1 + 0.035 * focus;
  return (
    <AbsoluteFill style={{ background: page === 'light' ? '#E9E6DF' : '#05080C', opacity: tail(f, len), overflow: 'hidden' }}>
      {sheet(`blur(${7 * focus}px) brightness(${1 - 0.42 * focus})`)}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${lift})`, transformOrigin: `${ox + cx * s}px ${oy + cy * s}px`, filter: `drop-shadow(0 18px 40px rgba(0,0,0,${0.5 * focus}))` }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${oy + (by - pad) * s}px ${1080 - (ox + (bx + bw + pad) * s)}px ${1920 - (oy + (by + bh + pad) * s)}px ${ox + (bx - pad) * s}px round 18px)` }}>
          {sheet('none')}
        </div>
        {lines.map((l, i) => {
          const before = lines.slice(0, i).reduce((a, q) => a + q.w, 0);
          const a = r0 + ((r1 - r0) * before) / total;
          const b = r0 + ((r1 - r0) * (before + l.w)) / total;
          const m = EASE_INOUT(prog(f, a, b));
          if (m <= 0) return null;
          const x = ox + l.x * k * s;
          const y = oy + l.y * k * s;
          const lw = l.w * k * s * m;
          const lh = l.h * k * s;
          return page === 'light' ? (
            <div key={i} style={{ position: 'absolute', left: x - 6, top: y + lh * 0.12, width: lw + 12, height: lh * 0.8, background: COLORS.warn, opacity: 0.55, mixBlendMode: 'multiply', borderRadius: 6 }} />
          ) : (
            <div key={i} style={{ position: 'absolute', left: x, top: y + lh * 0.9, width: lw, height: 7, borderRadius: 4, background: COLORS.warn, boxShadow: `0 0 18px ${COLORS.warn}` }} />
          );
        })}
      </div>
      {source ? <div style={{ position: 'absolute', top: FX_BOX.top, left: FX_BOX.left, right: 1080 - FX_BOX.right, fontFamily: FONT_MONO, fontSize: 26, color: page === 'light' ? '#3A3F46' : 'rgba(255,255,255,0.75)', opacity: focus }}>{source}</div> : null}
    </AbsoluteFill>
  );
};
