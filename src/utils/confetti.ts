import confetti from 'canvas-confetti';
import { ColorTheme, THEMES } from '../theme/colorThemes';

// Active global theme for confetti stars & particles
let activeTheme: ColorTheme = THEMES[0];

export function setGlobalConfettiTheme(theme: ColorTheme) {
  if (theme) {
    activeTheme = theme;
  }
}

export function getGlobalConfettiTheme(): ColorTheme {
  return activeTheme;
}

export interface ConfettiThemeOptions {
  starColors?: string[];
  confettiColors?: string[];
  theme?: ColorTheme;
}

/**
 * Fires confetti with star particles tailored to the active color palette.
 * The star colors dynamically adapt to whichever palette (Sky Blue, Strawberry Milk,
 * Matcha Latte, Lavender Whisper, Buttercup Honey) is active.
 */
export function firePaperConfetti(
  originX = 0.5,
  originY = 0.6,
  themeOrOptions?: ColorTheme | ConfettiThemeOptions | string[]
) {
  let stars: string[] = activeTheme.starColors || ['#94bee3', '#1b3c6e', '#4a90e2', '#bcdcf2', '#ffffff'];
  let confettis: string[] = activeTheme.confettiColors || [
    '#94bee3',
    '#1b3c6e',
    '#faf6ea',
    '#bcdcf2',
    '#a2cbeb',
    '#ffffff',
  ];

  if (themeOrOptions) {
    if (Array.isArray(themeOrOptions)) {
      stars = themeOrOptions;
      confettis = themeOrOptions;
    } else if ('starColors' in themeOrOptions && themeOrOptions.starColors) {
      stars = themeOrOptions.starColors;
      if (themeOrOptions.confettiColors) {
        confettis = themeOrOptions.confettiColors;
      }
    } else if ('id' in themeOrOptions && (themeOrOptions as ColorTheme).starColors) {
      stars = (themeOrOptions as ColorTheme).starColors;
      confettis = (themeOrOptions as ColorTheme).confettiColors;
    }
  }

  // 1. Initial burst with mixed scrapbook paper bits, circles, and theme stars
  confetti({
    particleCount: 45,
    spread: 75,
    origin: { x: originX, y: originY },
    colors: confettis,
    shapes: ['square', 'circle', 'star'],
    scalar: 1.15,
    drift: 0,
    ticks: 240,
    gravity: 0.9,
  });

  // 2. High-priority instant star burst right at the clicked button location
  confetti({
    particleCount: 30,
    spread: 90,
    origin: { x: originX, y: originY },
    colors: stars,
    shapes: ['star'],
    scalar: 1.35,
    drift: 0,
    ticks: 220,
    gravity: 0.85,
  });

  // 3. Secondary delayed flanking stars flying out with palette colors
  setTimeout(() => {
    confetti({
      particleCount: 22,
      angle: 60,
      spread: 60,
      origin: { x: Math.max(0.05, originX - 0.15), y: originY },
      colors: stars,
      shapes: ['star'],
      scalar: 1.25,
      ticks: 220,
      gravity: 0.8,
    });
    confetti({
      particleCount: 22,
      angle: 120,
      spread: 60,
      origin: { x: Math.min(0.95, originX + 0.15), y: originY },
      colors: stars,
      shapes: ['star'],
      scalar: 1.25,
      ticks: 220,
      gravity: 0.8,
    });
  }, 100);
}
