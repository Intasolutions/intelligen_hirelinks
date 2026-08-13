import localFont from 'next/font/local';

// Helvetica Neue — full weight family used across the public site's nav, body,
// and buttons per the Figma design (font-['Helvetica_Neue:*'] on every text layer).
export const helveticaNeue = localFont({
  src: [
    { path: '../fonts/helvetica-neue-5/HelveticaNeueThin.otf', weight: '100', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueThinItalic.otf', weight: '100', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueUltraLight.otf', weight: '200', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueUltraLightItalic.otf', weight: '200', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueLight.otf', weight: '300', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueLightItalic.otf', weight: '300', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueRoman.otf', weight: '400', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueItalic.ttf', weight: '400', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueMedium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueMediumItalic.otf', weight: '500', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueBold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueBoldItalic.otf', weight: '700', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueHeavy.otf', weight: '800', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueHeavyItalic.otf', weight: '800', style: 'italic' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueBlack.otf', weight: '900', style: 'normal' },
    { path: '../fonts/helvetica-neue-5/HelveticaNeueBlackItalic.otf', weight: '900', style: 'italic' },
  ],
  variable: '--font-helvetica-neue',
  display: 'swap',
});

// FH Lecturis — display font for large headline/watermark text. Uppercase,
// digits, and basic punctuation ONLY (trial font, no lowercase glyphs) — use
// for all-caps headings, never body copy or mixed-case text.
export const fhLecturis = localFont({
  src: [
    { path: '../fonts/FH Lecturis Font Family/fhlecturistest-light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/FH Lecturis Font Family/fhlecturistest-regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/FH Lecturis Font Family/fhlecturistest-bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-fh-lecturis',
  display: 'swap',
});

// FH Lecturis Rounded — same coverage as above, rounded terminals variant.
export const fhLecturisRounded = localFont({
  src: [
    { path: '../fonts/FH Lecturis Font Family/fhlecturisroundedtest-light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/FH Lecturis Font Family/fhlecturisroundedtest-regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/FH Lecturis Font Family/fhlecturisroundedtest-bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-fh-lecturis-rounded',
  display: 'swap',
});
