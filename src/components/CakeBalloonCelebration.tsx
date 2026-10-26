import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ColorTheme, THEMES } from '../theme/colorThemes';

interface CakeBalloonCelebrationProps {
  onComplete: () => void;
  theme?: ColorTheme;
}

interface BalloonItem {
  id: number;
  leftPct: number;
  sizePx: number;
  delay: number;
  duration: number;
  swayPx: number;
  tiltDeg: number;
  color: string;
  isHeart: boolean;
  hasFace: boolean;
}

export const CakeBalloonCelebration: React.FC<CakeBalloonCelebrationProps> = ({
  onComplete,
  theme = THEMES[0],
}) => {
  const [phase, setPhase] = useState<'entering' | 'wish' | 'done'>('entering');

  const balloons = useMemo<BalloonItem[]>(() => {
    const palette = [
      '#fb7185', // Rose pink
      theme.scallopColor,
      '#fda4af', // Soft blush
      theme.accentColor,
      '#fde047', // Sunny butter
      '#c4b5fd', // Pastel lavender
      '#7dd3fc', // Sky blue
      '#f43f5e', // Berry rose
    ];

    return Array.from({ length: 18 }, (_, i) => {
      // Spread across left, center-edges, and right so balloons frame & fill the screen
      const basePct = 4 + (i * 92) / 17;
      const jitter = ((i * 19) % 7) - 3;
      return {
        id: i,
        leftPct: Math.max(3, Math.min(97, basePct + jitter)),
        sizePx: 58 + ((i * 17) % 4) * 14,
        delay: ((i * 73) % 550) / 1000,
        duration: 2.1 + ((i * 41) % 7) * 0.14,
        swayPx: (i % 2 === 0 ? 1 : -1) * (16 + ((i * 13) % 22)),
        tiltDeg: (i % 2 === 0 ? -1 : 1) * (6 + (i % 8)),
        color: palette[i % palette.length],
        isHeart: i % 4 === 1,
        hasFace: i % 3 === 0,
      };
    });
  }, [theme]);

  useEffect(() => {
    sounds.playBoxOpen();
    firePaperConfetti(0.5, 0.58, theme);

    const wishTimer = window.setTimeout(() => {
      setPhase('wish');
      sounds.playMagicSparkles();
      firePaperConfetti(0.28, 0.45, theme.starColors);
      firePaperConfetti(0.72, 0.45, theme.starColors);
    }, 950);

    const completeTimer = window.setTimeout(() => {
      setPhase('done');
      sounds.playChime();
      onComplete();
    }, 2650);

    return () => {
      window.clearTimeout(wishTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md select-none overflow-hidden"
      onClick={() => {
        sounds.playPop();
        onComplete();
      }}
    >
      {/* Warm Radiant Scrapbook Sunburst Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.85, scale: [0.85, 1.18, 1.08], rotate: 120 }}
        transition={{ duration: 2.6, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div
          className="w-[680px] h-[680px] rounded-full blur-2xl opacity-75"
          style={{
            background: `radial-gradient(circle, #fffbeb 0%, ${theme.scallopLight} 38%, ${theme.scallopColor}55 62%, transparent 75%)`,
          }}
        />
        <svg
          viewBox="0 0 200 200"
          className="absolute w-[620px] h-[620px] animate-spin"
          style={{ animationDuration: '22s' }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <polygon
              key={i}
              points="100,100 93,0 107,0"
              fill="#ffffff"
              opacity="0.16"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* Rising Cute Die-Cut Scrapbook Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {balloons.map((b) => (
          <motion.div
            key={b.id}
            initial={{
              y: '112vh',
              x: 0,
              rotate: -b.tiltDeg,
              scale: 0.85,
              opacity: 0,
            }}
            animate={{
              y: '-32vh',
              x: [0, b.swayPx, -b.swayPx * 0.7, b.swayPx * 0.5],
              rotate: [-b.tiltDeg, b.tiltDeg, -b.tiltDeg * 0.6, b.tiltDeg],
              scale: [0.88, 1.04, 1],
              opacity: [0, 1, 1, 0.92],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              ease: 'easeOut',
            }}
            style={{
              left: `${b.leftPct}%`,
              width: b.sizePx,
            }}
            className="absolute top-0 -translate-x-1/2 drop-shadow-[0_8px_16px_rgba(20,40,75,0.25)]"
          >
            {b.isHeart ? (
              <svg viewBox="0 0 90 135" className="w-full h-auto overflow-visible" fill="none">
                {/* Curling Ribbon String */}
                <path
                  d="M45 78 Q38 94 46 108 T42 132"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Die-cut white sticker border */}
                <path
                  d="M45 77 C41 72, 8 48, 8 26 C8 13.5, 17.5 5, 29.5 5 C36.5 5, 42 9.5, 45 14.5 C48 9.5, 53.5 5, 60.5 5 C72.5 5, 82 13.5, 82 26 C82 48, 49 72, 45 77 Z"
                  fill={b.color}
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                {/* Balloon knot */}
                <polygon points="45,76 40,83 50,83" fill={b.color} stroke="#ffffff" strokeWidth="2" />
                {/* Glossy highlight */}
                <path
                  d="M21 24 C21 17, 26 13, 32 13"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.82"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 84 140" className="w-full h-auto overflow-visible" fill="none">
                {/* Curling Ribbon String */}
                <path
                  d="M42 86 Q49 102 40 116 T45 138"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Die-cut white sticker border + oval balloon */}
                <ellipse
                  cx="42"
                  cy="43"
                  rx="33"
                  ry="39"
                  fill={b.color}
                  stroke="#ffffff"
                  strokeWidth="5"
                />
                {/* Balloon knot */}
                <polygon points="42,81 36,88 48,88" fill={b.color} stroke="#ffffff" strokeWidth="2" />
                {/* Glossy highlight */}
                <path
                  d="M23 32 C23 21, 30 14, 38 13"
                  stroke="#ffffff"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  opacity="0.82"
                />
                {/* Cute kawaii face on select balloons */}
                {b.hasFace && (
                  <g>
                    <path
                      d="M29 44 Q32 40 35 44"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M49 44 Q52 40 55 44"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M38 49 Q42 53.5 46 49"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                    <ellipse cx="26" cy="48" rx="3.2" ry="1.8" fill="#ffe4e6" opacity="0.85" />
                    <ellipse cx="58" cy="48" rx="3.2" ry="1.8" fill="#ffe4e6" opacity="0.85" />
                  </g>
                )}
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      {/* Center Scrapbook Birthday Cake & Celebration Card */}
      <div
        className="relative z-20 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pop-out Scrapbook Celebration Banner */}
        <AnimatePresence>
          {phase === 'wish' && (
            <motion.div
              initial={{ scale: 0.4, y: 24, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, y: -12, opacity: 1, rotate: -1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 17 }}
              className="mb-3 px-6 py-2.5 rounded-2xl bg-[#fffdf8] border-3 shadow-2xl flex items-center gap-2.5"
              style={{
                borderColor: theme.accentColor,
                boxShadow: `0 12px 30px ${theme.btnShadow}, 0 0 22px ${theme.scallopLight}`,
              }}
            >
              <span
                className="font-bubble font-black text-xl sm:text-2xl tracking-wide whitespace-nowrap"
                style={{ color: theme.accentColor }}
              >
                Make a Wish!
              </span>
              <span className="text-xl sm:text-2xl leading-none">🎂🎈</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Sparkle Stars Burst Around the Cake */}
        <div className="relative flex items-center justify-center">
          {[
            { x: -128, y: -72, size: 26, color: '#fde047', delay: 0.2 },
            { x: 132, y: -66, size: 28, color: '#fb7185', delay: 0.28 },
            { x: -142, y: 22, size: 22, color: '#ffffff', delay: 0.36 },
            { x: 144, y: 26, size: 24, color: '#fde047', delay: 0.42 },
            { x: -88, y: -122, size: 20, color: theme.scallopLight, delay: 0.48 },
            { x: 92, y: -118, size: 22, color: '#fda4af', delay: 0.52 },
          ].map((st, idx) => (
            <motion.svg
              key={idx}
              viewBox="0 0 24 24"
              fill={st.color}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.3, 0.95, 1.2],
                opacity: [0, 1, 0.9, 1],
                x: st.x,
                y: st.y,
                rotate: [0, 20, -15, 0],
              }}
              transition={{
                duration: 1.4,
                delay: st.delay,
                ease: 'easeOut',
              }}
              style={{ width: st.size, height: st.size }}
              className="absolute pointer-events-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]"
            >
              <path d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z" />
            </motion.svg>
          ))}

          {/* Cute Two-Tier Scrapbook Birthday Cake SVG */}
          <motion.div
            initial={{ scale: 0.35, y: 60, opacity: 0 }}
            animate={{
              scale: phase === 'wish' ? [1, 1.06, 1] : 1,
              y: 0,
              opacity: 1,
            }}
            transition={{
              scale:
                phase === 'wish'
                  ? { duration: 0.6, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 280, damping: 16 },
              y: { type: 'spring', stiffness: 260, damping: 18 },
              opacity: { duration: 0.22 },
            }}
            className="relative w-64 sm:w-80 aspect-[260/250] flex items-center justify-center"
          >
            <svg
              viewBox="0 0 260 250"
              className="w-full h-full overflow-visible drop-shadow-[0_18px_32px_rgba(20,40,75,0.38)]"
              fill="none"
            >
              {/* Die-Cut White Sticker Backing Outline */}
              <g stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
                <rect x="68" y="76" width="124" height="58" rx="14" fill="#ffffff" />
                <rect x="44" y="126" width="172" height="72" rx="16" fill="#ffffff" />
                <path d="M26 198 L234 198 C230 210, 212 214, 130 214 C48 214, 30 210, 26 198 Z" fill="#ffffff" />
                <path d="M106 212 L94 234 L166 234 L154 212 Z" fill="#ffffff" />
              </g>

              {/* 3 Birthday Candles Behind Top Frosting */}
              {[
                { x: 96, stripe: '#fb7185' },
                { x: 130, stripe: theme.accentColor },
                { x: 164, stripe: '#f59e0b' },
              ].map((c, idx) => (
                <g key={idx}>
                  {/* Candle body */}
                  <rect
                    x={c.x - 6}
                    y="38"
                    width="12"
                    height="40"
                    rx="4"
                    fill="#fffdf8"
                    stroke={theme.accentColor}
                    strokeWidth="2.2"
                  />
                  {/* Diagonal candy stripes */}
                  <line x1={c.x - 5} y1="48" x2={c.x + 5} y2="43" stroke={c.stripe} strokeWidth="2.5" />
                  <line x1={c.x - 5} y1="59" x2={c.x + 5} y2="54" stroke={c.stripe} strokeWidth="2.5" />
                  <line x1={c.x - 5} y1="70" x2={c.x + 5} y2="65" stroke={c.stripe} strokeWidth="2.5" />
                  {/* Wick */}
                  <line x1={c.x} y1="33" x2={c.x} y2="38" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

                  {/* Glowing Flickering Candle Flame */}
                  <motion.g
                    animate={{
                      scaleY: [1, 1.18, 0.92, 1.12, 1],
                      scaleX: [1, 0.92, 1.08, 0.95, 1],
                      rotate: [-3, 4, -2, 3, -3],
                    }}
                    transition={{
                      duration: 0.75 + idx * 0.12,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ originX: `${c.x}px`, originY: '32px' }}
                  >
                    <circle cx={c.x} cy="22" r="13" fill="#fde047" opacity="0.35" />
                    <path
                      d={`M ${c.x} 8 C ${c.x + 7} 17, ${c.x + 7} 28, ${c.x} 32 C ${c.x - 7} 28, ${c.x - 7} 17, ${c.x} 8 Z`}
                      fill="#f59e0b"
                      stroke="#fef08a"
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M ${c.x} 14 C ${c.x + 3.5} 20, ${c.x + 3.5} 27, ${c.x} 30 C ${c.x - 3.5} 27, ${c.x - 3.5} 20, ${c.x} 14 Z`}
                      fill="#fef08a"
                    />
                  </motion.g>
                </g>
              ))}

              {/* Cute Strawberries on Top Tier */}
              {[80, 113, 147, 180].map((sx, idx) => (
                <g key={`berry-${idx}`} transform={`translate(${sx}, 73)`}>
                  <path
                    d="M0 -8 C6 -8, 9 -2, 7 4 C5 9, -5 9, -7 4 C-9 -2, -6 -8, 0 -8 Z"
                    fill="#f43f5e"
                    stroke="#9f1239"
                    strokeWidth="2"
                  />
                  <path d="M-4 -8 Q0 -12 4 -8" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="-2" cy="-1" r="0.9" fill="#ffe4e6" />
                  <circle cx="2.5" cy="1" r="0.9" fill="#ffe4e6" />
                </g>
              ))}

              {/* TOP CAKE TIER */}
              <rect
                x="68"
                y="76"
                width="124"
                height="56"
                rx="12"
                fill="#ffe4e6"
                stroke={theme.accentColor}
                strokeWidth="2.8"
              />
              {/* Top Tier Vanilla Cream Frosting Drips */}
              <path
                d="M68 88 C68 80, 74 76, 82 76 L178 76 C186 76, 192 80, 192 88 L192 96 C185 96, 185 106, 177 106 C169 106, 169 95, 161 95 C153 95, 153 108, 145 108 C137 108, 137 96, 130 96 C123 96, 123 107, 115 107 C107 107, 107 95, 99 95 C91 95, 91 105, 83 105 C75 105, 75 96, 68 96 Z"
                fill="#fffdf8"
                stroke={theme.accentColor}
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              {/* Sprinkles on Top Frosting */}
              <line x1="88" y1="85" x2="94" y2="83" stroke="#fb7185" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="116" y1="84" x2="122" y2="86" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="142" y1="86" x2="148" y2="83" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="168" y1="84" x2="174" y2="86" stroke="#a855f7" strokeWidth="2.4" strokeLinecap="round" />

              {/* BOTTOM CAKE TIER */}
              <rect
                x="44"
                y="126"
                width="172"
                height="72"
                rx="14"
                fill={theme.scallopLight}
                stroke={theme.accentColor}
                strokeWidth="2.8"
              />
              {/* Bottom Tier Strawberry-Cream Frosting Drips */}
              <path
                d="M44 139 C44 131, 50 126, 58 126 L202 126 C210 126, 216 131, 216 139 L216 148 C207 148, 207 160, 198 160 C189 160, 189 147, 180 147 C171 147, 171 162, 162 162 C153 162, 153 148, 144 148 C135 148, 135 159, 126 159 C117 159, 117 147, 108 147 C99 147, 99 161, 90 161 C81 161, 81 148, 72 148 C63 148, 63 159, 54 159 C48 159, 48 148, 44 148 Z"
                fill="#fffdf8"
                stroke={theme.accentColor}
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              {/* Cute Smiling Kawaii Face on Bottom Tier */}
              <g>
                <path
                  d="M105 173 Q110 167 115 173"
                  stroke={theme.accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M145 173 Q150 167 155 173"
                  stroke={theme.accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M123 178 Q130 185 137 178"
                  stroke={theme.accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <ellipse cx="98" cy="178" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.65" />
                <ellipse cx="162" cy="178" rx="5.5" ry="3.2" fill="#fb7185" opacity="0.65" />
              </g>

              {/* Decorative Mini Heart on Top Tier */}
              <path
                d="M130 121 C129 120, 121 114, 121 109 C121 106, 123.5 104, 126.2 104 C128 104, 129.3 105, 130 106.3 C130.7 105, 132 104, 133.8 104 C136.5 104, 139 106, 139 109 C139 114, 131 120, 130 121 Z"
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="1.8"
              />

              {/* Scalloped Cake Stand Pedestal */}
              <path
                d="M24 198 L236 198 C232 211, 212 215, 130 215 C48 215, 28 211, 24 198 Z"
                fill={theme.scallopColor}
                stroke={theme.accentColor}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path
                d="M106 214 L93 235 L167 235 L154 214 Z"
                fill={theme.scallopColor}
                stroke={theme.accentColor}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <rect
                x="84"
                y="232"
                width="92"
                height="8"
                rx="4"
                fill="#fffdf8"
                stroke={theme.accentColor}
                strokeWidth="2.4"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
