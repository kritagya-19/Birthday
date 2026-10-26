import React, { useMemo } from 'react';
import { ColorTheme, THEMES } from '../theme/colorThemes';

interface FlowerFloodTransitionProps {
  phase: 'idle' | 'filling' | 'revealing';
  theme?: ColorTheme;
}

// 26 Floating Blossoms rising across the full viewport width
const RISING_FLOWERS = Array.from({ length: 26 }, (_, i) => {
  const col = (i + 0.5) * (100 / 26);
  const offset = ((i * 17) % 7) - 3;
  return {
    id: i,
    leftPct: Math.max(2, Math.min(98, col + offset * 0.65)),
    sizeVw: 6.8 + ((i * 13) % 5) * 1.5,
    delayMs: (i * 49) % 420,
    durMs: 1020 + ((i * 67) % 340),
    driftPx: (i % 2 === 0 ? 1 : -1) * (14 + ((i * 19) % 28)),
    rotStart: (i % 2 === 0 ? -1 : 1) * (15 + (i % 20)),
    rotEnd: (i % 2 === 0 ? 1 : -1) * (65 + (i % 45)),
    colorIdx: i,
    isSakura: i % 2 === 1,
  };
});

// 7 columns x 5 rows = 35 Overlapping Plush Scrapbook Flowers filling 100% of the screen
const PACKING_FLOWERS = (() => {
  const cols = 7;
  const rows = 5;
  const items: Array<{
    id: number;
    leftPct: number;
    topPct: number;
    delayMs: number;
    tiltDeg: number;
    colorIdx: number;
    hasFace: boolean;
    isSakura: boolean;
  }> = [];

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (((idx * 29) % 9) - 4) * 1.1;
      const jitterY = (((idx * 37) % 7) - 3) * 1.1;
      const leftPct = (c / (cols - 1)) * 100 + jitterX;
      const topPct = (r / (rows - 1)) * 100 + jitterY;

      // Bottom-to-top blooming wave
      const rowFromBottom = rows - 1 - r;
      const centerDist = Math.abs(c - 3) * 22;
      const delayMs = 95 + rowFromBottom * 155 + centerDist + ((idx * 31) % 75);
      const tiltDeg = ((idx * 23) % 36) - 18;

      items.push({
        id: idx,
        leftPct,
        topPct,
        delayMs,
        tiltDeg,
        colorIdx: idx + r,
        hasFace: idx % 4 === 1,
        isSakura: (idx + c) % 3 === 0,
      });
      idx++;
    }
  }
  return items;
})();

const SIX_PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const FIVE_PETAL_ANGLES = [0, 72, 144, 216, 288];

interface CuteScrapbookFlowerSvgProps {
  petalColor: string;
  centerColor: string;
  hasFace?: boolean;
  isSakura?: boolean;
}

