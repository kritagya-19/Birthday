import React from 'react';

interface HeartFloodTransitionProps {
  phase: 'idle' | 'filling' | 'revealing';
}

const HEART_COLORS = [
  '#e11d48', // Crimson Rose
  '#f43f5e', // Vibrant Rose
  '#fb7185', // Warm Blush Pink
  '#ff4d6d', // Sweet Strawberry
  '#fda4af', // Soft Pastel Petal
  '#be123c', // Deep Velvet Rose
];

// 28 Rising Fountain Hearts surging from bottom across the full viewport width
const RISING_HEARTS = Array.from({ length: 28 }, (_, i) => {
  const col = (i + 0.5) * (100 / 28);
  const offset = ((i * 17) % 7) - 3;
  return {
    id: i,
    leftPct: Math.max(2, Math.min(98, col + offset * 0.6)),
    sizeVw: 6.5 + ((i * 13) % 5) * 1.6,
    delayMs: ((i * 53) % 420),
    durMs: 980 + ((i * 71) % 340),
    driftPx: ((i % 2 === 0 ? 1 : -1) * (12 + ((i * 19) % 26))),
    rotStart: (i % 2 === 0 ? -1 : 1) * (8 + (i % 9)),
    rotEnd: (i % 2 === 0 ? 1 : -1) * (10 + (i % 12)),
    color: HEART_COLORS[i % HEART_COLORS.length],
  };
});

// 7 columns x 5 rows = 35 Overlapping Plush Hearts that fill 100% of the screen bottom-to-top
const PACKING_HEARTS = (() => {
  const cols = 7;
  const rows = 5;
  const items: Array<{
    id: number;
    leftPct: number;
    topPct: number;
    delayMs: number;
    tiltDeg: number;
    color: string;
    hasFace: boolean;
  }> = [];

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (((idx * 29) % 9) - 4) * 1.1;
      const jitterY = (((idx * 37) % 7) - 3) * 1.1;
      const leftPct = (c / (cols - 1)) * 100 + jitterX;
      const topPct = (r / (rows - 1)) * 100 + jitterY;

      // Bottom-to-top wave: bottom row (r=4) pops first, top row (r=0) finishes filling the top!
      const rowFromBottom = rows - 1 - r;
      const centerDist = Math.abs(c - 3) * 22;
      const delayMs = 110 + rowFromBottom * 155 + centerDist + ((idx * 31) % 75);
      const tiltDeg = (((idx * 23) % 25) - 12);

      items.push({
        id: idx,
        leftPct,
        topPct,
        delayMs,
        tiltDeg,
        color: HEART_COLORS[(idx + r) % HEART_COLORS.length],
        hasFace: idx % 6 === 2,
      });
      idx++;
    }
  }
  return items;
})();

export const HeartFloodTransition: React.FC<HeartFloodTransitionProps> = ({ phase }) => {
  if (phase === 'idle') return null;

  const isRevealing = phase === 'revealing';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[120] pointer-events-none overflow-hidden select-none transition-all duration-650 ease-out ${
        isRevealing ? 'opacity-0 scale-106 -translate-y-5' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* Soft Rose-Blush Backing Seal (ensures 100% opaque coverage right as screen finishes filling) */}
      <div
        className="absolute inset-0 animate-heart-flood-backdrop"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, #fb7185 0%, #f43f5e 52%, #ffe4e6 100%)',
        }}
      />

      {/* Wave 1: Rising Bubble-Heart Fountain */}
      {RISING_HEARTS.map((h) => (
        <div
          key={`rise-${h.id}`}
          className="absolute top-0 animate-heart-flood-rise"
          style={
            {
              left: `${h.leftPct}%`,
              width: `clamp(52px, ${h.sizeVw}vw, 128px)`,
              '--rise-delay': `${h.delayMs}ms`,
              '--rise-dur': `${h.durMs}ms`,
              '--heart-drift-x': `${h.driftPx}px`,
              '--heart-rot-start': `${h.rotStart}deg`,
              '--heart-rot-end': `${h.rotEnd}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 100 92"
            className="w-full h-auto drop-shadow-[0_6px_14px_rgba(136,19,55,0.25)]"
            fill="none"
          >
            <path
              d="M50 84 C46.5 79.5, 8 52, 8 28 C8 14.5, 18.5 5, 31.5 5 C39.5 5, 46.2 9.8, 50 15.5 C53.8 9.8, 60.5 5, 68.5 5 C81.5 5, 92 14.5, 92 28 C92 52, 53.5 79.5, 50 84 Z"
              fill={h.color}
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M23 26 C23 19, 28.5 14.5, 35 14.5"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>
      ))}

      {/* Wave 2: Full-Screen Packing Plush Scrapbook Hearts (Bottom-to-Top Fill) */}
      {PACKING_HEARTS.map((p) => (
        <div
          key={`pack-${p.id}`}
          className="absolute animate-heart-flood-pack"
          style={
            {
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              width: 'clamp(165px, 25vw, 360px)',
              '--pack-delay': `${p.delayMs}ms`,
              '--heart-tilt': `${p.tiltDeg}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 110 102"
            className="w-full h-auto drop-shadow-[0_10px_22px_rgba(136,19,55,0.28)]"
            fill="none"
          >
            {/* Die-cut white sticker border + plush heart fill */}
            <path
              d="M55 93 C51 88, 9 57, 9 31 C9 16, 20.5 6, 34.5 6 C43.5 6, 50.8 11.2, 55 17.5 C59.2 11.2, 66.5 6, 75.5 6 C89.5 6, 101 16, 101 31 C101 57, 59 88, 55 93 Z"
              fill={p.color}
              stroke="#fff1f2"
              strokeWidth="6.5"
              strokeLinejoin="round"
            />
            {/* Glossy top-left highlight */}
            <path
              d="M25 29 C25 21, 31 16, 38.5 16"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.78"
            />
            {/* Cute smiling kawaii face on select hearts */}
            {p.hasFace && (
              <g>
                <path
                  d="M39 43 Q43 38.5 47 43"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M63 43 Q67 38.5 71 43"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M49 50 Q55 56 61 50"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </g>
            )}
          </svg>
        </div>
      ))}
    </div>
  );
};
