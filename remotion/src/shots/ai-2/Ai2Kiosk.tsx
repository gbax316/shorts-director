import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, LOGO } from '../../brand';
import { FONT_BODY, FONT_HEADLINE } from '../../fonts';
import { Captions, EASE_OUT, ProgressBar, prog } from '../../lib/shorts';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG: "Segs's kiosk", Akpos and Segs #1 (generative track, dialogue).
// Nine Seedance 1.5 Pro clips at 720p, mouths redrawn from the voice by tools/mouth_sync.py
// (the *-mouth.mp4 files are already trimmed to their shot windows). Hard cuts: the scene
// never changes and 05a/05b join on the same frame. Captions colour the active word by speaker.
// The end card and the sound follow the approved Build With AI skit (v6): navy card, gold
// rule, the highlife bed and the Lagos street under the voice.
// =============================================================================
export const compositionConfig = {
  id: 'Ai2Kiosk',
  durationInSeconds: 61,
  fps: 30,
  width: 1080,
  height: 1920,
};

const FPS = 30;
const DIR = 'projects/akpos-segs-1-kiosk';
const SPEAKER = { akpos: COLORS.signalAlt, segs: COLORS.warn } as const; // their shirts, teal lifted to read on the plate

// global start + length in seconds, from beats.json "shots"
const SHOTS = [
  ['01-how-far', 0.0, 2.44],
  ['02-small-kiosk', 2.44, 4.7],
  ['03-phone', 7.14, 8.53],
  ['04-old-age', 15.67, 8.53],
  ['05a-laugh', 24.2, 2.5],
  ['05b-talk', 26.7, 8.04],
  ['06-hang-you', 34.74, 6.46],
  ['07-link-below', 41.2, 8.38],
  ['08-correct-guy', 49.58, 5.79],
] as const;

const END_CARD = Math.round((49.58 + 5.79) * FPS);
// the highlife take holds level to 69 s, then rings out; start it 8.5 s in so the ring-out lands on the card
const MUSIC_TRIM = Math.round(8.5 * FPS);
const speaking = (fr: number) => VO.some((l) => fr >= l.start * FPS && fr < l.end * FPS + 6);
// 0..1 share of the surrounding 13 frames under speech, so the beds ease down and up instead of stepping
const talk = (fr: number) => Array.from({ length: 13 }, (_, k) => speaking(fr + k - 6)).filter(Boolean).length / 13;
const bed = (fr: number, under: number, gap: number) => gap + (under - gap) * talk(fr);

const CUES = [
  { at: 0, src: 'horn-1', vol: 0.3 },
  { at: Math.round(40.9 * FPS), src: 'horn-2', vol: 0.2 },
  { at: END_CARD + 60, src: 'ping', vol: 0.45 }, // as the link lands
];

const PoweredBy: React.FC = () => {
  const f = useCurrentFrame();
  const a = prog(f, 0, 8) * (1 - prog(f, END_CARD - 4, END_CARD + 6));
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
      <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 23, color: COLORS.onNight, opacity: 0.8 }}>
        Powered by Qodeup
      </span>
    </div>
  );
};

// builds in under three seconds (logo, title, date, rule, call, link), then holds on a slow push
const EndCard: React.FC = () => {
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
        <div style={{ fontFamily: FONT_HEADLINE, fontSize: 118, lineHeight: 1, color: COLORS.onNight, ...rise(6, 32, 34) }}>
          Build With AI
        </div>
        <div style={{ marginTop: 34, fontFamily: FONT_BODY, fontSize: 42, color: COLORS.onNightSoft, ...rise(26, 50, 18) }}>
          13 and 14 November. Two live sessions.
        </div>
        <div style={{ width: 220 * EASE_OUT(prog(f, 38, 62)), height: 2, background: COLORS.warn, margin: '64px 0 56px' }} />
        <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 52, color: COLORS.onNight, ...rise(48, 70, 18) }}>
          Sign up now
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 40, color: COLORS.warn, ...rise(56, 80, 14) }}>
          qodeupafrica.com/build-with-ai/blueprint
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Ai2Kiosk: React.FC = () => {
  const lines = VO.map((l) => ({ ...l, accent: SPEAKER[l.who] }));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SHOTS.map(([name, start, dur]) => (
        <Sequence key={name} from={Math.round(start * FPS)} durationInFrames={Math.round((start + dur) * FPS) - Math.round(start * FPS)}>
          <OffthreadVideo src={staticFile(`${DIR}/${name}-mouth.mp4`)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Sequence>
      ))}
      <Captions lines={lines} y={1430} size={54} maxWords={4} plate />
      <PoweredBy />
      <ProgressBar />
      <Sequence from={END_CARD}>
        <EndCard />
      </Sequence>

      <Audio src={staticFile(`${DIR}/audio/voice.mp3`)} />
      <Audio
        src={staticFile(`${DIR}/audio/music-highlife.mp3`)}
        trimBefore={MUSIC_TRIM}
        volume={(fr) => Math.min(1, fr / 15) * (fr >= END_CARD ? 0.42 : bed(fr, 0.16, 0.28))}
      />
      <Audio
        src={staticFile(`${DIR}/audio/street.mp3`)}
        loop
        volume={(fr) => (fr >= END_CARD ? Math.max(0, 0.14 * (1 - (fr - END_CARD) / 40)) : bed(fr, 0.1, 0.22))}
      />
      {CUES.map((c) => (
        <Sequence key={c.src} from={c.at} durationInFrames={120}>
          <Audio src={staticFile(`${DIR}/audio/${c.src}.mp3`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Ai2Kiosk;