const CuteScrapbookFlowerSvg: React.FC<CuteScrapbookFlowerSvgProps> = ({
  petalColor,
  centerColor,
  hasFace = false,
  isSakura = false,
}) => {
  const angles = isSakura ? FIVE_PETAL_ANGLES : SIX_PETAL_ANGLES;

  return (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-auto drop-shadow-[0_10px_22px_rgba(30,50,90,0.24)]"
      fill="none"
    >
      {/* Thick Die-Cut White Sticker Backing */}
      <g fill="#fffdf9" stroke="#fffdf9" strokeWidth="10" strokeLinejoin="round">
        {angles.map((deg) => (
          <ellipse
            key={`bg-${deg}`}
            cx="60"
            cy="27"
            rx={isSakura ? 19.5 : 17.5}
            ry={isSakura ? 24 : 23}
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="24" />
      </g>

      {/* Colored Plush Flower Petals */}
      <g>
        {angles.map((deg) => (
          <g key={`petal-${deg}`} transform={`rotate(${deg} 60 60)`}>
            <ellipse
              cx="60"
              cy="27"
              rx={isSakura ? 18 : 16}
              ry={isSakura ? 22.5 : 21.5}
              fill={petalColor}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Soft inner petal detail */}
            <line
              x1="60"
              y1="38"
              x2="60"
              y2="26"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>
        ))}
      </g>

      {/* Warm Sunny / Pastel Button Center */}
      <circle
        cx="60"
        cy="60"
        r="21.5"
        fill={centerColor}
        stroke="#ffffff"
        strokeWidth="3.2"
      />
      {/* Glossy Center Highlight */}
      <path
        d="M47 51 C49 46, 54 43.5, 59 43.5"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Adorable Smiling Kawaii Face on Select Blossoms */}
      {hasFace && (
        <g>
          <path
            d="M49 58 Q52.5 54 56 58"
            stroke="#78350f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M64 58 Q67.5 54 71 58"
            stroke="#78350f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M55.5 63.5 Q60 68 64.5 63.5"
            stroke="#78350f"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <ellipse cx="46.5" cy="62" rx="3.4" ry="2" fill="#fb7185" opacity="0.78" />
          <ellipse cx="73.5" cy="62" rx="3.4" ry="2" fill="#fb7185" opacity="0.78" />
        </g>
      )}
    </svg>
  );
};

export const FlowerFloodTransition: React.FC<FlowerFloodTransitionProps> = ({
  phase,
  theme = THEMES[0],
}) => {
  const palette = useMemo(
    () => [
      { petal: '#fda4af', center: '#fde047' }, // Sakura Blush + Sunny Gold
      { petal: '#ffffff', center: '#facc15' }, // Classic White Daisy + Warm Yellow
      { petal: theme.scallopColor, center: '#fef08a' }, // Theme Pastel + Soft Butter
      { petal: '#fbcfe8', center: '#fbbf24' }, // Cotton Candy Pink + Amber
      { petal: '#ddd6fe', center: '#fde047' }, // Sweet Lavender + Sunny Yellow
      { petal: '#bae6fd', center: '#fde047' }, // Sky Blossom + Sunny Yellow
      { petal: '#fb7185', center: '#fffbeb' }, // Rose Coral + Cream
      { petal: '#fef08a', center: '#fb7185' }, // Buttercup + Rosy Center
    ],
    [theme.scallopColor]
  );

  if (phase === 'idle') return null;

  const isRevealing = phase === 'revealing';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[120] pointer-events-none overflow-hidden select-none transition-all duration-650 ease-out ${
        isRevealing ? 'opacity-0 scale-106 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* Pastel Meadow Backing Seal (ensures 100% opaque coverage right as screen finishes filling) */}
      <div
        className="absolute inset-0 animate-flower-flood-backdrop"
        style={{
          background: `radial-gradient(circle at 50% 52%, #fffdf7 0%, ${theme.scallopLight} 48%, #ffe4e6 100%)`,
        }}
      />

      {/* Wave 1: Swirling Rising Blossoms */}
      {RISING_FLOWERS.map((f) => {
        const col = palette[f.colorIdx % palette.length];
        return (
          <div
            key={`flower-rise-${f.id}`}
            className="absolute top-0 animate-flower-flood-rise"
            style={
              {
                left: `${f.leftPct}%`,
                width: `clamp(56px, ${f.sizeVw}vw, 134px)`,
                '--rise-delay': `${f.delayMs}ms`,
                '--rise-dur': `${f.durMs}ms`,
                '--flower-drift-x': `${f.driftPx}px`,
                '--flower-rot-start': `${f.rotStart}deg`,
                '--flower-rot-end': `${f.rotEnd}deg`,
              } as React.CSSProperties
            }
          >
            <CuteScrapbookFlowerSvg
              petalColor={col.petal}
              centerColor={col.center}
              isSakura={f.isSakura}
            />
          </div>
        );
      })}

      {/* Wave 2: Full-Screen Blooming Plush Scrapbook Flowers (Bottom-to-Top Fill) */}
      {PACKING_FLOWERS.map((p) => {
        const col = palette[p.colorIdx % palette.length];
        return (
          <div
            key={`flower-pack-${p.id}`}
            className="absolute animate-flower-flood-pack"
            style={
              {
                left: `${p.leftPct}%`,
                top: `${p.topPct}%`,
                width: 'clamp(172px, 26vw, 370px)',
                '--pack-delay': `${p.delayMs}ms`,
                '--flower-tilt': `${p.tiltDeg}deg`,
              } as React.CSSProperties
            }
          >
            <CuteScrapbookFlowerSvg
              petalColor={col.petal}
              centerColor={col.center}
              hasFace={p.hasFace}
              isSakura={p.isSakura}
            />
          </div>
        );
      })}
    </div>
  );
};
