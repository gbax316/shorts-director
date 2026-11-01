import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { Ground } from '../../brand';
import { FONT_BODY } from '../../fonts';
import { EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// Someone types a search and results appear (or "no results"): what a customer sees when they look
// for you. Generic, never a real search engine's marks. `found: false` shows the empty state.
export type SearchBarProps = {
  query: string;
  typeFrom?: number;
  cps?: number; // characters per second
  results?: { title: string; sub?: string }[];
  emptyText?: string;
  len: number;
  ground?: Ground;
  top?: number;
};

export const SearchBar: React.FC<SearchBarProps> = ({ query, typeFrom = 6, cps = 16, results = [], emptyText = 'No results', len, ground, top = 360 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const typed = Math.max(0, Math.min(query.length, Math.floor(((f - typeFrom) / 30) * cps)));
  const doneAt = typeFrom + Math.ceil((query.length / cps) * 30) + 8;
  const caret = f < doneAt && Math.floor(f / 8) % 2 === 0;
  const w = FX_BOX.right - FX_BOX.left;
  return (
    <AbsoluteFill style={{ opacity: tail(f, len) }}>
      <div style={{ position: 'absolute', top, left: FX_BOX.left, width: w, ...rise(f, 0, 24) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '26px 32px', borderRadius: 999, background: fx.night ? '#FFFFFF' : '#FFFFFF', boxShadow: '0 14px 40px rgba(0,0,0,0.25)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#5F6B78" strokeWidth="2.4" /><path d="M15 15 L21 21" stroke="#5F6B78" strokeWidth="2.4" strokeLinecap="round" /></svg>
          <span style={{ fontFamily: FONT_BODY, fontSize: 42, color: '#12171D' }}>{query.slice(0, typed)}<span style={{ opacity: caret ? 1 : 0 }}>|</span></span>
        </div>
        {results.length
          ? results.map((r, i) => (
              <div key={i} style={{ marginTop: 22, padding: '24px 30px', borderRadius: 24, background: fx.panel, ...rise(f, doneAt + i * 8, 18) }}>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: fx.accent }}>{r.title}</div>
                {r.sub ? <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 30, color: fx.soft }}>{r.sub}</div> : null}
              </div>
            ))
          : <div style={{ marginTop: 40, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 52, color: fx.text, opacity: EASE_OUT(prog(f, doneAt, doneAt + 10)) }}>{emptyText}</div>}
      </div>
    </AbsoluteFill>
  );
};
