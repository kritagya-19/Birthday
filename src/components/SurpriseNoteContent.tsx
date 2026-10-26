import React from 'react';
import { Heart, Clock, Sparkles } from 'lucide-react';
import { ColorTheme } from '../theme/colorThemes';

export interface PlacedNoteSticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
}

export interface SurpriseNoteData {
  greeting: string;
  loveMessage: string;
  signature: string;
  dateHeading: string;
  dateTime: string;
  datePlan: string;
  dateCuteNote: string;
  stickers: PlacedNoteSticker[];
}

export const DEFAULT_SURPRISE_NOTE: SurpriseNoteData = {
  greeting: 'My Dearest Love,',
  loveMessage:
    'Tucked inside this bouquet is a little secret — tonight is all about spoiling you! Thank you for saying YES and making my heart the happiest in the world.',
  signature: 'Forever Yours ♥',
  dateHeading: "Tonight's Cute Date Details",
  dateTime: 'Tonight at 7:00 PM sharp (It’s a promise!)',
  datePlan: 'Cozy candlelit dinner, sweet treats & a hand-in-hand walk under the stars',
  dateCuteNote: 'Just bring your prettiest smile — every little surprise is ready for us!',
  stickers: [
    { id: 1, emoji: '🌸', x: 88, y: 42, rotate: 12 },
    { id: 2, emoji: '💖', x: 8, y: 48, rotate: -14 },
  ],
};

export const SURPRISE_NOTE_PRESETS: Array<{
  title: string;
  note: Omit<SurpriseNoteData, 'stickers'>;
}> = [
  {
    title: 'Romantic Dinner',
    note: {
      greeting: 'My Dearest Love,',
      loveMessage:
        'Tucked inside this bouquet is a little secret — tonight is all about spoiling you! Thank you for saying YES and making my heart the happiest in the world.',
      signature: 'Forever Yours ♥',
      dateHeading: "Tonight's Cute Date Details",
      dateTime: 'Tonight at 7:00 PM sharp (It’s a promise!)',
      datePlan: 'Cozy candlelit dinner, sweet treats & a hand-in-hand walk under the stars',
      dateCuteNote: 'Just bring your prettiest smile — every little surprise is ready for us!',
    },
  },
  {
    title: 'Stargazing & Dessert',
    note: {
      greeting: 'To My Favorite Person,',
      loveMessage:
        'Every moment with you feels like my favorite page in a storybook. I cannot wait to hold your hand tonight and make one more sweet memory together!',
      signature: 'All My Love Always ♥',
      dateHeading: 'Our Sweet Night Out',
      dateTime: 'Tonight at 7:30 PM under the evening sky',
      datePlan: 'Warm café desserts, late-night drive & stargazing together',
      dateCuteNote: 'Wear something cozy — I am bringing extra hugs just for you!',
    },
  },
  {
    title: 'Sunset Picnic Date',
    note: {
      greeting: 'Hey Cutie,',
      loveMessage:
        'You officially made my whole week by saying YES! Get ready for nonstop laughs, your favorite snacks, and the sweetest evening made just for two.',
      signature: 'Your Biggest Admirer ♥',
      dateHeading: 'Our Little Date Plan',
      dateTime: 'This Evening at 6:30 PM',
      datePlan: 'Golden-hour picnic, polaroid photos & strawberry milkshakes',
      dateCuteNote: 'Be ready on time — a special treat is waiting for you!',
    },
  },
];

interface SurpriseNotePaperProps {
  data: SurpriseNoteData;
  theme: ColorTheme;
}

