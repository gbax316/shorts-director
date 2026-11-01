import React from 'react';
import { Easing } from 'remotion';

/**
 * The stick-guy rig. A pose is a set of joint angles; a character's performance is a list of
 * keyframed poses, eased between. Angles are degrees from straight down, positive toward the way
 * the character faces, so one pose library serves both guys (the doubter is drawn mirrored).
 */
export type Pose = {
  lean: number; // torso, 0 upright, + forward
  head: number; // head tilt, + forward
  ua: [number, number]; // upper arm [back, front]
  fa: [number, number]; // forearm [back, front]
  th: [number, number]; // thigh [back, front]
  sh: [number, number]; // shin [back, front]
  brow: number; // -1 worried, 0 calm, 1 raised
  eyes: number; // 0 shut, 1 open, 1.8 wide
  jaw: number; // extra mouth opening, 0..1
  smile: number; // -1 frown .. 1 grin
};

const STAND: Pose = { lean: 0, head: 0, ua: [-12, 12], fa: [-6, 8], th: [-6, 6], sh: [-4, 4], brow: 0, eyes: 1, jaw: 0, smile: 0.3 };
const p = (o: Partial<Pose>): Pose => ({ ...STAND, ...o });

export const POSE = {
  stand: STAND,
  armsUp: p({ ua: [-150, 150], fa: [-170, 170], brow: 1, eyes: 1.5, smile: 1, jaw: 0.4 }),
  point: p({ lean: 6, ua: [-14, 95], fa: [-8, 100], brow: 0.6, smile: 0.8 }),
  pointUp: p({ ua: [-14, 150], fa: [-8, 172], brow: 0.8, smile: 1 }),
  folded: p({ ua: [16, -14], fa: [100, -96], brow: 0.2, head: -4, smile: -0.3 }),
  browUp: p({ ua: [16, -14], fa: [100, -96], brow: 1.1, head: 10, eyes: 0.8, smile: -0.4 }),
  shocked: p({ lean: -10, head: -14, ua: [-40, 40], fa: [-70, 70], brow: 1.2, eyes: 1.9, jaw: 0.9, smile: 0 }),
  presentCap: p({ lean: 4, ua: [-20, 70], fa: [-10, 135], brow: 0.8, smile: 1 }),
  shrug: p({ ua: [-40, 40], fa: [-110, 110], brow: 1, head: 8, smile: -0.2 }),
  wag: p({ ua: [-12, 80], fa: [-6, 160], brow: 0.4, head: -6, smile: 0.5 }),
  worried: p({ lean: -4, ua: [-30, 30], fa: [-60, 60], brow: -1, eyes: 1.4, smile: -1 }),
  reach: p({ lean: 12, ua: [-20, 88], fa: [-10, 92], brow: 0.5, smile: 0.8 }),
  shake: p({ lean: 8, ua: [-12, 70], fa: [-6, 88], brow: 0.5, smile: 1 }),
  rubEyes: p({ head: -4, ua: [-140, 140], fa: [-210, 210], brow: 1, eyes: 0, smile: 0 }),
  palmsUp: p({ ua: [-35, 35], fa: [-100, 100], brow: 1.1, eyes: 1.4, head: 6, smile: 0.2 }),
  chop: p({ lean: 6, ua: [-14, 70], fa: [-6, 40], brow: 0.3, smile: 0.4 }),
  chestHand: p({ head: -6, ua: [-12, 30], fa: [-6, 150], brow: -0.4, eyes: 1.3, smile: 0.6 }),
  fistPump: p({ ua: [-14, 150], fa: [-8, 210], brow: 1, eyes: 1.4, smile: 1, jaw: 0.3 }),
  armAround: p({ lean: 6, ua: [-14, 100], fa: [-8, 120], smile: 1, brow: 0.5 }),
  hipsProud: p({ lean: -4, head: -8, ua: [-40, 40], fa: [30, -30], smile: 1, brow: 0.3 }),
  phone: p({ ua: [-12, 40], fa: [-6, 130], brow: 0.6, eyes: 1.3, smile: 0.8 }),
  run: p({ lean: 18, ua: [-50, 60], fa: [10, 120], th: [-35, 40], sh: [-80, 10], smile: 0.8, brow: 0.6 }),
};

