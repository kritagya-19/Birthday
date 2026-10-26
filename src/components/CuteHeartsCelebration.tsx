import React, { useMemo } from 'react';
import { ColorTheme, THEMES } from '../theme/colorThemes';

export interface CuteHeartsBurstState {
  active: boolean;
  originX: number;
  originY: number;
  burstKey: number;
}

interface CuteHeartsCelebrationProps {
  burst: CuteHeartsBurstState;
  theme?: ColorTheme;
}

type CuteHeartVariant = 'kawaii' | 'stitched' | 'double' | 'puffy';

const VARIANTS: CuteHeartVariant[] = ['kawaii', 'stitched', 'double', 'puffy'];

// 22 Cute Hearts bursting directly out of the clicked "OUR LOVE STORY" button
const BUTTON_BURST_ITEMS = Array.from({ length: 22 }, (_, i) => {
  // Spread across a wide upward/inward fan
  const t = i / 21; // 0 .. 1
  const spreadFactor = t * 2 - 1; // -1 .. +1
  const tier = (i % 3) + 1; // 1, 2, 3 distance rings
  return {
    id: i,
    spreadFactor,
    tier,
    sizePx: 30 + ((i * 11) % 4) * 9, // 30px .. 57px
    delayMs: (i * 23) % 210,
    durMs: 980 + ((i * 47) % 340),
    rotStart: (i % 2 === 0 ? -1 : 1) * (10 + (i % 14)),
    rotMid: (i % 2 === 0 ? 1 : -1) * (8 + (i % 12)),
    rotEnd: (i % 2 === 0 ? -1 : 1) * (12 + (i % 15)),
    peakScale: 0.96 + ((i * 7) % 4) * 0.08,
    variant: VARIANTS[i % VARIANTS.length],
    colorIdx: i,
  };
});

// 24 Cute Hearts blooming & fluttering playfully across the scrapbook page
const FLOATING_HEART_ITEMS = (() => {
  const cols = 6;
  const rows = 4;
  const items: Array<{
    id: number;
    leftPct: number;
    topPct: number;
    sizePx: number;
    delayMs: number;
    durMs: number;
    swayPx: number;
    rotStart: number;
    rotMid: number;
    rotEnd: number;
    variant: CuteHeartVariant;
    colorIdx: number;
  }> = [];

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (((idx * 29) % 9) - 4) * 1.3;
      const jitterY = (((idx * 37) % 7) - 3) * 1.5;
      const leftPct = 10 + (c / (cols - 1)) * 80 + jitterX;
      const topPct = 20 + (r / (rows - 1)) * 64 + jitterY;

      const rowFromBottom = rows - 1 - r;
      const delayMs = 45 + rowFromBottom * 85 + ((idx * 31) % 140);
      const durMs = 1080 + ((idx * 53) % 300);

      items.push({
        id: idx,
        leftPct,
        topPct,
        sizePx: 34 + ((idx * 13) % 4) * 10, // 34px .. 64px
        delayMs,
        durMs,
        swayPx: (idx % 2 === 0 ? 1 : -1) * (14 + ((idx * 19) % 22)),
        rotStart: ((idx * 23) % 28) - 14,
        rotMid: (idx % 2 === 0 ? 1 : -1) * (6 + (idx % 10)),
        rotEnd: (idx % 2 === 0 ? -1 : 1) * (10 + (idx % 12)),
        variant: VARIANTS[(idx + r) % VARIANTS.length],
        colorIdx: idx + c,
      });
      idx++;
    }
  }
  return items;
})();

interface HeartTone {
  primary: string;
  secondary: string;
  cheek: string;
}

