import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { Sparkles } from 'lucide-react';

interface SurpriseBoxOpeningProps {
  onComplete: () => void;
  theme?: ColorTheme;
  bannerText?: string;
  tagText?: string;
}

// Sparkle particle definition for custom radial explosion
interface SparkleParticle {
  id: number;
  angle: number;      // degrees
  distance: number;   // px distance to fly
  size: number;       // px
  color: string;
  delay: number;      // seconds
  rotate: number;     // final rotation
  duration: number;   // seconds
}

export const SurpriseBoxOpening: React.FC<SurpriseBoxOpeningProps> = ({
  onComplete,
  theme = THEMES[0],
  bannerText = 'Happy Birthday',
  tagText = 'FOR YOU ✨',
}) => {
  const [phase, setPhase] = useState<'anticipation' | 'opening' | 'celebrating' | 'finished'>('anticipation');
  const [sparklesList, setSparklesList] = useState<SparkleParticle[]>([]);

  // Generate dynamic sparkle explosion particles based on theme
  useEffect(() => {
    const colors = [
      theme.accentColor,
      theme.scallopColor,
      '#ffd166', // warm sparkling gold
      '#ffffff', // bright glint
      theme.scallopLight,
      '#ff8fab', // sweet pink
    ];

    const particles: SparkleParticle[] = Array.from({ length: 28 }, (_, i) => {
      const angle = (i * 360) / 28 + (Math.random() * 12 - 6);
      return {
        id: i,
        angle,
        distance: 80 + Math.random() * 160,
        size: 14 + Math.random() * 20,
        color: colors[i % colors.length],
        delay: 0.5 + Math.random() * 0.15,
        rotate: Math.random() * 360,
        duration: 0.9 + Math.random() * 0.5,
      };
    });

    setSparklesList(particles);
  }, [theme]);

  // Orchestrate the surprise sequence
  useEffect(() => {
    // 1. Initial anticipation rustle
    sounds.playPaperRustle();

    // 2. Open the box lid at 550ms
    const openTimer = setTimeout(() => {
      setPhase('opening');
      sounds.playBoxOpen();

      // Fire confetti burst directly from box
      firePaperConfetti(0.5, 0.5, theme);
    }, 550);

    // 3. Celebratory sparkles & banner burst at 850ms
    const celebrateTimer = setTimeout(() => {
      setPhase('celebrating');
      sounds.playMagicSparkles();

      // Second wider wave of starry confetti
      setTimeout(() => {
        firePaperConfetti(0.5, 0.45, theme.starColors);
      }, 200);
    }, 850);

    // 4. Automatically complete and open 3rd page after the spectacle (~2400ms)
    const completeTimer = setTimeout(() => {
      setPhase('finished');
      onComplete();
    }, 2450);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(celebrateTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md select-none overflow-hidden"
      onClick={() => {
        // Allow clicking anywhere to skip straight to Page 3 if desired
        sounds.playPop();
        onComplete();
      }}
    >
      {/* Background Animated Radial Sunburst Light when box opens */}
      <AnimatePresence>
        {phase !== 'anticipation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.65, scale: [0.8, 1.25, 1.1], rotate: 180 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div
              className="w-[700px] h-[700px] rounded-full blur-2xl opacity-70"
              style={{
                background: `radial-gradient(circle, ${theme.scallopLight} 0%, ${theme.scallopColor}44 45%, transparent 70%)`,
              }}
            />
            {/* Spinning decorative rays */}
            <svg
              viewBox="0 0 200 200"
              className="absolute w-[600px] h-[600px] animate-spin"
              style={{ animationDuration: '24s' }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <polygon
                  key={i}
                  points="100,100 93,0 107,0"
                  fill={theme.scallopColor}
                  opacity="0.18"
                  transform={`rotate(${i * 22.5} 100 100)`}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div
        className="relative flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Scrapbook Confetti & Heart Particles rising upwards */}
        {phase !== 'anticipation' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Emojis floating from inside the box */}
            {['🎂', '💖', '✨', '🎈', '⭐', '🎀', '🎉', '🌟'].map((item, idx) => {
              const xOffset = (idx - 3.5) * 45;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 0, x: 0, scale: 0, opacity: 0 }}
                  animate={{
                    y: [-20, -140 - Math.random() * 80, -220 - Math.random() * 60],
                    x: [0, xOffset * 0.8, xOffset * 1.3],
                    scale: [0, 1.3, 1],
                    opacity: [0, 1, 0.9, 0],
                    rotate: [(idx % 2 === 0 ? -20 : 20), (idx % 2 === 0 ? 30 : -30)],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.1 + idx * 0.08,
                    ease: 'easeOut',
                  }}
                  className="absolute text-2xl sm:text-3xl filter drop-shadow-md"
                >
                  {item}
                </motion.div>
              );
            })}

            {/* Exploding Sparkles Ring */}
            {sparklesList.map((sp) => {
              const rad = (sp.angle * Math.PI) / 180;
              const targetX = Math.cos(rad) * sp.distance;
              const targetY = Math.sin(rad) * sp.distance - 30; // slight upward bias

              return (
                <motion.div
                  key={sp.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                  animate={{
                    x: [0, targetX],
                    y: [0, targetY],
                    scale: [0, 1.4, 0.9, 0],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, sp.rotate],
                  }}
                  transition={{
                    duration: sp.duration,
                    delay: sp.delay - 0.5,
                    ease: 'easeOut',
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    width: sp.size,
                    height: sp.size,
                  }}
                >
                  {/* 4-point SVG sparkle star */}
                  <svg
                    viewBox="0 0 24 24"
                    fill={sp.color}
                    className="w-full h-full filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  >
                    <path d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z" />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Celebratory Banner popping out of box */}
        <AnimatePresence>
          {phase === 'celebrating' && (
            <motion.div
              initial={{ scale: 0, y: 20, opacity: 0, rotate: -4 }}
              animate={{
                scale: 1,
                y: -150,
                opacity: 1,
                rotate: 0,
              }}
              transition={{
                scale: { type: 'spring', stiffness: 350, damping: 16 },
                y: { type: 'spring', stiffness: 280, damping: 18 },
                rotate: { type: 'spring', stiffness: 220, damping: 15 },
                opacity: { duration: 0.2 },
              }}
              className="absolute z-30 pointer-events-none"
            >
              <div
                className="px-6 py-2.5 rounded-2xl bg-white border-3 shadow-2xl flex items-center gap-2.5 transform -rotate-1"
                style={{
                  borderColor: theme.accentColor,
                  boxShadow: `0 12px 30px ${theme.btnShadow}, 0 0 20px ${theme.scallopLight}`,
                }}
              >
                <span
                  className="font-bubble font-black text-xl sm:text-2xl tracking-wide whitespace-nowrap"
                  style={{ color: theme.accentColor }}
                >
                  {bannerText}
                </span>
                <svg
                  viewBox="0 0 32 30"
                  className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 animate-bounce drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)]"
                  fill="none"
                  aria-label="heart"
                >
                  <path
                    d="M16 27 C14.8 25.6, 3 16.8, 3 9.2 C3 4.8, 6.5 1.8, 10.6 1.8 C13.2 1.8, 15.1 3.3, 16 5.2 C16.9 3.3, 18.8 1.8, 21.4 1.8 C25.5 1.8, 29 4.8, 29 9.2 C29 16.8, 17.2 25.6, 16 27 Z"
                    fill="#f43f5e"
                    stroke="#be123c"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.8 8.5 C7.8 6.3, 9.6 4.8, 11.8 4.8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The 3D Scrapbook Gift Box */}
        <div className="relative w-56 sm:w-64 aspect-square flex items-center justify-center">
          {/* Animated Wiggle Container for Anticipation */}
          <motion.div
            initial={{ scale: 0.4, y: -40, opacity: 0 }}
            animate={
              phase === 'anticipation'
                ? {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    rotate: [0, -6, 6, -6, 6, -3, 3, 0],
                  }
                : {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                  }
            }
            transition={
              phase === 'anticipation'
                ? {
                    rotate: { duration: 0.55, ease: 'easeInOut' },
                    scale: { type: 'spring', stiffness: 280, damping: 22 },
                  }
                : {}
            }
            className="relative w-full h-full flex flex-col items-center justify-end pb-4"
          >
            {/* Box Lid & Bow */}
            <motion.div
              initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              animate={
                phase !== 'anticipation'
                  ? {
                      y: -130,
                      x: -45,
                      rotate: -45,
                      opacity: 0.9,
                    }
                  : {
                      y: 0,
                      x: 0,
                      rotate: 0,
                      opacity: 1,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 18,
                opacity: { duration: 0.3 },
              }}
              className="relative z-20 flex flex-col items-center origin-bottom-left"
            >
              {/* Cute 3D Ribbon Bow */}
              <div className="relative flex items-center justify-center -mb-2 z-10">
                <svg
                  viewBox="0 0 100 50"
                  className="w-24 h-12 filter drop-shadow-md"
                  fill="none"
                >
                  {/* Left bow loop */}
                  <path
                    d="M 50 25 C 35 5, 10 10, 20 30 C 28 42, 45 30, 50 25 Z"
                    fill={theme.accentColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Right bow loop */}
                  <path
                    d="M 50 25 C 65 5, 90 10, 80 30 C 72 42, 55 30, 50 25 Z"
                    fill={theme.accentColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Center knot */}
                  <circle
                    cx="50"
                    cy="25"
                    r="8"
                    fill={theme.btnHover || theme.accentColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Left ribbon tail */}
                  <path
                    d="M 46 29 C 40 40, 32 48, 25 50"
                    stroke={theme.accentColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Right ribbon tail */}
                  <path
                    d="M 54 29 C 60 40, 68 48, 75 50"
                    stroke={theme.accentColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Dangling "For You" Kraft Tag */}
                <div
                  className="absolute -right-6 top-4 bg-[#fbf5e7] border-2 border-[#d6c7af] px-2 py-0.5 rounded-md text-[10px] font-handwriting font-bold text-slate-700 shadow-md rotate-12 whitespace-nowrap"
                  style={{
                    filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.15))',
                  }}
                >
                  {tagText}
                </div>
              </div>

              {/* The Lid Cardstock Cap */}
              <div
                className="w-48 sm:w-56 h-10 rounded-xl border-3 border-white shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: theme.scallopColor,
                  boxShadow: '0 8px 18px rgba(0,0,0,0.2)',
                }}
              >
                {/* Stitching Line */}
                <div className="absolute inset-1 border border-dashed border-white/70 rounded-lg pointer-events-none" />
                {/* Vertical ribbon band on lid */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-8 border-x border-white/50"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>
            </motion.div>

            {/* Box Body / Base */}
            <div
              className="relative w-44 sm:w-52 h-36 rounded-2xl border-4 border-white shadow-2xl overflow-hidden -mt-2 z-10"
              style={{
                backgroundColor: theme.canvasBg || '#ffffff',
                boxShadow: `0 16px 36px ${theme.btnShadow}, 0 4px 12px rgba(0,0,0,0.15)`,
              }}
            >
              {/* Box Gingham / Paper Check Accent */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, ${theme.scallopLight} 50%, transparent 50%),
                    linear-gradient(${theme.scallopLight} 50%, transparent 50%)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Paper texture */}
              <div className="absolute inset-0 paper-texture pointer-events-none opacity-50" />

              {/* Dotted border stitching */}
              <div className="absolute inset-1.5 border-2 border-dashed border-white/80 rounded-xl pointer-events-none" />

              {/* Vertical Ribbon */}
              <div
                className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-8 border-x-2 border-white/60 shadow-sm"
                style={{ backgroundColor: theme.accentColor }}
              />

              {/* Horizontal Ribbon */}
              <div
                className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-8 border-y-2 border-white/60 shadow-sm"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>

            {/* Soft Shadow on ground */}
            <div
              className="w-40 sm:w-48 h-4 bg-black/25 rounded-full blur-md mt-1 transition-all duration-300"
              style={{
                transform: phase !== 'anticipation' ? 'scale(1.15)' : 'scale(1)',
                opacity: phase !== 'anticipation' ? 0.35 : 0.25,
              }}
            />
          </motion.div>
        </div>

        {/* Bottom Status / Unwrapping Text with Glowing Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-col items-center gap-2 text-center"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 shadow-md">
            <Sparkles className="w-4 h-4 animate-spin text-amber-500" style={{ animationDuration: '3s' }} />
            <span
              className="font-sans-clean font-bold text-xs sm:text-sm tracking-wide"
              style={{ color: theme.accentColor }}
            >
              {phase === 'anticipation' ? 'Opening surprise box...' : 'Unwrapping sweet memories...'}
            </span>
          </div>

          <p className="text-[11px] text-white/80 font-medium tracking-tight">
            Tap anywhere to jump right in ✨
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
