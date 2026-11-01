import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_BODY, FONT_DISPLAY } from '../../fonts';
import { Captions, EASE_OUT, ProgressBar, prog } from '../../lib/shorts';
import { EndCard, PoweredBy, makeBed } from '../../lib/skit/cards';
import { Calendar, MiniSite } from '../../lib/skit/props';
import { POSE, Stick } from '../../lib/skit/rig';
import { VO } from './vo.gen';

// =============================================================================
// COMPOSITION CONFIG: "The customer who walked away", Akpos and Segs #2 (the hybrid proving run).
// ANIMATIC: generated stills on the real voice timeline, every gag drawn in code, Akpos's beat 5 as a
// cut-out that breathes and chews. Beats marked CLIP become generated clips after Orezi signs off
// the animatic; the tags show what each clip will act out.
// =============================================================================
export const compositionConfig = {
  id: 'Ai3Customer',
  durationInSeconds: 43.2,
  fps: 30,
  width: 1080,
  height: 1920,
};

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const DIR = 'projects/akpos-segs-2';
const ANIMATIC = true;
const SPEAKER = { akpos: COLORS.signalAlt, segs: COLORS.warn, customer: COLORS.accent } as const;
const END_CARD = s(37.6);
const bed = makeBed(VO, FPS);
// the highlife take holds level to 69 s, then rings out; start it so the ring-out lands on the card's end
const MUSIC_TRIM = s(69 - 43.2);
const INK = '#15171C';

const SCENES = [
  { plate: 'p2-segs-close', from: 0, to: s(7.4), clip: { at: s(5.24), note: "CLIP: Segs's eyebrow climbs off his head" } },
  { plate: 'p1-plate', from: s(7.4), to: s(16.99) },
  { plate: 'p4-lean', from: s(16.99), to: s(35.15), clip: { at: s(16.99), until: s(21.6), note: 'CLIP: Segs leans in, Akpos leans back' } },
  { plate: 'p5-laugh', from: s(35.15), to: END_CARD, clip: { at: s(35.15), note: 'CLIP: Akpos laughs, Segs points up' } },
];

// overlays pinned to the picture go in as children, so they ride the same slow push
const Plate: React.FC<{ name: string; len: number; children?: React.ReactNode }> = ({ name, len, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * prog(f, 0, len)})` }}>
      <Img src={staticFile(`${DIR}/${name}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {children}
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', top: 214, right: 40, maxWidth: 560, padding: '10px 18px', borderRadius: 14, background: 'rgba(188,56,42,0.92)', color: '#fff', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 26 }}>
    {text}
  </div>
);

// beat 1: her hand pushes a phone in from the lower left; the search for his page finds nothing
const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, s(0.2), s(0.75))) * (1 - prog(f, s(6.9), s(7.35)));
  const x = -300 + 340 * t;
  const y = 1500 - 560 * t;
  const found = f > s(2.7);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'rotate(-12deg)' }}>
      <svg width={400} height={800} style={{ position: 'absolute', left: -150, top: 330 }}>
        <path d="M 20 760 L 190 70" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      </svg>
      <div style={{ width: 250, height: 450, borderRadius: 32, background: INK, padding: 13, boxShadow: '0 16px 0 rgba(21,23,28,0.22)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 22, background: '#FAFAF7', padding: 16, fontFamily: FONT_BODY }}>
          <div style={{ border: `3px solid ${INK}`, borderRadius: 999, padding: '8px 14px', fontSize: 26, fontWeight: 600, color: INK }}>Segs kiosk</div>
          {found ? (
            <div style={{ marginTop: 70, textAlign: 'center' }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: COLORS.danger }}>No results</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: INK, marginTop: 10, lineHeight: 1.2 }}>No page. No website.</div>
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ position: 'absolute', left: -30, top: 300, width: 78, height: 78, borderRadius: 999, background: INK }} />
    </div>
  );
};

