import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { COLORS } from '../../brand';
import { Captions, ProgressBar } from '../../lib/shorts';
import { EndCard, PoweredBy, makeBed } from '../../lib/skit/cards';
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
const bed = makeBed(VO, FPS);

const CUES = [
  { at: 0, src: 'horn-1', vol: 0.3 },
  { at: Math.round(40.9 * FPS), src: 'horn-2', vol: 0.2 },
  { at: END_CARD + 60, src: 'ping', vol: 0.45 }, // as the link lands
];

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
      <PoweredBy outAt={END_CARD} />
      <ProgressBar />
      <Sequence from={END_CARD}>
        <EndCard title="Build With AI" sub="13 and 14 November. Two live sessions." cta="Sign up now" url="qodeupafrica.com/build-with-ai/blueprint" />
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
