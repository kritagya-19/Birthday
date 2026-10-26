import React, { useMemo } from 'react';
import { ColorTheme, THEMES } from '../theme/colorThemes';

interface LoveCardsCelebrationProps {
  phase: 'idle' | 'filling' | 'revealing';
  theme?: ColorTheme;
}

type CardVariant = 'washi' | 'bow' | 'envelope' | 'stamp';

const VARIANTS: CardVariant[] = ['washi', 'bow', 'envelope', 'stamp'];

// Wave 1: 20 Fluttering Small Cute "LOVE" Mini-Cards rising playfully across the viewport
const FLUTTERING_CARDS = Array.from({ length: 20 }, (_, i) => {
  const col = (i + 0.5) * (100 / 20);
  const offset = ((i * 19) % 7) - 3;
  return {
    id: i,
    leftPct: Math.max(4, Math.min(96, col + offset * 0.6)),
    delayMs: (i * 53) % 380,
    durMs: 1180 + ((i * 61) % 320),
    swayPx: (i % 2 === 0 ? 1 : -1) * (16 + ((i * 17) % 24)),
    rotStart: (i % 2 === 0 ? -1 : 1) * (10 + (i % 12)),
    rotMid: (i % 2 === 0 ? 1 : -1) * (7 + (i % 9)),
    rotEnd: (i % 2 === 0 ? -1 : 1) * (8 + (i % 10)),
    variant: VARIANTS[i % VARIANTS.length],
    paletteIdx: i,
    showSideHearts: i % 2 === 0,
  };
});

// Wave 2: 6 columns x 5 rows = 30 Small Cute Scrapbook "LOVE" Cards popping across the screen
const POPPING_CARDS = (() => {
  const cols = 6;
  const rows = 5;
  const items: Array<{
    id: number;
    leftPct: number;
    topPct: number;
    delayMs: number;
    tiltDeg: number;
    variant: CardVariant;
    paletteIdx: number;
    showSideHearts: boolean;
  }> = [];

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (((idx * 29) % 9) - 4) * 0.95;
      const jitterY = (((idx * 37) % 7) - 3) * 1.05;
      const leftPct = 8 + (c / (cols - 1)) * 84 + jitterX;
      const topPct = 10 + (r / (rows - 1)) * 80 + jitterY;

      // Center-out + bottom-up playful scrapbook scatter wave
      const rowFromBottom = rows - 1 - r;
      const centerDist = Math.abs(c - 2.5) * 26;
      const delayMs = 70 + rowFromBottom * 125 + centerDist + ((idx * 31) % 70);
      const tiltDeg = ((idx * 23) % 28) - 14;

      items.push({
        id: idx,
        leftPct,
        topPct,
        delayMs,
        tiltDeg,
        variant: VARIANTS[(idx + r) % VARIANTS.length],
        paletteIdx: idx + c,
        showSideHearts: idx % 3 !== 2,
      });
      idx++;
    }
  }
  return items;
})();

interface CardPalette {
  cardBg: string;
  stitchColor: string;
  textColor: string;
  accentTone: string;
}

interface CuteMiniLoveCardProps {
  variant: CardVariant;
  palette: CardPalette;
  showSideHearts: boolean;
}

const CuteMiniLoveCard: React.FC<CuteMiniLoveCardProps> = ({
  variant,
  palette,
  showSideHearts,
}) => {
  return (
    <div className="relative w-full px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-white shadow-[0_10px_24px_rgba(30,41,59,0.20),0_2px_6px_rgba(225,29,72,0.14)] border-2 border-white">
      {/* Top Striped Washi Tape */}
      {variant === 'washi' && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-3 w-8 sm:w-9 h-2.5 sm:h-3 rounded-[2px] opacity-90 shadow-2xs border border-white/70"
          style={{
            backgroundColor: palette.accentTone,
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 3px, transparent 3px, transparent 6px)',
          }}
        />
      )}

      {/* Top Dainty Ribbon Bow */}
      {variant === 'bow' && (
        <svg
          viewBox="0 0 36 20"
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-7 h-4 drop-shadow-2xs"
          fill="none"
        >
          <path
            d="M18 10 C11 2, 2 4, 4 11 C6 16, 13 14, 18 10 Z"
            fill={palette.accentTone}
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          <path
            d="M18 10 C25 2, 34 4, 32 11 C30 16, 23 14, 18 10 Z"
            fill={palette.accentTone}
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          <circle
            cx="18"
            cy="10"
            r="3.2"
            fill="#fffdf9"
            stroke={palette.accentTone}
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* Inner Stitched Pastel Cardstock */}
      <div
        className="relative w-full rounded-lg px-2 py-1.5 sm:py-2 border border-dashed flex flex-col items-center justify-center gap-0.5 overflow-hidden"
        style={{
          backgroundColor: palette.cardBg,
          borderColor: palette.stitchColor,
        }}
      >
        {/* Envelope Flap & Mini Heart Seal */}
        {variant === 'envelope' && (
          <div className="w-full flex flex-col items-center -mt-1 mb-0.5">
            <svg viewBox="0 0 80 18" className="w-full h-3 overflow-visible" fill="none">
              <path
                d="M2 1 L40 14 L78 1"
                stroke={palette.stitchColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="12" r="4.8" fill={palette.accentTone} stroke="#ffffff" strokeWidth="1.2" />
            </svg>
          </div>
        )}

        {/* Corner Postage Heart Stamp */}
        {variant === 'stamp' && (
          <span
            className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs bg-white shadow-2xs border border-dashed flex items-center justify-center text-[8px] sm:text-[9px] leading-none"
            style={{ color: palette.accentTone, borderColor: palette.stitchColor }}
          >
            ♥
          </span>
        )}

        {/* Main Cute "LOVE" Text */}
        <div className="flex items-center justify-center gap-1 leading-none pt-0.5">
          {showSideHearts && (
            <span
              className="text-[9px] sm:text-[11px] leading-none"
              style={{ color: palette.accentTone }}
            >
              ♥
            </span>
          )}
          <span
            className="font-bubble font-extrabold text-[13px] sm:text-[16px] tracking-[0.09em] uppercase leading-none"
            style={{
              color: palette.textColor,
              textShadow: '0 1px 0 #ffffff',
            }}
          >
            LOVE
          </span>
          {showSideHearts && (
            <span
              className="text-[9px] sm:text-[11px] leading-none"
              style={{ color: palette.accentTone }}
            >
              ♥
            </span>
          )}
        </div>

        {/* Tiny Ruled Note Line */}
        <div
          className="w-9 sm:w-12 h-[1.5px] rounded-full opacity-60 mt-0.5"
          style={{ backgroundColor: palette.stitchColor }}
        />
      </div>
    </div>
  );
};

