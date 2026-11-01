import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import type { Ground } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { WORLD, byName } from '../geo/world';
import { CountryShape, countryPath, makeMapScale } from '../map';
import { EASE_INOUT, EASE_OUT, prog } from '../shorts';
import { FX_BOX, rise, tail, useFx } from './util';

// Where something is: a clean map (no borders, roads or names beyond what the beat needs) that
// zooms from a wide view to a country, highlights it, and drops a pin on a place with its label.
// Built on lib/map.tsx's real Mercator projection and Natural Earth outlines, so the shapes and
// the pin's position are true. Views are [west, east] longitude and [south, north] latitude.
export type MapView = { lon: [number, number]; lat: [number, number] };
export type MapZoomProps = {
  from: MapView;
  to: MapView;
  country?: string; // highlighted, by its Natural Earth name
  pin?: { lon: number; lat: number; label: string; at: number };
  caption?: string;
  len: number;
  ground?: Ground;
  zoomEnd?: number; // frame the zoom settles on
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const MapZoom: React.FC<MapZoomProps> = ({ from, to, country, pin, caption, len, ground, zoomEnd = 60 }) => {
  const f = useCurrentFrame();
  const fx = useFx(ground);
  const t = EASE_INOUT(prog(f, 4, zoomEnd));
  // zoom in Mercator-friendly steps: interpolate the edges, keep the map 1080 wide
  const lon: [number, number] = [lerp(from.lon[0], to.lon[0], t), lerp(from.lon[1], to.lon[1], t)];
  const lat: [number, number] = [lerp(from.lat[0], to.lat[0], t), lerp(from.lat[1], to.lat[1], t)];
  const midLat = (lat[0] + lat[1]) / 2;
  const scale = makeMapScale(lon, lat, { x: 0, y: 0, w: 1080 });
  const [, cyMid] = scale.px((lon[0] + lon[1]) / 2, midLat);
  const offsetY = 820 - cyMid; // keep the view's centre at the same height on screen
  const hi = country ? byName(country) : null;
  const glow = EASE_OUT(prog(f, zoomEnd - 16, zoomEnd));
  const pinOn = pin ? EASE_OUT(prog(f, pin.at, pin.at + 12)) : 0;
  const [px, py] = pin ? scale.px(pin.lon, pin.lat) : [0, 0];
  const sea = fx.night ? '#0A1119' : '#E6EEF3';
  const land = fx.night ? '#2B3B50' : '#D6CFC1';
  return (
    <AbsoluteFill style={{ background: sea, opacity: tail(f, len) }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(0 ${offsetY})`}>
          {/* the 110m outlines leave hairline gaps between neighbours when zoomed in; a thick
              outline in the land colour closes them, which is also the cleaned-up map we want */}
          {WORLD.filter((c) => c.cont !== 'Antarctica' && c.name !== hi?.name).map((c) => (
            <path key={c.name} d={countryPath(scale, c)} fill={land} stroke={land} strokeWidth={6} strokeLinejoin="round" />
          ))}
          {hi ? <CountryShape scale={scale} country={hi} fill={COLORS.warn} opacity={0.35 + 0.65 * glow} glow={glow > 0.5} /> : null}
          {pin ? (
            <g opacity={pinOn} transform={`translate(${px} ${py}) scale(${pinOn})`}>
              <circle r={34 + 10 * Math.sin(f / 6)} fill={COLORS.accent} opacity={0.25} />
              <circle r={16} fill={COLORS.accent} stroke="#FFFFFF" strokeWidth={5} />
            </g>
          ) : null}
        </g>
      </svg>
      {pin ? (
        <div style={{ position: 'absolute', left: Math.min(Math.max(px + 36, FX_BOX.left), FX_BOX.right - 300), top: py + offsetY - 30, opacity: pinOn }}>
          <span style={{ display: 'inline-block', padding: '12px 22px', borderRadius: 16, background: fx.panel, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 40, color: fx.text }}>{pin.label}</span>
        </div>
      ) : null}
      {caption ? (
        <div style={{ position: 'absolute', left: FX_BOX.left, right: 1080 - FX_BOX.right, top: FX_BOX.top + 30, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: fx.accent, ...rise(f, 6, 14) }}>{caption}</div>
      ) : null}
    </AbsoluteFill>
  );
};