// beats 3 and 4: customers drawn in code; each walks to the kiosk next door
type Walker = { from: number; to: number; x0: number; x1: number; scale: number; stand?: { until: number; x: number } };
const WALKERS: Walker[] = [
  { from: s(7.5), to: s(8.7), x0: -160, x1: 330, scale: 1.35, stand: { until: s(11.13), x: 330 } },
  { from: s(13.2), to: s(15.0), x0: -200, x1: 1260, scale: 1.25 },
  { from: s(13.7), to: s(15.4), x0: -200, x1: 1260, scale: 1.3 },
];
const walkerX = (w: Walker, f: number) => {
  if (!w.stand) return w.x0 + (w.x1 - w.x0) * prog(f, w.from, w.to);
  if (f < w.to) return w.x0 + (w.stand.x - w.x0) * prog(f, w.from, w.to);
  if (f < w.stand.until) return w.stand.x;
  return w.stand.x + (1260 - w.stand.x) * prog(f, w.stand.until, w.stand.until + s(2.6));
};
const TONES = ['#6B4E8F', '#2F6F8F', '#8F5B3A'];
const Customers: React.FC = () => {
  const f = useCurrentFrame() + s(7.4);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        {TONES.map((c, i) => (
          <filter key={c} id={`sil${i}`}>
            <feFlood floodColor={c} />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        ))}
      </defs>
      {WALKERS.map((w, i) => {
        const x = walkerX(w, f);
        const standing = !!w.stand && f >= w.to && f < w.stand.until;
        const facing = standing ? -1 : 1;
        return (
          <g key={i} filter={`url(#sil${i})`}>
            <Stick pose={POSE.stand} x={x} ground={1760} facing={facing} look="hair" talk={0} walk={standing ? null : x / 50} scale={w.scale} />
          </g>
        );
      })}
    </svg>
  );
};