export const LoveCardsCelebration: React.FC<LoveCardsCelebrationProps> = ({
  phase,
  theme = THEMES[0],
}) => {
  const palettes = useMemo<CardPalette[]>(
    () => [
      {
        cardBg: '#fff1f2',
        stitchColor: '#fda4af',
        textColor: '#e11d48',
        accentTone: '#fb7185',
      },
      {
        cardBg: '#fffdf7',
        stitchColor: theme.scallopColor,
        textColor: theme.accentColor,
        accentTone: theme.btnBg,
      },
      {
        cardBg: '#fdf2f8',
        stitchColor: '#f9a8d4',
        textColor: '#db2777',
        accentTone: '#f472b6',
      },
      {
        cardBg: '#fefce8',
        stitchColor: '#fde047',
        textColor: '#e11d48',
        accentTone: '#fb7185',
      },
      {
        cardBg: theme.scallopLight,
        stitchColor: theme.scallopColor,
        textColor: theme.accentColor,
        accentTone: '#f43f5e',
      },
      {
        cardBg: '#f5f3ff',
        stitchColor: '#c4b5fd',
        textColor: '#be185d',
        accentTone: '#a78bfa',
      },
    ],
    [theme.accentColor, theme.btnBg, theme.scallopColor, theme.scallopLight]
  );

  if (phase === 'idle') return null;

  const isRevealing = phase === 'revealing';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[120] pointer-events-none overflow-hidden select-none transition-all duration-650 ease-out ${
        isRevealing ? 'opacity-0 scale-105 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* Soft Pastel Scrapbook Backdrop Seal */}
      <div
        className="absolute inset-0 animate-love-cards-backdrop"
        style={{
          background: `radial-gradient(circle at 50% 50%, #fffdf9 0%, ${theme.scallopLight} 52%, #ffe4e6 100%)`,
        }}
      />

      {/* Wave 1: Fluttering Small Cute "LOVE" Mini-Cards Rising Across Viewport */}
      {FLUTTERING_CARDS.map((c) => {
        const pal = palettes[c.paletteIdx % palettes.length];
        return (
          <div
            key={`love-flutter-${c.id}`}
            className="absolute top-0 animate-love-card-flutter"
            style={
              {
                left: `${c.leftPct}%`,
                width: 'clamp(82px, 9.5vw, 118px)',
                '--flutter-delay': `${c.delayMs}ms`,
                '--flutter-dur': `${c.durMs}ms`,
                '--card-sway-x': `${c.swayPx}px`,
                '--card-rot-start': `${c.rotStart}deg`,
                '--card-rot-mid': `${c.rotMid}deg`,
                '--card-rot-end': `${c.rotEnd}deg`,
              } as React.CSSProperties
            }
          >
            <CuteMiniLoveCard
              variant={c.variant}
              palette={pal}
              showSideHearts={c.showSideHearts}
            />
          </div>
        );
      })}

      {/* Wave 2: Bouncy Scatter of Small Cute "LOVE" Note Cards Across Full Screen */}
      {POPPING_CARDS.map((p) => {
        const pal = palettes[p.paletteIdx % palettes.length];
        return (
          <div
            key={`love-pop-${p.id}`}
            className="absolute animate-love-card-pop"
            style={
              {
                left: `${p.leftPct}%`,
                top: `${p.topPct}%`,
                width: 'clamp(96px, 12.5vw, 146px)',
                '--pop-delay': `${p.delayMs}ms`,
                '--card-tilt': `${p.tiltDeg}deg`,
              } as React.CSSProperties
            }
          >
            <CuteMiniLoveCard
              variant={p.variant}
              palette={pal}
              showSideHearts={p.showSideHearts}
            />
          </div>
        );
      })}
    </div>
  );
};
