// Brand fonts (Qodeup, as on the site), loaded from Google Fonts (bundled by Remotion at render time).
// FONT_HEADLINE is Instrument Serif: ONE weight (400, plus italic), so never give it fontWeight —
// it fakes bold. Weighted headings and labels use FONT_DISPLAY (Geist, every weight).
import { loadFont as loadDisplay } from '@remotion/google-fonts/Geist';
import { loadFont as loadBody } from '@remotion/google-fonts/Geist';
import { loadFont as loadMono } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadHeadline } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadSerif } from '@remotion/google-fonts/Spectral';
import { loadFont as loadEditorial } from '@remotion/google-fonts/SourceSerif4';

export const FONT_DISPLAY = loadDisplay('normal', { weights: ['500', '600', '700'], subsets: ['latin'] }).fontFamily;
export const FONT_BODY = loadBody('normal', { weights: ['400', '500', '600'], subsets: ['latin'] }).fontFamily;
export const FONT_MONO = loadMono('normal', { weights: ['400', '500', '700'], subsets: ['latin'] }).fontFamily;
export const FONT_HEADLINE = loadHeadline('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
loadHeadline('italic', { weights: ['400'], subsets: ['latin'] });
// serif for the Claude Code wordmark clone (close match to the app's serif)
export const FONT_SERIF = loadSerif('normal', { weights: ['500', '600'], subsets: ['latin'] }).fontFamily;
// heavy editorial serif for the vox collage engine's headlines (Publico-ish; Spectral maxes
// at 600 and reads too light/bookish over collage layers)
export const FONT_EDITORIAL = loadEditorial('normal', { weights: ['600', '700', '900'], subsets: ['latin'] }).fontFamily;
