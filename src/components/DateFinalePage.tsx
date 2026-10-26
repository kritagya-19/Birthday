import React, { useState, useRef } from 'react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import {
  ArrowLeft,
  Check,
  Edit3,
  Eye,
  Heart,
  Link2,
  Loader2,
  RotateCcw,
  PartyPopper,
  Save,
  X,
} from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  SurpriseNoteData,
  DEFAULT_SURPRISE_NOTE,
  SurpriseNotePaper,
} from './SurpriseNoteContent';
import {
  Page9Texts,
  Page9Photos,
  DEFAULT_ALL_PAGES_TEXTS,
  DEFAULT_ALL_PAGES_PHOTOS,
} from '../utils/pageContentStore';
import {
  PageActionButtons,
  PageTextEditorModal,
  PagePhotosModal,
  TextFieldConfig,
  PhotoSlotConfig,
} from './PageCustomizationModals';
import { SavePreviewSharePanel } from './SavePreviewSharePanel';

interface DateFinalePageProps {
  onBack: () => void;
  onRestartJourney: () => void;
  theme?: ColorTheme;
  surpriseNote?: SurpriseNoteData;
  texts?: Page9Texts;
  onChangeTexts?: (next: Page9Texts) => void;
  photos?: Page9Photos;
  onChangePhotos?: (next: Page9Photos) => void;
  readOnly?: boolean;
  onOpenNoteEditor?: () => void;
  hasReviewedSurpriseCard?: boolean;
  onSurpriseCardViewed?: () => void;
  isSaved?: boolean;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  savedSlug?: string;
  saveError?: string | null;
  onSaveAll?: (customSlug?: string) => Promise<{ slug: string; shareUrl: string } | null>;
  onStartPreview?: () => void;
  autoOpenSharePanel?: boolean;
}

const PAGE9_TEXT_FIELDS: TextFieldConfig<Page9Texts>[] = [
  { key: 'line1', label: 'First Finale Headline' },
  { key: 'line2', label: 'Second Finale Headline' },
  { key: 'subPrompt', label: 'Bouquet Prompt Text Underneath' },
  { key: 'calendarHeader', label: 'Calendar Sticker Header' },
  { key: 'stampTitle', label: 'Confirmed Stamp Title' },
  { key: 'stampSubtitle', label: 'Confirmed Stamp Sub-Label' },
];

const PAGE9_PHOTO_SLOTS: PhotoSlotConfig<keyof Page9Photos>[] = [
  {
    key: 'leftPhoto',
    label: 'Bottom-Left Sticker / Photo',
    aspectClass: 'aspect-square',
    fitClass: 'object-contain',
  },
  {
    key: 'rightPhoto',
    label: 'Bottom-Right Sticker / Photo',
    aspectClass: 'aspect-square',
    fitClass: 'object-contain',
  },
];

