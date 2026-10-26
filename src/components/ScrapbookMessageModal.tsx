import React, { useState } from 'react';
import { X, Sparkles, Edit3, Check, Share2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  SurpriseNoteData,
  DEFAULT_SURPRISE_NOTE,
  SURPRISE_NOTE_PRESETS,
  SurpriseNotePaper,
} from './SurpriseNoteContent';

interface ScrapbookMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  themeName?: string;
  theme?: ColorTheme;
  surpriseNote?: SurpriseNoteData;
  onChangeSurpriseNote?: (next: SurpriseNoteData) => void;
  onSaveNote?: () => void;
}

const STICKER_PALETTE = ['🌸', '💖', '🍓', '🎀', '🧸', '💌', '✨', '🌹', '🥂', '🌙'];

export const ScrapbookMessageModal: React.FC<ScrapbookMessageModalProps> = ({
  isOpen,
  onClose,
  accentColor,
  theme = THEMES[0],
  surpriseNote,
  onChangeSurpriseNote,
  onSaveNote,
}) => {
  const activeAccent = accentColor || theme.accentColor;
  const [localNote, setLocalNote] = useState<SurpriseNoteData>(DEFAULT_SURPRISE_NOTE);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const noteData = surpriseNote ?? localNote;
  const updateNote = (patch: Partial<SurpriseNoteData>) => {
    const updated = { ...noteData, ...patch };
    if (onChangeSurpriseNote) {
      onChangeSurpriseNote(updated);
    } else {
      setLocalNote(updated);
    }
  };

  if (!isOpen) return null;

  const handleApplyPreset = (idx: number) => {
    sounds.playPop();
    setSelectedPreset(idx);
    updateNote({
      ...SURPRISE_NOTE_PRESETS[idx].note,
    });
    setIsEditing(false);
  };

  const handleAddSticker = (emoji: string) => {
    sounds.playStickerDrop();
    const newSticker = {
      id: Date.now(),
      emoji,
      x: 10 + Math.random() * 80,
      y: 12 + Math.random() * 76,
      rotate: (Math.random() - 0.5) * 32,
    };
    updateNote({
      stickers: [...noteData.stickers, newSticker],
    });
  };

  const handleCopy = () => {
    sounds.playPop();
    navigator.clipboard?.writeText?.(
      `${noteData.greeting}\n\n${noteData.loveMessage}\n\n${noteData.dateHeading}\n• When: ${noteData.dateTime}\n• Plan: ${noteData.datePlan}\n• Note: ${noteData.dateCuteNote}\n\n${noteData.signature}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfetti = () => {
    sounds.playChime();
    firePaperConfetti(0.5, 0.5, theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Outer Click to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Scrapbook Envelope / Paper Card Container */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#faf5e8] rounded-3xl p-5 sm:p-8 z-10 shadow-2xl border-4 border-[#efe6d2] transition-all my-auto"
        style={{
          boxShadow: '0 25px 60px -15px rgba(27, 60, 110, 0.38), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        {/* Washi tape decoration at top corners */}
        <div
          className="absolute -top-2.5 left-10 w-24 h-6 -rotate-3 rounded-xs shadow-2xs border-y border-dashed pointer-events-none"
          style={{ backgroundColor: `${theme.scallopColor}cc`, borderColor: `${theme.accentColor}40` }}
        />
        <div
          className="absolute -top-2.5 right-10 w-24 h-6 rotate-3 rounded-xs shadow-2xs border-y border-dashed pointer-events-none"
          style={{ backgroundColor: '#fecdd3cc', borderColor: '#e11d4840' }}
        />

        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#e5ddc7] relative z-20">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0" fill="none">
              <circle cx="18" cy="18" r="15" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
              <circle cx="18" cy="17" r="9.5" fill="#f43f5e" />
              <path
                d="M12 16 C14 10, 22 10, 24 16 C25 20, 19 23, 14 20 C11 18, 13 14, 17 14 C20 14, 21 17, 18 18.5"
                stroke="#fff1f2"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <h2 className="font-bubble text-lg sm:text-2xl font-black tracking-wide leading-tight" style={{ color: activeAccent }}>
                Customize Surprise Note
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Saved automatically to your Page 9 Bouquet Surprise Note
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Mode Toggle inside Header Surprise Note Studio */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsEditing(!isEditing);
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#dacfb7] text-[#1b3c6e] hover:bg-[#f6f1e2] transition-colors cursor-pointer shadow-2xs"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Preview Note
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#e11d48]" /> Edit Note &amp; Details
                </>
              )}
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Either Live Preview of SurpriseNotePaper OR Structured Editor */}
        <div className="mt-4">
          {isEditing ? (
            <div className="space-y-4 text-left">
              {/* Editor Part 1: Love Note Text */}
              <div className="bg-[#fffdf9] rounded-2xl p-4 sm:p-5 border border-[#e9decb] space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#be123c]">
                  1. Heartfelt Love Message
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Greeting</label>
                  <input
                    type="text"
                    value={noteData.greeting}
                    onChange={(e) => updateNote({ greeting: e.target.value })}
                    className="w-full bg-[#faf5e8]/70 px-3 py-1.5 rounded-xl border border-[#dacfb7] font-handwriting font-bold text-2xl text-[#be123c] focus:outline-hidden focus:border-[#e11d48]"
                    placeholder="My Dearest Love,"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Love Text</label>
                  <textarea
                    value={noteData.loveMessage}
                    onChange={(e) => updateNote({ loveMessage: e.target.value })}
                    rows={3}
                    className="w-full bg-[#faf5e8]/70 p-3 rounded-xl border border-[#dacfb7] font-handwriting leading-relaxed text-xl text-[#1e3557] focus:outline-hidden focus:border-[#e11d48] resize-none"
                    placeholder="Write your sweet surprise message..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Signature</label>
                  <input
                    type="text"
                    value={noteData.signature}
                    onChange={(e) => updateNote({ signature: e.target.value })}
                    className="w-full bg-[#faf5e8]/70 px-3 py-1.5 rounded-xl border border-[#dacfb7] font-handwriting font-bold text-xl text-[#be123c] focus:outline-hidden focus:border-[#e11d48]"
                    placeholder="Forever Yours ♥"
                  />
                </div>
              </div>

              {/* Editor Part 2: Cute Date Details */}
              <div className="bg-[#fff5f7] rounded-2xl p-4 sm:p-5 border-2 border-dashed border-[#fda4af] space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#be123c]">
                  2. Cute Date Details Card
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date Section Heading</label>
                  <input
                    type="text"
                    value={noteData.dateHeading}
                    onChange={(e) => updateNote({ dateHeading: e.target.value })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#fecdd3] font-bubble font-bold text-sm text-[#be123c] focus:outline-hidden focus:border-[#e11d48]"
                    placeholder="Tonight's Cute Date Details"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">When We Meet</label>
                    <input
                      type="text"
                      value={noteData.dateTime}
                      onChange={(e) => updateNote({ dateTime: e.target.value })}
                      className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#fecdd3] font-handwriting font-bold text-lg text-[#1b3c6e] focus:outline-hidden focus:border-[#e11d48]"
                      placeholder="Tonight at 7:00 PM sharp"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sweet Little Note</label>
                    <input
                      type="text"
                      value={noteData.dateCuteNote}
                      onChange={(e) => updateNote({ dateCuteNote: e.target.value })}
                      className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#fecdd3] font-handwriting font-bold text-lg text-[#1b3c6e] focus:outline-hidden focus:border-[#e11d48]"
                      placeholder="Just bring your prettiest smile!"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Our Cute Date Plan</label>
                  <input
                    type="text"
                    value={noteData.datePlan}
                    onChange={(e) => updateNote({ datePlan: e.target.value })}
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-[#fecdd3] font-handwriting font-bold text-lg text-[#1b3c6e] focus:outline-hidden focus:border-[#e11d48]"
                    placeholder="Cozy candlelit dinner & walk under the stars"
                  />
                </div>
              </div>
            </div>
          ) : (
            <SurpriseNotePaper data={noteData} theme={theme} />
          )}
        </div>

        {/* Cute Sticker Tray */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#e5ddc7]">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" /> Add Cute Sticker:
            </span>
            {STICKER_PALETTE.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleAddSticker(emoji)}
                className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 hover:scale-112 active:scale-95 transition-transform flex items-center justify-center text-base shadow-2xs border border-[#eadfce] cursor-pointer shrink-0"
                title={`Stick ${emoji}`}
              >
                {emoji}
              </button>
            ))}
            {noteData.stickers.length > 0 && (
              <button
                onClick={() => {
                  sounds.playPop();
                  updateNote({ stickers: [] });
                }}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium px-2 py-1 cursor-pointer whitespace-nowrap"
                title="Clear added stickers"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Romantic Note Presets */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Templates:</span>
          {SURPRISE_NOTE_PRESETS.map((preset, idx) => (
            <button
              key={preset.title}
              onClick={() => handleApplyPreset(idx)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedPreset === idx && !isEditing
                  ? 'text-white font-semibold'
                  : 'bg-white/85 text-slate-600 border border-[#e5ddc7] hover:bg-white'
              }`}
              style={{
                backgroundColor: selectedPreset === idx && !isEditing ? theme.btnBg : undefined,
              }}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#e5ddc7]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfetti}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              style={{ backgroundColor: `${theme.scallopLight}`, color: theme.accentColor }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Test Confetti
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-[#e5ddc7] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Note'}
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              setIsEditing(false);
              onSaveNote?.();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
            style={{
              backgroundColor: '#e11d48',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.28)',
            }}
          >
            Save to Bouquet ♥
          </button>
        </div>
      </div>
    </div>
  );
};
