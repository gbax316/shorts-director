// Video brand tokens (see /brand.md). Import these in every shot
// so all videos stay consistent; change a value here and every shot updates.
// Brand: Qodeup. Source of truth is the live site (qodeup-web src/app/(site)/site.css) and the
// logo (media/library/logos/qodeup-q-icon.png); the logo colours were sampled from the file.
import { Easing } from 'remotion';

// Which ground a short sits on by default: 'night' (near-black and navy, gold on navy, the
// site's signature) or 'day' (the site's light edition). BrandBg follows it; a shot can override.
export const BRAND_GROUND: 'day' | 'night' = 'night';

export const COLORS = {
  // roles
  accent: '#E8792A', // Qodeup orange — primary highlight, active state, progress
  accent2: '#175674', // logo deep blue — secondary emphasis, pairs with accent
  signal: '#218D87', // logo teal — success / "free" / confirms
  signalAlt: '#2BB3AB', // lifted teal for success on the night ground
  warn: '#F2B21B', // Qodeup gold — attention, highlight sweeps, the signature on navy
  danger: '#BC382A', // logo red — errors, "the expensive way"
  ink: '#0B0D10', // primary text on day
  muted: '#55534E', // secondary text on day
  paper: '#FAFAF7', // day ground
  cream: '#F3EFE8', // alt day band; also text on night
  line: '#E4DED3', // 1px borders on day
  accentOnDay: '#B4501A', // orange for TEXT on the day ground (plain orange is too light to read)
  // night ground
  night: '#0B0D10',
  navy: '#0C1622',
  surface: '#14181D', // cards and panels on night
  onNight: '#F3EFE8', // primary text on night
  onNightSoft: '#B9B2A6', // secondary text on night
  lineNight: '#2C3138', // 1px borders on night
  // dark UI / terminal scale, warmed to sit with the brand
  d900: '#0B0D10',
  d800: '#14181D',
  d600: '#2C3138',
  d400: '#8F8A82',
  d300: '#D9D3C8',
} as const;

// signature gradient: gold -> orange, the run of colour through the Q mark
export const GRADIENT = `linear-gradient(120deg, ${COLORS.warn}, ${COLORS.accent})`;

export const RADIUS = { card: 16, panel: 14, window: 10, pill: 999 } as const;

export const SHADOW = {
  soft: '0 8px 32px rgba(11,13,16,0.10)',
  card: '0 10px 40px rgba(11,13,16,0.08)',
  night: '0 12px 48px rgba(0,0,0,0.45)',
} as const;

// Confident, eased, no cartoon bounce. Use these — never Easing.out(...) wrappers.
export const EASINGS = {
  easeOut: Easing.bezier(0.33, 1, 0.68, 1),
  easeIn: Easing.bezier(0.32, 0, 0.67, 0),
  easeInOut: Easing.bezier(0.37, 0, 0.63, 1),
  overshoot: Easing.bezier(0.34, 1.4, 0.64, 1), // gentle, no cartoon bounce
} as const;