export const DateFinalePage: React.FC<DateFinalePageProps> = ({
  onBack,
  onRestartJourney,
  theme = THEMES[0],
  surpriseNote = DEFAULT_SURPRISE_NOTE,
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
  onOpenNoteEditor,
  hasReviewedSurpriseCard = false,
  onSurpriseCardViewed,
  isSaved = false,
  hasUnsavedChanges = false,
  isSaving = false,
  savedSlug = '',
  saveError = null,
  onSaveAll,
  onStartPreview,
  autoOpenSharePanel = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page9Texts>(DEFAULT_ALL_PAGES_TEXTS.page9);
  const [localPhotos, setLocalPhotos] = useState<Page9Photos>(DEFAULT_ALL_PAGES_PHOTOS.page9);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [forceExpandShare, setForceExpandShare] = useState(false);
  const sharePanelAnchorRef = useRef<HTMLDivElement>(null);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page9Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page9Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const [isHeartPulsing, setIsHeartPulsing] = useState(false);
  const [isFlowerBlooming, setIsFlowerBlooming] = useState(false);
  const [showSurpriseNote, setShowSurpriseNote] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    sounds.playChime();
    setIsHeartPulsing(true);
    setTimeout(() => setIsHeartPulsing(false), 800);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePaperConfetti(x, y, theme);
  };

  const openSurpriseNoteModal = () => {
    setShowSurpriseNote(true);
    if (!readOnly) {
      onSurpriseCardViewed?.();
    }
  };

  const handleOpenSurpriseNote = (e: React.MouseEvent) => {
    sounds.playPaperRustle();
    sounds.playChime();
    setIsFlowerBlooming(true);
    setTimeout(() => setIsFlowerBlooming(false), 700);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePaperConfetti(x, y, theme);

    openSurpriseNoteModal();
  };

  return (
    <div
      className={`relative w-full ${
        readOnly ? 'max-w-[min(95vw,calc(84vh*1.78))]' : 'max-w-5xl'
      } mx-auto px-4 select-none animate-in fade-in zoom-in-98 duration-300`}
    >
      {/* Top back & Edit Text / Replay controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white font-semibold border shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer"
          style={{ color: theme.accentColor, borderColor: theme.borderHeader }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Page 8
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {!readOnly && (
            <PageActionButtons
              onOpenTextEditor={() => setIsTextModalOpen(true)}
              onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
              photoCount={2}
              theme={theme}
            />
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onRestartJourney();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/85 hover:bg-white font-semibold border shadow-xs transition-colors cursor-pointer"
            style={{ color: theme.accentColor, borderColor: theme.borderHeader }}
            title="Start from Page 1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Replay Journey
          </button>
        </div>
      </div>

      {/* Main 682:383 Card Frame */}
      <div
        className="relative w-full aspect-[682/383] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all duration-300"
        style={{
          boxShadow:
            '0 24px 50px -10px rgba(35, 75, 120, 0.35), 0 6px 20px rgba(35, 75, 120, 0.15)',
        }}
      >
        <div className={`relative w-full h-full overflow-hidden select-none ${theme.ginghamClass}`}>
          {/* 1. Gingham check pattern & paper grain texture */}
          <div className={`absolute inset-0 pointer-events-none ${theme.ginghamClass}`} />
          <div className="absolute inset-0 paper-texture pointer-events-none" />

          {/* 2. Top-Left Puffy Love Heart Sticker */}
          <div
            onClick={handleHeartClick}
            className={`absolute left-[3%] top-[5%] z-20 cursor-pointer animate-date-heart transition-transform duration-300 hover:scale-112 active:scale-90 ${
              isHeartPulsing ? 'scale-125 rotate-6' : ''
            }`}
            title="Click to send love!"
          >
            <svg
              viewBox="0 0 90 85"
              className="w-[clamp(44px,8vw,72px)] h-auto drop-shadow-[0_4px_8px_rgba(30,60,100,0.22)]"
            >
              <path
                d="M45 78 C42 74, 8 48, 8 26 C8 13.5, 17.5 5, 29 5 C36 5, 42 9.5, 45 14 C48 9.5, 54 5, 61 5 C72.5 5, 82 13.5, 82 26 C82 48, 48 74, 45 78 Z"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinejoin="round"
                transform="rotate(-5 45 42)"
              />
              <path
                d="M45 74 C42.5 70.5, 13 47, 13 27 C13 16, 21 8.5, 30.5 8.5 C36.5 8.5, 42 12.5, 45 16.5 C48 12.5, 53.5 8.5, 59.5 8.5 C69 8.5, 77 16, 77 27 C77 47, 47.5 70.5, 45 74 Z"
                fill="#f43f5e"
                transform="rotate(-5 45 42)"
              />
              <path
                d="M23 24 C23 18, 27.5 14.5, 32.5 14.5"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
                transform="rotate(-5 45 42)"
              />
            </svg>
          </div>

          {/* 3. Mid-Upper Left Sticker: Cute Happy Blushing Calendar */}
          <div
            onClick={(e) => {
              sounds.playPop();
              const rect = e.currentTarget.getBoundingClientRect();
              firePaperConfetti(
                (rect.left + rect.width / 2) / window.innerWidth,
                (rect.top + rect.height / 2) / window.innerHeight,
                theme
              );
            }}
            className="absolute left-[3%] top-[26.5%] z-20 cursor-pointer group animate-date-milkshake"
            style={{
              filter: 'drop-shadow(2px 6px 12px rgba(28, 52, 86, 0.22))',
            }}
            title="Date Locked In Tonight! 💕"
          >
            <svg
              viewBox="0 0 112 108"
              className="w-[clamp(48px,9.2vw,88px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
              fill="none"
            >
              <rect x="10" y="14" width="88" height="82" rx="14" fill="#ffffff" stroke="#ffffff" strokeWidth="9" />
              <circle cx="34" cy="14" r="6" fill="#ffffff" />
              <circle cx="74" cy="14" r="6" fill="#ffffff" />

              <rect
                x="13"
                y="18"
                width="82"
                height="75"
                rx="11"
                fill="#fffdf7"
                stroke={theme.accentColor}
                strokeWidth="2.6"
              />
              <path
                d="M13 29 C13 22.9, 17.9 18, 24 18 L84 18 C90.1 18, 95 22.9, 95 29 L95 39 L13 39 Z"
                fill="#fb7185"
                stroke={theme.accentColor}
                strokeWidth="2.6"
              />
              <rect x="31" y="10" width="6.5" height="15" rx="3.2" fill="#ffffff" stroke={theme.accentColor} strokeWidth="2.2" />
              <rect x="70.5" y="10" width="6.5" height="15" rx="3.2" fill="#ffffff" stroke={theme.accentColor} strokeWidth="2.2" />

              <text
                x="54"
                y="32.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9.5"
                fontWeight="900"
                fontFamily="Plus Jakarta Sans, sans-serif"
                letterSpacing="0.8"
              >
                {activeTexts.calendarHeader}
              </text>

              <path
                d="M54 79 C52.5 77.5, 34 65, 34 53.5 C34 47.5, 38.8 43.5, 44.5 43.5 C48.5 43.5, 51.8 45.8, 54 48.8 C56.2 45.8, 59.5 43.5, 63.5 43.5 C69.2 43.5, 74 47.5, 74 53.5 C74 65, 55.5 77.5, 54 79 Z"
                fill="#ffe4e6"
                stroke="#e11d48"
                strokeWidth="2.2"
              />
              <path d="M44 56 Q46.5 53 49 56" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M59 56 Q61.5 53 64 56" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <ellipse cx="42" cy="60" rx="2.8" ry="1.6" fill="#fb7185" />
              <ellipse cx="66" cy="60" rx="2.8" ry="1.6" fill="#fb7185" />
              <path d="M50.5 60.5 Q54 64.5 57.5 60.5" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" fill="none" />

              <circle cx="86" cy="82" r="12" fill="#ffffff" />
              <circle cx="86" cy="82" r="9.5" fill="#10b981" stroke="#065f46" strokeWidth="2" />
              <path d="M81.5 82 L84.5 85 L90.8 78.8" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 4. Top-Right Sticker: Confirmed Scrapbook Stamp Badge */}
          <div
            onClick={(e) => {
              sounds.playChime();
              const rect = e.currentTarget.getBoundingClientRect();
              firePaperConfetti(
                (rect.left + rect.width / 2) / window.innerWidth,
                (rect.top + rect.height / 2) / window.innerHeight,
                theme
              );
            }}
            className="absolute right-[3%] top-[5%] z-20 cursor-pointer group animate-date-ticket"
            style={{
              filter: 'drop-shadow(2px 7px 14px rgba(28, 52, 86, 0.24))',
            }}
            title="Date Officially Confirmed! 💖"
          >
            <svg
              viewBox="0 0 156 104"
              className="w-[clamp(66px,13.5vw,132px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-108 group-active:scale-95"
              fill="none"
            >
              <rect
                x="10"
                y="16"
                width="136"
                height="74"
                rx="16"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="9"
              />
              <circle cx="78" cy="15" r="10" fill="#ffffff" />

              <rect
                x="13"
                y="19"
                width="130"
                height="68"
                rx="13"
                fill="#fff1f2"
                stroke="#e11d48"
                strokeWidth="2.6"
              />
              <rect
                x="19"
                y="25"
                width="118"
                height="56"
                rx="9"
                fill="#ffffff"
                fillOpacity="0.7"
                stroke="#fb7185"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />

              <path d="M78 18 C67 8, 55 11, 59 20 C62 26, 72 22, 78 18 Z" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.8" />
              <path d="M78 18 C89 8, 101 11, 97 20 C94 26, 84 22, 78 18 Z" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.8" />
              <circle cx="78" cy="18" r="4" fill="#ffe4e6" stroke="#9f1239" strokeWidth="1.8" />

              <path d="M31 40 L33 45 L38 47 L33 49 L31 54 L29 49 L24 47 L29 45 Z" fill="#facc15" />
              <path d="M125 40 L127 45 L132 47 L127 49 L125 54 L123 49 L118 47 L123 45 Z" fill="#facc15" />

              <text
                x="78"
                y="49"
                textAnchor="middle"
                fill={theme.accentColor}
                fontSize="13.5"
                fontWeight="900"
                fontFamily="Grandstander, Fredoka, sans-serif"
                letterSpacing="0.5"
              >
                {activeTexts.stampTitle}
              </text>

              <rect x="34" y="57" width="88" height="18" rx="9" fill="#e11d48" />
              <text
                x="78"
                y="69.2"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="800"
                fontFamily="Plus Jakarta Sans, sans-serif"
                letterSpacing="1"
              >
                {activeTexts.stampSubtitle}
              </text>
            </svg>
          </div>

          {/* 5. Mid-Upper Right Sticker: Cute Happy Blushing Twin Love Hearts */}
          <div
            onClick={() => sounds.playChime()}
            className="absolute right-[4.2%] top-[33%] z-20 cursor-pointer group animate-date-envelope"
            style={{
              filter: 'drop-shadow(2px 6px 11px rgba(28, 52, 86, 0.2))',
            }}
            title="So Happy Together! 💖"
          >
            <svg
              viewBox="0 0 116 90"
              className="w-[clamp(48px,9vw,86px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <g stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" fill="#ffffff">
                <path d="M44 74 C42 72, 12 50, 12 31 C12 20, 20 13, 29.5 13 C35.5 13, 41 16.8, 44 21.5 C47 16.8, 52.5 13, 58.5 13 C68 13, 76 20, 76 31 C76 50, 46 72, 44 74 Z" />
                <path d="M78 76 C76.5 74.5, 54 58, 54 43 C54 34.5, 60.5 29, 68 29 C72.5 29, 76 31.8, 78 35.2 C80 31.8, 83.5 29, 88 29 C95.5 29, 102 34.5, 102 43 C102 58, 79.5 74.5, 78 76 Z" />
              </g>

              <path
                d="M44 72 C42 70, 14 49, 14 31 C14 21, 21.5 14.5, 29.5 14.5 C35.5 14.5, 41 18.2, 44 23 C47 18.2, 52.5 14.5, 58.5 14.5 C66.5 14.5, 74 21, 74 31 C74 49, 46 70, 44 72 Z"
                fill="#fb7185"
                stroke="#9f1239"
                strokeWidth="2.4"
              />
              <path d="M31 36 Q34 32.5 37 36" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M51 36 Q54 32.5 57 36" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M39.5 42 Q44 47 48.5 42" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
              <ellipse cx="28.5" cy="40.5" rx="3" ry="1.7" fill="#fecdd3" />
              <ellipse cx="59.5" cy="40.5" rx="3" ry="1.7" fill="#fecdd3" />

              <path
                d="M78 74 C76.5 72.5, 56 57, 56 43 C56 35.5, 61.5 30.5, 68 30.5 C72.5 30.5, 76 33.2, 78 36.8 C80 33.2, 83.5 30.5, 88 30.5 C94.5 30.5, 100 35.5, 100 43 C100 57, 79.5 72.5, 78 74 Z"
                fill={theme.scallopColor}
                stroke={theme.accentColor}
                strokeWidth="2.4"
              />
              <circle cx="71" cy="46" r="2" fill={theme.accentColor} />
              <circle cx="85" cy="46" r="2" fill={theme.accentColor} />
              <path d="M74.5 51 Q78 54.5 81.5 51" stroke={theme.accentColor} strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="67" cy="49.5" rx="2.4" ry="1.4" fill="#fb7185" opacity="0.7" />
              <ellipse cx="89" cy="49.5" rx="2.4" ry="1.4" fill="#fb7185" opacity="0.7" />
            </svg>
          </div>

          {/* 6. Center Scrapbook Bouquet of Roses + Finale Text & Surprise Prompt Underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6">
            <div
              onClick={handleOpenSurpriseNote}
              className={`pointer-events-auto cursor-pointer transition-transform duration-300 -mt-2 sm:-mt-3 ${
                isFlowerBlooming
                  ? 'scale-112 rotate-2'
                  : 'hover:scale-108 active:scale-96 -rotate-2'
              }`}
              style={{
                filter: 'drop-shadow(0 8px 18px rgba(35, 60, 100, 0.24))',
              }}
              title={activeTexts.subPrompt || 'Tap on Bouquet for surprise!'}
            >
              <svg
                viewBox="0 0 220 205"
                className={`${readOnly ? 'w-[clamp(115px,22vw,240px)]' : 'w-[clamp(94px,19vw,182px)]'} h-auto overflow-visible`}
                fill="none"
              >
                <g fill="#ffffff" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
                  <circle cx="72" cy="64" r="28" />
                  <circle cx="148" cy="64" r="28" />
                  <circle cx="110" cy="44" r="32" />
                  <circle cx="54" cy="92" r="24" />
                  <circle cx="166" cy="92" r="24" />
                  <path d="M40 96 L180 96 L132 186 C126 194, 94 194, 88 186 Z" />
                  <path d="M84 146 L72 174 M136 146 L148 174" />
                </g>

                <g stroke="#15803d" strokeWidth="2.2" strokeLinejoin="round">
                  <path d="M52 74 C30 58, 24 38, 42 40 C56 42, 64 58, 64 72 Z" fill="#86efac" />
                  <path d="M40 44 L56 64" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M168 74 C190 58, 196 38, 178 40 C164 42, 156 58, 156 72 Z" fill="#86efac" />
                  <path d="M180 44 L164 64" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M82 38 C72 18, 80 8, 92 18 C98 24, 96 34, 92 40 Z" fill="#bbf7d0" />
                  <path d="M138 38 C148 18, 140 8, 128 18 C122 24, 124 34, 128 40 Z" fill="#bbf7d0" />
                </g>

                <g fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2">
                  <circle cx="64" cy="30" r="4.5" />
                  <circle cx="73" cy="24" r="3.5" />
                  <circle cx="156" cy="30" r="4.5" />
                  <circle cx="147" cy="24" r="3.5" />
                  <circle cx="36" cy="74" r="4" />
                  <circle cx="184" cy="74" r="4" />
                </g>

                <path
                  d="M38 98 Q52 84 68 96 Q88 82 110 95 Q132 82 152 96 Q168 84 182 98 L168 118 L52 118 Z"
                  fill="#fffdf9"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />

                <g transform="translate(56, 88)">
                  <circle cx="0" cy="0" r="21" fill="#fda4af" stroke="#be123c" strokeWidth="2.4" />
                  <path d="M-12 -4 C-8 -14, 8 -14, 12 -4 C15 6, 2 14, -8 8 C-14 4, -10 -6, -2 -6 C4 -6, 6 0, 0 3" stroke="#fff1f2" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                </g>

                <g transform="translate(164, 88)">
                  <circle cx="0" cy="0" r="21" fill="#fda4af" stroke="#be123c" strokeWidth="2.4" />
                  <path d="M-12 -4 C-8 -14, 8 -14, 12 -4 C15 6, 2 14, -8 8 C-14 4, -10 -6, -2 -6 C4 -6, 6 0, 0 3" stroke="#fff1f2" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                </g>

                <g transform="translate(76, 60)">
                  <circle cx="0" cy="0" r="24" fill="#fb7185" stroke="#9f1239" strokeWidth="2.5" />
                  <circle cx="0" cy="-1" r="16" fill="#f43f5e" />
                  <path d="M-13 -3 C-9 -15, 9 -15, 13 -3 C16 8, 2 15, -9 9 C-15 5, -11 -7, -2 -7 C5 -7, 7 0, 0 4" stroke="#ffe4e6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>

                <g transform="translate(144, 60)">
                  <circle cx="0" cy="0" r="24" fill="#fb7185" stroke="#9f1239" strokeWidth="2.5" />
                  <circle cx="0" cy="-1" r="16" fill="#f43f5e" />
                  <path d="M-13 -3 C-9 -15, 9 -15, 13 -3 C16 8, 2 15, -9 9 C-15 5, -11 -7, -2 -7 C5 -7, 7 0, 0 4" stroke="#ffe4e6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>

                <g transform="translate(110, 48)">
                  <circle cx="0" cy="0" r="28" fill="#f43f5e" stroke="#881337" strokeWidth="2.8" />
                  <circle cx="0" cy="-1" r="19" fill="#e11d48" />
                  <path
                    d="M-16 -4 C-11 -18, 11 -18, 16 -4 C19 9, 3 18, -11 11 C-18 6, -13 -8, -3 -8 C6 -8, 9 0, 0 5"
                    stroke="#fff1f2"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                <g transform="translate(110, 86)">
                  <circle cx="0" cy="0" r="21" fill="#fb7185" stroke="#9f1239" strokeWidth="2.5" />
                  <path d="M-11 -3 C-7 -12, 7 -12, 11 -3 C13 6, 2 12, -7 7 C-12 3, -9 -5, -2 -5 C4 -5, 5 0, 0 3" stroke="#fff1f2" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                </g>

                <path
                  d="M42 100 L110 116 L178 100 L133 184 C127 192, 93 192, 87 184 Z"
                  fill="#fef3c7"
                  stroke={theme.accentColor}
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M110 116 L178 100 L133 184 C129 189, 118 191, 108 190 Z"
                  fill="#fde68a"
                  fillOpacity="0.55"
                />
                <line x1="110" y1="116" x2="108" y2="189" stroke={theme.accentColor} strokeWidth="2" strokeOpacity="0.45" />

                <g transform="translate(110, 144)">
                  <path d="M-6 4 C-14 14, -22 24, -28 32 L-18 29 L-14 35 C-10 25, -5 14, -2 6 Z" fill="#e11d48" stroke="#881337" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M6 4 C14 14, 22 24, 28 32 L18 29 L14 35 C10 25, 5 14, 2 6 Z" fill="#e11d48" stroke="#881337" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M-3 0 C-18 -14, -34 -10, -30 3 C-27 13, -12 9, -3 2 Z" fill="#fb7185" stroke="#881337" strokeWidth="2.2" />
                  <path d="M3 0 C18 -14, 34 -10, 30 3 C27 13, 12 9, 3 2 Z" fill="#fb7185" stroke="#881337" strokeWidth="2.2" />
                  <path d="M-20 -2 Q-13 0 -7 1 M20 -2 Q13 0 7 1" stroke="#ffe4e6" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="0" cy="1" r="6.5" fill="#f43f5e" stroke="#881337" strokeWidth="2.2" />
                </g>
              </svg>
            </div>

            {/* Finale Text Cleanly Underneath the Rose Bouquet + Small Surprise Prompt */}
            <div className={`mt-2 sm:mt-3 text-center pointer-events-auto ${readOnly ? 'max-w-[76%]' : 'max-w-[68%]'}`}>
              {activeTexts.line1 && (
                <h2
                  className={`font-bubble font-black ${readOnly ? 'text-[clamp(1.25rem,3.8vw,3.1rem)]' : 'text-[clamp(1.05rem,3.1vw,2.2rem)]'} tracking-[0.05em] leading-[1.1]`}
                  style={{
                    color: theme.accentColor,
                    WebkitTextStroke: '0.4px rgba(255,255,255,0.45)',
                    filter:
                      'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1.5px 0 #ffffff) drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 3px 6px rgba(27, 60, 110, 0.15))',
                  }}
                >
                  {activeTexts.line1}
                </h2>
              )}

              {activeTexts.line2 && (
                <h2
                  className={`font-bubble font-black ${readOnly ? 'text-[clamp(1.35rem,4.0vw,3.3rem)]' : 'text-[clamp(1.1rem,3.25vw,2.3rem)]'} tracking-[0.05em] leading-[1.12] mt-0.5 sm:mt-1`}
                  style={{
                    color: theme.accentColor,
                    WebkitTextStroke: '0.4px rgba(255,255,255,0.45)',
                    filter:
                      'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1.5px 0 #ffffff) drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 3px 6px rgba(27, 60, 110, 0.15))',
                  }}
                >
                  {activeTexts.line2}
                </h2>
              )}

              {activeTexts.subPrompt && (
                <p
                  onClick={handleOpenSurpriseNote}
                  className={`mt-1.5 sm:mt-2 font-sans-clean font-bold ${readOnly ? 'text-[clamp(0.82rem,1.5vw,1.25rem)]' : 'text-[clamp(0.66rem,1.25vw,0.92rem)]'} tracking-[0.03em] cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-97`}
                  style={{
                    color: theme.accentColor,
                    filter:
                      'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 1.5px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff)',
                  }}
                >
                  {activeTexts.subPrompt}
                </p>
              )}
            </div>
          </div>

          {/* 7. Bottom-Left GIF: Finger-Guns Dudu */}
          <div
            onClick={(e) => {
              sounds.playPop();
              const rect = e.currentTarget.getBoundingClientRect();
              firePaperConfetti(
                (rect.left + rect.width / 2) / window.innerWidth,
                (rect.top + rect.height / 2) / window.innerHeight,
                theme
              );
            }}
            className={`absolute bottom-0 left-[1.5%] sm:left-[2.2%] ${readOnly ? 'w-[25%] sm:w-[27%] max-w-[340px]' : 'w-[22.8%] sm:w-[24.2%] max-w-[235px]'} aspect-square z-25 cursor-pointer select-none origin-bottom-left transition-transform duration-200 hover:scale-106 active:scale-95`}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(27, 60, 110, 0.22))',
            }}
            title="Biu~ It's a date! 👉💖"
          >
            <img
              src={activePhotos.leftPhoto}
              onError={(e) => {
                if (activePhotos.leftPhoto === DEFAULT_ALL_PAGES_PHOTOS.page9.leftPhoto) {
                  const target = e.currentTarget;
                  if (target.src !== 'https://media.tenor.com/3qIAMwBVG8UAAAAi/finger-guns-dudu.gif') {
                    target.src = 'https://media.tenor.com/3qIAMwBVG8UAAAAi/finger-guns-dudu.gif';
                  }
                }
              }}
              alt="Dudu doing cute finger guns"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-bottom translate-y-[3.7%] pointer-events-none"
            />
          </div>

          {/* 8. Bottom-Right GIF: Happy Dancing Bubu */}
          <div
            onClick={(e) => {
              sounds.playChime();
              const rect = e.currentTarget.getBoundingClientRect();
              firePaperConfetti(
                (rect.left + rect.width / 2) / window.innerWidth,
                (rect.top + rect.height / 2) / window.innerHeight,
                theme
              );
            }}
            className={`absolute bottom-0 right-[1%] sm:right-[1.5%] ${readOnly ? 'w-[28%] sm:w-[30%] max-w-[370px]' : 'w-[26%] sm:w-[27.5%] max-w-[268px]'} aspect-square z-25 cursor-pointer select-none origin-bottom-right transition-transform duration-200 hover:scale-105 active:scale-95`}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(27, 60, 110, 0.22))',
            }}
            title="Yay!! Happy Bubu! 🥰🎉"
          >
            <img
              src={activePhotos.rightPhoto}
              onError={(e) => {
                if (activePhotos.rightPhoto === DEFAULT_ALL_PAGES_PHOTOS.page9.rightPhoto) {
                  const target = e.currentTarget;
                  if (target.src !== 'https://media.tenor.com/Qj40AdvEqKsAAAAi/bubu-happy.gif') {
                    target.src = 'https://media.tenor.com/Qj40AdvEqKsAAAAi/bubu-happy.gif';
                  }
                }
              }}
              alt="Happy excited Bubu panda"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-bottom translate-y-[12%] pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Creator Save + Preview + Custom Share Link Panel right after Page 9 & Surprise Card */}
      {!readOnly && onSaveAll && onStartPreview && (
        <div ref={sharePanelAnchorRef}>
          <SavePreviewSharePanel
            theme={theme}
            hasReviewedSurpriseCard={hasReviewedSurpriseCard}
            onOpenSurpriseCard={() => {
              sounds.playPaperRustle();
              sounds.playChime();
              firePaperConfetti(0.5, 0.45, theme);
              openSurpriseNoteModal();
            }}
            isSaved={isSaved}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            savedSlug={savedSlug}
            saveError={saveError}
            onSaveAll={onSaveAll}
            onStartPreview={onStartPreview}
            autoOpenSharePanel={autoOpenSharePanel || forceExpandShare}
          />
        </div>
      )}

      {/* Final Scrapbook Bouquet Surprise Note Modal */}
      {showSurpriseNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setShowSurpriseNote(false)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#faf5e8] rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-[#efe6d2] my-auto"
            style={{
              boxShadow: '0 25px 60px -15px rgba(27, 60, 110, 0.38)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute -top-2.5 left-10 w-24 h-6 -rotate-3 rounded-xs shadow-2xs border-y border-dashed pointer-events-none"
              style={{
                backgroundColor: `${theme.scallopColor}cc`,
                borderColor: `${theme.accentColor}40`,
              }}
            />
            <div
              className="absolute -top-2.5 right-10 w-24 h-6 rotate-3 rounded-xs shadow-2xs border-y border-dashed pointer-events-none"
              style={{
                backgroundColor: '#fecdd3cc',
                borderColor: '#e11d4840',
              }}
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#e5ddc7] relative z-10">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 42 38" className="w-8 h-8 shrink-0 -rotate-3" fill="none">
                  <rect x="4" y="9" width="28" height="21" rx="4" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                  <path d="M5 11 L18 21 L31 11" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="31" cy="12" r="8" fill="#f43f5e" stroke="#881337" strokeWidth="1.8" />
                  <path
                    d="M27.5 11.5 C28.5 8, 33.5 8, 34.5 11.5 C35 14, 31.5 15.5, 29 14 C27.5 13, 28.5 10.5, 30.8 10.5"
                    stroke="#fff1f2"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                <h3
                  className="font-bubble text-lg sm:text-2xl font-black tracking-wide"
                  style={{ color: theme.accentColor }}
                >
                  A Little Bouquet Surprise Note
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {!readOnly && onOpenNoteEditor && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setShowSurpriseNote(false);
                      onOpenNoteEditor();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6f1e2] border border-[#dacfb7] text-[#1b3c6e] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Edit Note</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sounds.playPop();
                    setShowSurpriseNote(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  aria-label="Close surprise note"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <SurpriseNotePaper data={surpriseNote} theme={theme} />
            </div>

            {/* Creator Save / Preview / Share Link bar right inside the Surprise Card modal */}
            {!readOnly && onSaveAll && onStartPreview && (
              <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-[#e5ddc7] shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    {isSaved && !hasUnsavedChanges
                      ? 'All 9 pages & note saved! Ready to preview or share:'
                      : 'Happy with all 9 pages & your Surprise Card?'}
                  </span>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async (e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (rect.left + rect.width / 2) / window.innerWidth;
                      const y = (rect.top + rect.height / 2) / window.innerHeight;
                      sounds.playPop();
                      const res = await onSaveAll(savedSlug || undefined);
                      if (res) {
                        sounds.playChime();
                        firePaperConfetti(x, y, theme);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition-transform hover:scale-103 active:scale-97 cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    style={{
                      backgroundColor:
                        isSaved && !hasUnsavedChanges ? '#059669' : '#e11d48',
                    }}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isSaved && !hasUnsavedChanges ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved ♥</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaved && hasUnsavedChanges ? 'Save Changes' : 'Save'}</span>
                      </>
                    )}
                  </button>
                </div>

                {saveError && (
                  <p className="text-xs text-rose-600 font-medium">{saveError}</p>
                )}

                {isSaved && (
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playChime();
                        setShowSurpriseNote(false);
                        onStartPreview();
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border font-bold text-xs shadow-2xs transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5"
                      style={{
                        borderColor: theme.accentColor,
                        color: theme.accentColor,
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setForceExpandShare(true);
                        setShowSurpriseNote(false);
                        window.setTimeout(() => {
                          sharePanelAnchorRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                          });
                        }, 100);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs shadow-2xs transition-transform hover:scale-102 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#e5ddc7]">
              <button
                onClick={() => {
                  sounds.playChime();
                  firePaperConfetti(0.5, 0.5, theme);
                }}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:scale-103 cursor-pointer flex items-center gap-1.5"
                style={{
                  backgroundColor: theme.btnBg,
                  boxShadow: `0 4px 12px ${theme.btnShadow}`,
                }}
              >
                <PartyPopper className="w-3.5 h-3.5" /> Shower Confetti!
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setShowSurpriseNote(false);
                    onRestartJourney();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1b3c6e] font-bold text-xs border border-[#dacfb7] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Journey
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setShowSurpriseNote(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" /> Keep Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page 9 Text & Photo Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 9"
            fields={PAGE9_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page9}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 9"
            slots={PAGE9_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page9}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