export type Key = { f: number; pose: Pose; ease?: (t: number) => number };

const EASE = Easing.bezier(0.33, 1, 0.68, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Pose at frame f; a move takes the frames between two keys, so set a key early to start a move early. */
export const poseAt = (keys: Key[], f: number): Pose => {
  if (f <= keys[0].f) return keys[0].pose;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) {
      const a = keys[i - 1];
      const t = (k.ease ?? EASE)((f - a.f) / (k.f - a.f));
      return {
        lean: lerp(a.pose.lean, k.pose.lean, t),
        head: lerp(a.pose.head, k.pose.head, t),
        ua: lerp2(a.pose.ua, k.pose.ua, t),
        fa: lerp2(a.pose.fa, k.pose.fa, t),
        th: lerp2(a.pose.th, k.pose.th, t),
        sh: lerp2(a.pose.sh, k.pose.sh, t),
        brow: lerp(a.pose.brow, k.pose.brow, t),
        eyes: lerp(a.pose.eyes, k.pose.eyes, t),
        jaw: lerp(a.pose.jaw, k.pose.jaw, t),
        smile: lerp(a.pose.smile, k.pose.smile, t),
      };
    }
  }
  return keys[keys.length - 1].pose;
};

/** A value track: [frame, value] pairs, eased. */
export const track = (pts: [number, number][], f: number, ease = EASE) => {
  if (f <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (f < pts[i][0]) {
      const [fa, va] = pts[i - 1];
      const [fb, vb] = pts[i];
      return lerp(va, vb, ease((f - fa) / (fb - fa)));
    }
  }
  return pts[pts.length - 1][1];
};

const INK = '#15171C';
const UPPER = 92;
const FORE = 86;
const THIGH = 118;
const SHIN = 118;
const TORSO = 186;
const HEAD = 62;

const at = (x: number, y: number, deg: number, len: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  return [x + Math.sin(r) * len, y + Math.cos(r) * len];
};

export type Look = 'cap' | 'hair';

type Props = {
  pose: Pose;
  x: number;
  ground: number;
  facing: 1 | -1;
  look: Look;
  /** 0..1, how open the mouth is from the voice */
  talk: number;
  /** the cap leaves the head and sits in the front hand */
  capInHand?: boolean;
  phone?: boolean;
  /** lift off the ground, px */
  jump?: number;
  blink?: boolean;
  /** walk cycle phase in radians, or null when standing */
  walk?: number | null;
  scale?: number;
};