const CuteScrapbookHeartSVG: React.FC<{
  variant: CuteHeartVariant;
  tone: HeartTone;
}> = ({ variant, tone }) => {
  return (
    <svg
      viewBox="0 0 100 92"
      className="w-full h-auto overflow-visible drop-shadow-[0_6px_14px_rgba(190,18,60,0.22)]"
      fill="none"
    >
      {/* Crisp White Die-Cut Scrapbook Sticker Rim */}
      <path
        d="M50 84 C45.5 79.5, 7 52, 7 27.5 C7 13.8, 17.8 4.5, 31 4.5 C39.4 4.5, 46.2 9.4, 50 15.6 C53.8 9.4, 60.6 4.5, 69 4.5 C82.2 4.5, 93 13.8, 93 27.5 C93 52, 54.5 79.5, 50 84 Z"
        fill={tone.primary}
        stroke="#ffffff"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />

      {/* Variant 1: Kawaii Blushing Smiling Heart */}
      {variant === 'kawaii' && (
        <g>
          {/* Glossy Top-Left Highlight */}
          <path
            d="M21 26 C21 17.5, 27.5 13, 35 13"
            stroke="rgba(255,255,255,0.68)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Rosy Kawaii Cheeks */}
          <ellipse cx="32" cy="44" rx="6.2" ry="3.8" fill={tone.cheek} opacity="0.88" />
          <ellipse cx="68" cy="44" rx="6.2" ry="3.8" fill={tone.cheek} opacity="0.88" />
          {/* Happy Curved Eyes */}
          <path
            d="M34 36 Q38 31 42 36"
            stroke="#fffdf9"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M58 36 Q62 31 66 36"
            stroke="#fffdf9"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Tiny Sweet Smile */}
          <path
            d="M45.5 43.5 Q50 48.5 54.5 43.5"
            stroke="#fffdf9"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Variant 2: Quilted Stitched Scrapbook Heart */}
      {variant === 'stitched' && (
        <g>
          <path
            d="M50 72 C39 62, 16 44, 16 28 C16 19, 22.8 13, 31.5 13 C38 13, 44.8 17, 50 23.5 C55.2 17, 62 13, 68.5 13 C77.2 13, 84 19, 84 28 C84 44, 61 62, 50 72 Z"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.6"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="24" r="3" fill="rgba(255,255,255,0.7)" />
        </g>
      )}

      {/* Variant 3: Nested Concentric Double-Heart Sticker */}
      {variant === 'double' && (
        <g>
          <path
            d="M50 67 C34 53, 21 40, 21 27.5 C21 20, 26.5 15, 33.5 15 C39.5 15, 45.5 19, 50 25 C54.5 19, 60.5 15, 66.5 15 C73.5 15, 79 20, 79 27.5 C79 40, 66 53, 50 67 Z"
            fill={tone.secondary}
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M29 25 C29 20.5, 32.5 18.5, 36.5 18.5"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Variant 4: Puffy Candy Glossy Heart */}
      {variant === 'puffy' && (
        <g>
          <path
            d="M20 28 C20 18, 27 12.5, 36 12.5"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="21" cy="37" r="2.6" fill="rgba(255,255,255,0.72)" />
        </g>
      )}
    </svg>
  );
};

export const CuteHeartsCelebration: React.FC<CuteHeartsCelebrationProps> = ({
  burst,
  theme = THEMES[0],
}) => {
  const heartTones = useMemo<HeartTone[]>(
    () => [
      {
        primary: '#ff4d6d', // Sweet Strawberry Red-Pink
        secondary: '#ffb3c1',
        cheek: '#ffe5ec',
      },
      {
        primary: '#fb7185', // Warm Blush Rose
        secondary: '#ffe4e6',
        cheek: '#fff1f2',
      },
      {
        primary: '#ff758f', // Bubblegum Kawaii Pink
        secondary: '#ffccd5',
        cheek: '#fff0f3',
      },
      {
        primary: theme.scallopColor, // Active Scrapbook Palette Pastel
        secondary: theme.scallopLight,
        cheek: '#fda4af',
      },
      {
        primary: '#f43f5e', // Romantic Rose
        secondary: '#fda4af',
        cheek: '#ffe4e6',
      },
      {
        primary: theme.accentColor, // Active Scrapbook Palette Accent
        secondary: theme.scallopColor,
        cheek: '#fda4af',
      },
    ],
    [theme]
  );

  if (!burst.active) return null;

  const originLeftPct = Math.max(10, Math.min(92, burst.originX * 100));
  const originTopPct = Math.max(15, Math.min(92, burst.originY * 100));
  // Bias horizontal fan toward screen center when button is near right edge
  const centerBiasVw = (50 - originLeftPct) * 0.45;

  return (
    <div
      key={burst.burstKey}
      aria-hidden="true"
      className="fixed inset-0 z-[120] pointer-events-none overflow-hidden select-none"
    >
      {/* Layer 1: Fountain of Cute Kawaii Hearts Bursting Directly from "OUR LOVE STORY" Button */}
      {BUTTON_BURST_ITEMS.map((item) => {
        const tone = heartTones[item.colorIdx % heartTones.length];
        const dxVw = centerBiasVw * (0.35 + item.tier * 0.22) + item.spreadFactor * (14 + item.tier * 9);
        const dyVh = -(16 + item.tier * 17 + (1 - Math.abs(item.spreadFactor)) * 14);

        return (
          <div
            key={`btn-heart-${item.id}`}
            className="absolute animate-cute-heart-burst"
            style={
              {
                left: `${originLeftPct}%`,
                top: `${originTopPct}%`,
                width: `${item.sizePx}px`,
                '--burst-tx': `${dxVw.toFixed(1)}vw`,
                '--burst-ty': `${dyVh.toFixed(1)}vh`,
                '--burst-delay': `${item.delayMs}ms`,
                '--burst-dur': `${item.durMs}ms`,
                '--burst-rot-start': `${item.rotStart}deg`,
                '--burst-rot-mid': `${item.rotMid}deg`,
                '--burst-rot-end': `${item.rotEnd}deg`,
                '--burst-scale': `${item.peakScale}`,
              } as React.CSSProperties
            }
          >
            <CuteScrapbookHeartSVG variant={item.variant} tone={tone} />
          </div>
        );
      })}

      {/* Layer 2: Playful Cute Hearts Blooming & Fluttering Across the Scrapbook Page */}
      {FLOATING_HEART_ITEMS.map((item) => {
        const tone = heartTones[item.colorIdx % heartTones.length];

        return (
          <div
            key={`float-heart-${item.id}`}
            className="absolute animate-cute-heart-float"
            style={
              {
                left: `${item.leftPct}%`,
                top: `${item.topPct}%`,
                width: `${item.sizePx}px`,
                '--float-delay': `${item.delayMs}ms`,
                '--float-dur': `${item.durMs}ms`,
                '--float-sway-x': `${item.swayPx}px`,
                '--float-rot-start': `${item.rotStart}deg`,
                '--float-rot-mid': `${item.rotMid}deg`,
                '--float-rot-end': `${item.rotEnd}deg`,
              } as React.CSSProperties
            }
          >
            <CuteScrapbookHeartSVG variant={item.variant} tone={tone} />
          </div>
        );
      })}
    </div>
  );
};