export const SurpriseNotePaper: React.FC<SurpriseNotePaperProps> = ({ data, theme }) => {
  return (
    <div className="relative space-y-4">
      {/* Floating User-Placed Scrapbook Stickers */}
      {data.stickers.map((st) => (
        <div
          key={st.id}
          className="absolute z-30 select-none pointer-events-none transition-transform"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            transform: `translate(-50%, -50%) rotate(${st.rotate}deg)`,
            fontSize: '24px',
            filter: 'drop-shadow(1px 3px 5px rgba(27,60,110,0.2))',
          }}
        >
          {st.emoji}
        </div>
      ))}

      {/* =========================================================
          PART 1: HEARTFELT LOVE LETTER STATIONERY SHEET
         ========================================================= */}
      <div className="relative bg-[#fffdf9] rounded-2xl px-5 py-5 sm:px-7 sm:py-6 border border-[#e9decb] shadow-xs overflow-hidden text-left">
        {/* Subtle Ruled Stationery Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 31px, #9ec5e8 31px, #9ec5e8 32px)',
            backgroundPosition: '0 26px',
          }}
        />

        {/* Left Margin Soft Rose Rule Line */}
        <div className="hidden sm:block absolute top-0 bottom-0 left-9 w-[1.5px] bg-[#fda4af]/45 pointer-events-none" />

        {/* Cute Die-Cut Love Postage Stamp in Top-Right Corner (Non-overlapping via float) */}
        <div className="relative z-10 sm:pl-5">
          <div className="float-right ml-3 mb-2 rotate-3 select-none pointer-events-none">
            <div className="w-15 h-17 bg-[#fff1f2] border-2 border-dashed border-[#e11d48] rounded-md flex flex-col items-center justify-center p-1.5 shadow-2xs">
              {/* Cute Winged Love Heart SVG */}
              <svg viewBox="0 0 40 30" className="w-8 h-6" fill="none">
                <path
                  d="M9 15 C3 11, 2 18, 8 19 C5 21, 7 24, 12 21"
                  fill="#ffffff"
                  stroke="#fb7185"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M31 15 C37 11, 38 18, 32 19 C35 21, 33 24, 28 21"
                  fill="#ffffff"
                  stroke="#fb7185"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M20 25 C19 24, 10 17, 10 11 C10 7.5, 12.8 5, 16 5 C18 5, 19.3 6.2, 20 7.5 C20.7 6.2, 22 5, 24 5 C27.2 5, 30 7.5, 30 11 C30 17, 21 24, 20 25 Z"
                  fill="#f43f5e"
                  stroke="#9f1239"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-[8px] font-extrabold text-[#be123c] tracking-wider uppercase leading-none mt-0.5">
                LOVE MAIL
              </span>
              <span className="text-[7px] font-semibold text-[#e11d48]/80 leading-none mt-0.5">
                FOR YOU ♥
              </span>
            </div>
          </div>

          {/* Greeting */}
          <h4 className="font-handwriting text-2xl sm:text-[28px] font-bold text-[#be123c] tracking-wide leading-tight mb-2.5">
            {data.greeting}
          </h4>

          {/* Main Romantic Message */}
          <p className="font-handwriting text-[20px] sm:text-[23px] leading-[1.58] text-[#1e3557] font-medium">
            {data.loveMessage}
          </p>

          {/* Right-Aligned Handwritten Signature */}
          <div className="clear-both pt-3.5 mt-2 flex items-center justify-end gap-2">
            {/* Cute Little Die-Cut Blushing Heart Doodle Next to Signature */}
            <svg viewBox="0 0 28 26" className="w-5 h-5 shrink-0 -rotate-6" fill="none">
              <path
                d="M14 23 C13 22, 3 14.5, 3 8.5 C3 5, 5.8 2.5, 9 2.5 C11.2 2.5, 13 3.8, 14 5.5 C15 3.8, 16.8 2.5, 19 2.5 C22.2 2.5, 25 5, 25 8.5 C25 14.5, 15 22, 14 23 Z"
                fill="#fb7185"
                stroke="#9f1239"
                strokeWidth="1.8"
              />
              <path d="M9.5 10 Q11 8.5 12.5 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15.5 10 Q17 8.5 18.5 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 13 Q14 15 16 13" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-handwriting text-xl sm:text-2xl font-bold text-[#be123c] italic text-right">
              {data.signature}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          SCRAPBOOK RIBBON BOW & STITCHED DIVIDER
         ========================================================= */}
      <div className="flex items-center justify-center gap-3 px-2 py-0.5 select-none">
        <div className="flex-1 border-t-2 border-dashed border-[#f4afba]/80" />
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
          {/* Cute Satin Ribbon Bow SVG Charm */}
          <svg viewBox="0 0 44 26" className="w-8 h-5" fill="none">
            <path d="M22 13 C14 4, 4 6, 7 14 C9 19, 17 16, 22 13 Z" fill="#fb7185" stroke="#9f1239" strokeWidth="1.8" />
            <path d="M22 13 C30 4, 40 6, 37 14 C35 19, 27 16, 22 13 Z" fill="#fb7185" stroke="#9f1239" strokeWidth="1.8" />
            <path d="M19 14 L13 23 M25 14 L31 23" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="22" cy="13" r="3.5" fill="#ffe4e6" stroke="#9f1239" strokeWidth="1.8" />
          </svg>
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
        </div>
        <div className="flex-1 border-t-2 border-dashed border-[#f4afba]/80" />
      </div>

      {/* =========================================================
          PART 2: PINNED CUTE DATE DETAILS MINI-CARD
         ========================================================= */}
      <div className="relative bg-gradient-to-br from-[#fff5f7] via-[#fffafb] to-[#fef9ec] rounded-2xl pt-5 pb-4 px-4 sm:px-6 border-2 border-dashed border-[#fda4af] shadow-xs text-left">
        {/* Top-Center Mini Washi Tape Pinning the Date Card */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rotate-1 rounded-xs border-y border-dashed pointer-events-none"
          style={{
            backgroundColor: `${theme.scallopColor}d9`,
            borderColor: `${theme.accentColor}45`,
          }}
        />

        {/* Cute Die-Cut Kawaii Bear & Heart Corner Sticker (Bottom-Right of Date Card) */}
        <div
          className="hidden sm:block absolute -bottom-2 -right-1.5 z-20 pointer-events-none select-none rotate-6"
          style={{ filter: 'drop-shadow(1px 3px 6px rgba(27,60,110,0.16))' }}
        >
          <svg viewBox="0 0 64 58" className="w-13 h-12" fill="none">
            {/* White Die-Cut Outline */}
            <g fill="#ffffff" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round">
              <circle cx="20" cy="18" r="8" />
              <circle cx="44" cy="18" r="8" />
              <ellipse cx="32" cy="31" rx="19" ry="16" />
              <path d="M32 52 C31 51, 21 44, 21 38.5 C21 35.5, 23.5 33.5, 26.5 33.5 C28.5 33.5, 30.8 34.8, 32 36.5 C33.2 34.8, 35.5 33.5, 37.5 33.5 C40.5 33.5, 43 35.5, 43 38.5 C43 44, 33 51, 32 52 Z" />
            </g>
            {/* Cute Bear Ears & Head */}
            <circle cx="20" cy="18" r="6.5" fill="#d6a881" stroke="#5c3a21" strokeWidth="2" />
            <circle cx="44" cy="18" r="6.5" fill="#d6a881" stroke="#5c3a21" strokeWidth="2" />
            <ellipse cx="32" cy="30" rx="17" ry="14" fill="#e6be9a" stroke="#5c3a21" strokeWidth="2" />
            {/* Happy Eyes & Cheeks */}
            <path d="M24 28 Q26 26 28 28" stroke="#5c3a21" strokeWidth="2" strokeLinecap="round" />
            <path d="M36 28 Q38 26 40 28" stroke="#5c3a21" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="22" cy="31.5" rx="3" ry="1.8" fill="#fb7185" opacity="0.75" />
            <ellipse cx="42" cy="31.5" rx="3" ry="1.8" fill="#fb7185" opacity="0.75" />
            <path d="M29.5 31 Q32 33.5 34.5 31" stroke="#5c3a21" strokeWidth="1.8" strokeLinecap="round" />
            {/* Bear Holding Puffy Red Heart */}
            <path
              d="M32 51 C31 50, 22 43.5, 22 38.5 C22 36, 24.2 34, 26.8 34 C28.8 34, 30.8 35.2, 32 37 C33.2 35.2, 35.2 34, 37.2 34 C39.8 34, 42 36, 42 38.5 C42 43.5, 33 50, 32 51 Z"
              fill="#f43f5e"
              stroke="#881337"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        {/* Date Card Heading */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Cute Mini Love Envelope / Ticket Icon */}
            <span className="w-6 h-6 rounded-lg bg-[#ffe4e6] border border-[#fda4af] flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 text-[#e11d48] fill-[#e11d48]" />
            </span>
            <h5 className="font-bubble text-sm sm:text-base font-black tracking-wide text-[#be123c]">
              {data.dateHeading}
            </h5>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e11d48]/80">
            IT&apos;S OFFICIAL ✓
          </span>
        </div>

        {/* Cleanly Separated Date Detail Rows */}
        <div className="space-y-2.5 sm:pr-6">
          {/* Row 1: When */}
          <div className="flex items-start gap-3 bg-white/85 rounded-xl px-3.5 py-2.5 border border-[#fecdd3]/80 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#fff1f2] border border-[#fda4af] flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#e11d48]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#e11d48] leading-none mb-1">
                When We Meet
              </span>
              <p className="font-handwriting text-lg sm:text-[21px] font-bold text-[#1b3c6e] leading-snug">
                {data.dateTime}
              </p>
            </div>
          </div>

          {/* Row 2: Surprise Plan */}
          <div className="flex items-start gap-3 bg-white/85 rounded-xl px-3.5 py-2.5 border border-[#fecdd3]/80 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#fef3c7] border border-[#fcd34d] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#b45309] leading-none mb-1">
                Our Cute Date Plan
              </span>
              <p className="font-handwriting text-lg sm:text-[21px] font-bold text-[#1b3c6e] leading-snug">
                {data.datePlan}
              </p>
            </div>
          </div>

          {/* Row 3: Sweet Reminder */}
          <div className="flex items-start gap-3 bg-white/85 rounded-xl px-3.5 py-2.5 border border-[#fecdd3]/80 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-[#ffe4e6] border border-[#fda4af] flex items-center justify-center shrink-0 mt-0.5">
              <Heart className="w-3.5 h-3.5 text-[#e11d48]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#e11d48] leading-none mb-1">
                Sweet Little Note
              </span>
              <p className="font-handwriting text-lg sm:text-[21px] font-bold text-[#1b3c6e] leading-snug">
                {data.dateCuteNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