// the kiosk next door lights up the moment she turns to it
const RivalSign: React.FC = () => {
  const f = useCurrentFrame() + s(7.4);
  const on = EASE_OUT(prog(f, s(12.3), s(12.6)));
  if (on <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 772, top: 748, width: 266, height: 62, borderRadius: 8, background: '#1E9E62', opacity: on, boxShadow: `0 0 ${40 * on}px rgba(48,164,108,0.9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 32, color: '#fff', letterSpacing: 1 }}>
      ORDER ONLINE
    </div>
  );
};

// the scoreboard: ticks as each customer goes next door, freezes on Segs's last line
const TICKS = [s(12.9), s(14.6), s(15.3)];
const LostSales: React.FC = () => {
  const f = useCurrentFrame();
  if (f < TICKS[0] || f >= END_CARD) return null;
  const n = TICKS.filter((t) => f >= t).length;
  const last = TICKS[n - 1];
  const bump = 1 + 0.25 * (1 - prog(f, last, last + 8));
  const frozen = f >= s(33.1);
  return (
    <div style={{ position: 'absolute', top: 104, right: 40, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 16, background: frozen ? '#2C3138' : COLORS.danger, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 700, boxShadow: '0 10px 0 rgba(21,23,28,0.25)' }}>
      <span style={{ fontSize: 26, letterSpacing: 1 }}>LOST SALES</span>
      <span style={{ fontSize: 52, display: 'inline-block', transform: `scale(${bump})` }}>{n}</span>
    </div>
  );
};

// beat 5: Akpos as a cut-out over the plate; he slides in, breathes and chews
const AkposCutout: React.FC = () => {
  const f = useCurrentFrame();
  const slide = 1 - EASE_OUT(prog(f, 0, 9));
  const breathe = 1 + 0.01 * Math.sin(f / 9);
  const chew = Math.max(0, Math.sin(f / 2.2)) * 3;
  return (
    <Img
      src={staticFile(`${DIR}/akpos-lean-cut.png`)}
      style={{ position: 'absolute', left: 482 + 420 * slide, top: 735 + chew, width: 1039 * 0.4, transform: `scaleX(-1) scaleY(${breathe})`, transformOrigin: '50% 100%' }}
    />
  );
};

const PinnedP1: React.FC = () => (
  <>
    <RivalSign />
    <Customers />
    <Sequence from={s(15.35) - s(7.4)}>
      <AkposCutout />
    </Sequence>
  </>
);

// beat 7: the dates slam down, then the website builds itself
const DatesAndSite: React.FC = () => {
  const f = useCurrentFrame() + s(16.99);
  const slam = (at: number) => 1 + 0.6 * (1 - EASE_OUT(prog(f, at, at + 6)));
  const calOut = 1 - prog(f, s(26.5), s(26.9));
  const c1 = s(22.97);
  const c2 = s(23.77);
  const site = s(27.25);
  const siteT = EASE_OUT(prog(f, site, site + 10)) * (1 - prog(f, s(30.9), s(31.2)));
  return (
    <>
      {f >= c1 && calOut > 0 ? <Calendar day="13" month="NOV" x={300} y={330} w={270} rot={-5} scale={slam(c1)} opacity={calOut} /> : null}
      {f >= c2 && calOut > 0 ? <Calendar day="14" month="NOV" x={650} y={350} w={270} rot={5} scale={slam(c2)} opacity={calOut} /> : null}
      {siteT > 0 ? <MiniSite kind="shop" x={520} y={380} w={600} scale={0.6 + 0.4 * siteT} opacity={siteT} rot={-3} /> : null}
    </>
  );
};

// beat 8: Segs flips the board on his kiosk
const KioskSign: React.FC = () => {
  const f = useCurrentFrame() + s(16.99);
  const flip = EASE_OUT(prog(f, s(31.3), s(31.75)));
  if (flip <= 0) return null;
  return (
    <div style={{ position: 'absolute', left: 14, top: 448, width: 572, height: 112, perspective: 800 }}>
      <div style={{ width: '100%', height: '100%', transform: `rotateX(${(1 - flip) * 90}deg)`, transformOrigin: '50% 0%', background: COLORS.warn, border: `5px solid ${INK}`, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_DISPLAY, fontWeight: 700, color: INK, lineHeight: 1.05 }}>
        <span style={{ fontSize: 40 }}>13 AND 14 NOV</span>
        <span style={{ fontSize: 34 }}>BUILDING MY WEBSITE</span>
      </div>
    </div>
  );
};

// beat 9: the link slides up where Segs is pointing
const LinkCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = EASE_OUT(prog(f, s(0.25), s(0.65)));
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 300 + (1 - t) * 120, opacity: t, display: 'flex', justifyContent: 'center' }}>
      <div style={{ padding: '18px 30px', borderRadius: 999, background: COLORS.warn, border: `5px solid ${INK}`, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 34, color: INK, boxShadow: '0 10px 0 rgba(21,23,28,0.25)' }}>
        Link below: Build With AI
      </div>
    </div>
  );
};

const CUES: { at: number; src: string; vol: number }[] = [
  { at: s(0.2), src: 'whoosh', vol: 0.35 },
  { at: s(2.7), src: 'tap', vol: 0.5 },
  { at: s(9.0), src: 'danfo-pass', vol: 0.15 },
  { at: s(12.3), src: 'ping', vol: 0.45 },
  ...TICKS.map((t) => ({ at: t, src: 'tap', vol: 0.55 })),
  { at: s(15.35), src: 'whoosh', vol: 0.3 },
  { at: s(22.97), src: 'slam', vol: 0.5 },
  { at: s(23.77), src: 'slam', vol: 0.5 },
  { at: s(27.25), src: 'pop', vol: 0.5 },
  { at: s(31.3), src: 'stamp', vol: 0.5 },
  { at: s(35.4), src: 'slide-up', vol: 0.4 },
  { at: END_CARD + 60, src: 'ping', vol: 0.45 },
];

const Ai3Customer: React.FC = () => {
  const lines = VO.map((l) => ({ ...l, accent: SPEAKER[l.who] }));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SCENES.map((sc) => (
        <Sequence key={sc.plate} from={sc.from} durationInFrames={sc.to - sc.from}>
          <Plate name={sc.plate} len={sc.to - sc.from}>
            {sc.plate === 'p1-plate' ? <PinnedP1 /> : null}
            {sc.plate === 'p4-lean' ? <KioskSign /> : null}
          </Plate>
          {ANIMATIC && sc.clip ? (
            <Sequence from={sc.clip.at - sc.from} durationInFrames={(sc.clip.until ?? sc.to) - sc.clip.at}>
              <Tag text={sc.clip.note} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}
      <Sequence durationInFrames={s(7.4)}>
        <Phone />
      </Sequence>
      <Sequence from={s(15.35)} durationInFrames={s(16.99) - s(15.35)}>
        {ANIMATIC ? <Tag text="CUT-OUT: a still that breathes and chews" /> : null}
      </Sequence>
      <Sequence from={s(16.99)} durationInFrames={s(35.15) - s(16.99)}>
        <DatesAndSite />
      </Sequence>
      <Sequence from={s(35.15)} durationInFrames={END_CARD - s(35.15)}>
        <LinkCard />
      </Sequence>
      <LostSales />
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
      {CUES.map((c, i) => (
        <Sequence key={i} from={c.at} durationInFrames={90}>
          <Audio src={staticFile(`${DIR}/audio/${c.src}.mp3`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Ai3Customer;