export const Stick: React.FC<Props> = ({ pose, x, ground, facing, look, talk, capInHand, phone, jump = 0, blink, walk = null, scale = 1 }) => {
  let th = pose.th;
  let sh = pose.sh;
  let ua = pose.ua;
  if (walk !== null) {
    const s = Math.sin(walk);
    th = [th[0] + s * 26, th[1] - s * 26];
    sh = [sh[0] + Math.min(0, s) * 30 - 6, sh[1] - Math.max(0, s) * 30 - 6];
    ua = [ua[0] - s * 18, ua[1] + s * 18];
  }
  // stand the lower foot on the ground
  const footY = (t: number, s: number) => Math.cos((t * Math.PI) / 180) * THIGH + Math.cos((s * Math.PI) / 180) * SHIN;
  const hipY = -Math.max(footY(th[0], sh[0]), footY(th[1], sh[1])) - jump - (walk !== null ? Math.abs(Math.sin(walk)) * 6 : 0);
  const hip: [number, number] = [0, hipY];
  const neck = at(hip[0], hip[1], 180 + pose.lean, TORSO);
  const shoulder = at(neck[0], neck[1], pose.lean, 18);
  const headC = at(neck[0], neck[1], 180 + pose.lean + pose.head * 0.4, HEAD + 6);

  const limb = (from: [number, number], a: number, la: number, b: number, lb: number) => {
    const mid = at(from[0], from[1], a, la);
    const end = at(mid[0], mid[1], b, lb);
    return { mid, end, d: `M${from[0]} ${from[1]} L${mid[0]} ${mid[1]} L${end[0]} ${end[1]}` };
  };
  const arms = [limb(shoulder, ua[0] + pose.lean, UPPER, pose.fa[0] + pose.lean, FORE), limb(shoulder, ua[1] + pose.lean, UPPER, pose.fa[1] + pose.lean, FORE)];
  const legs = [limb(hip, th[0], THIGH, sh[0], SHIN), limb(hip, th[1], THIGH, sh[1], SHIN)];
  const front = arms[1].end;

  const body = [
    `M${hip[0]} ${hip[1]} L${neck[0]} ${neck[1]}`,
    ...arms.map((a) => a.d),
    ...legs.map((l) => l.d),
  ];

  const eyeOpen = blink ? 0.08 : Math.max(0.08, pose.eyes);
  const mouthOpen = Math.min(1, talk * 0.9 + pose.jaw);
  const tilt = pose.head;

  return (
    <g transform={`translate(${x} ${ground}) scale(${facing * scale} ${scale})`}>
      {/* a white keyline so the ink reads on a busy street */}
      <g stroke="#FFFFFF" strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {body.map((d, i) => (
          <path key={i} d={d} />
        ))}
        <circle cx={headC[0]} cy={headC[1]} r={HEAD + 2} fill="#FFFFFF" />
      </g>
      <g stroke={INK} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {body.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {arms.map((a, i) => (
        <circle key={i} cx={a.end[0]} cy={a.end[1]} r={13} fill={INK} />
      ))}
      {legs.map((l, i) => (
        <path key={i} d={`M${l.end[0] - 6} ${l.end[1]} l30 0`} stroke={INK} strokeWidth={15} strokeLinecap="round" />
      ))}
      <g transform={`rotate(${tilt} ${headC[0]} ${headC[1]})`}>
        <circle cx={headC[0]} cy={headC[1]} r={HEAD} fill="#FFFFFF" stroke={INK} strokeWidth={12} />
        {look === 'hair' ? (
          <path
            d={`M${headC[0] - HEAD + 4} ${headC[1] - 8} A${HEAD - 4} ${HEAD - 4} 0 0 1 ${headC[0] + HEAD - 4} ${headC[1] - 8} Q${headC[0]} ${headC[1] - 34} ${headC[0] - HEAD + 4} ${headC[1] - 8}Z`}
            fill={INK}
          />
        ) : null}
        {/* eyes */}
        {[10, 34].map((ex) => (
          <ellipse key={ex} cx={headC[0] + ex} cy={headC[1] - 4} rx={7} ry={9 * eyeOpen} fill={INK} />
        ))}
        {/* brows */}
        {[10, 34].map((ex, i) => {
          const y = headC[1] - 22 - pose.brow * 8;
          const slope = (i === 0 ? 1 : -1) * pose.brow * -3 + (pose.brow < 0 ? (i === 0 ? 6 : -6) : 0);
          return <path key={ex} d={`M${headC[0] + ex - 10} ${y + slope} L${headC[0] + ex + 10} ${y - slope}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
        })}
        {/* mouth: an open oval while talking, a curve at rest */}
        {mouthOpen > 0.06 ? (
          <ellipse cx={headC[0] + 22} cy={headC[1] + 26} rx={13 + mouthOpen * 3} ry={3 + mouthOpen * 17} fill={INK} />
        ) : (
          <path
            d={`M${headC[0] + 8} ${headC[1] + 24} Q${headC[0] + 22} ${headC[1] + 24 + pose.smile * 14} ${headC[0] + 36} ${headC[1] + 24}`}
            stroke={INK}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {look === 'cap' && !capInHand ? <Cap x={headC[0]} y={headC[1] - HEAD + 18} /> : null}
      </g>
      {look === 'cap' && capInHand ? <Cap x={front[0] - 4} y={front[1] - 8} scale={0.9} /> : null}
      {phone ? (
        <g transform={`translate(${front[0]} ${front[1]}) rotate(-12)`}>
          <rect x={-22} y={-74} width={44} height={78} rx={9} fill={INK} />
          <rect x={-17} y={-68} width={34} height={60} rx={5} fill="#F2B21B" />
        </g>
      ) : null}
    </g>
  );
};

/** The hype man's red cap, brim forward. */
export const Cap: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-60 6 A60 50 0 0 1 60 6 Z" fill="#E5302B" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <path d="M40 4 L102 12 Q104 20 92 22 L40 16 Z" fill="#E5302B" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    <circle cx={0} cy={-44} r={7} fill={INK} />
  </g>
);
