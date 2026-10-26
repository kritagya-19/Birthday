import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ArrowLeft } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page8Texts,
  Page8Photos,
  DEFAULT_ALL_PAGES_TEXTS,
  DEFAULT_ALL_PAGES_PHOTOS,
} from '../utils/pageContentStore';
import {
  PageActionButtons,
  PageTextEditorModal,
  PagePhotosModal,
  TextFieldConfig,
  PhotoSlotConfig,
  renderTiltedWords,
} from './PageCustomizationModals';

interface DateProposalPageProps {
  onBack: () => void;
  onNextPage?: () => void;
  onYesAccept?: () => void;
  onRestartJourney?: () => void;
  theme?: ColorTheme;
  texts?: Page8Texts;
  onChangeTexts?: (next: Page8Texts) => void;
  photos?: Page8Photos;
  onChangePhotos?: (next: Page8Photos) => void;
  readOnly?: boolean;
}

const PAGE8_TEXT_FIELDS: TextFieldConfig<Page8Texts>[] = [
  { key: 'line1', label: 'Top Proposal Headline' },
  { key: 'line2', label: 'Second Proposal Headline' },
  { key: 'yesButtonText', label: 'Center Button Text' },
  { key: 'ticketMainText', label: 'Ticket Sticker Main Label' },
  { key: 'ticketSubText', label: 'Ticket Sticker Sub Label' },
];

const PAGE8_PHOTO_SLOTS: PhotoSlotConfig<keyof Page8Photos>[] = [
  {
    key: 'sticker',
    label: 'Center-Bottom Sticker / Photo',
    aspectClass: 'aspect-square',
    fitClass: 'object-contain',
  },
];

export const DateProposalPage: React.FC<DateProposalPageProps> = ({
  onBack,
  onNextPage,
  onYesAccept,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page8Texts>(DEFAULT_ALL_PAGES_TEXTS.page8);
  const [localPhotos, setLocalPhotos] = useState<Page8Photos>(DEFAULT_ALL_PAGES_PHOTOS.page8);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page8Texts) => {
    if (onChangeTexts) onChangeTexts(next);
    else setLocalTexts(next);
  };

  const handleUpdatePhotos = (next: Page8Photos) => {
    if (onChangePhotos) onChangePhotos(next);
    else setLocalPhotos(next);
  };

  const [hasAccepted, setHasAccepted] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const handleYesClick = (e: React.MouseEvent) => {
    if (hasAccepted) return;
    sounds.playChime();
    setHasAccepted(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePaperConfetti(x, y, theme);

    if (onYesAccept) {
      onYesAccept();
    } else {
      onNextPage?.();
    }
  };

  return (
    <div
      className={`relative w-full mx-auto px-4 select-none animate-in fade-in zoom-in-98 duration-300 ${
        readOnly ? 'max-w-[min(95vw,calc(84vh*1.80))]' : 'max-w-5xl'
      }`}
    >
      {/* Top back & Edit Text controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white font-semibold border shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer"
          style={{ color: theme.accentColor, borderColor: theme.borderHeader }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <PageActionButtons
              onOpenTextEditor={() => setIsTextModalOpen(true)}
              onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
              photoCount={1}
              theme={theme}
            />

            {onNextPage && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onNextPage();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold shadow-xs transition-all hover:scale-103 cursor-pointer"
                style={{
                  backgroundColor: theme.btnBg,
                  color: theme.btnText,
                }}
              >
                Next: Page 9 →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main 687:382 Card Frame */}
      <div
        className="relative w-full aspect-[687/382] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all duration-300"
        style={{
          boxShadow:
            '0 24px 50px -10px rgba(35, 75, 120, 0.35), 0 6px 20px rgba(35, 75, 120, 0.15)',
        }}
      >
        <div className={`relative w-full h-full overflow-hidden select-none ${theme.ginghamClass}`}>
          {/* 1. Gingham check pattern & subtle paper texture */}
          <div className={`absolute inset-0 pointer-events-none ${theme.ginghamClass}`} />
          <div className="absolute inset-0 paper-texture pointer-events-none" />

          {/* 2. Top-Left Sparkle Diamond Stickers */}
          <div
            onClick={() => sounds.playPaperRustle()}
            className="absolute left-[3%] top-[5%] z-20 cursor-pointer group animate-star-twinkle"
            title="Diamond sparkles"
          >
            <svg
              viewBox="0 0 70 100"
              className="w-[clamp(36px,6.8vw,62px)] h-auto drop-shadow-[0_3px_6px_rgba(28,52,86,0.22)] transition-transform duration-200 group-hover:scale-115 group-active:scale-95"
              fill="none"
            >
              <g className="transition-transform group-hover:rotate-6">
                <path
                  d="M26 4 C27 16, 32 21, 44 22 C32 23, 27 28, 26 40 C25 28, 20 23, 8 22 C20 21, 25 16, 26 4 Z"
                  fill="#ffffff"
                />
                <path
                  d="M26 9 C26.8 17, 30.5 20.7, 39 22 C30.5 23.3, 26.8 27, 26 35 C25.2 27, 21.5 23.3, 13 22 C21.5 20.7, 25.2 17, 26 9 Z"
                  fill={theme.scallopColor}
                />
              </g>
              <g className="transition-transform group-hover:-rotate-6" transform="translate(18, 38)">
                <path
                  d="M20 4 C21 14, 25 18, 35 19 C25 20, 21 24, 20 34 C19 24, 15 20, 5 19 C15 18, 19 14, 20 4 Z"
                  fill="#ffffff"
                />
                <path
                  d="M20 8 C20.6 14.5, 23.5 17.5, 30 19 C23.5 20.5, 20.6 23.5, 20 30 C19.4 23.5, 16.5 20.5, 10 19 C16.5 17.5, 19.4 14.5, 20 8 Z"
                  fill={theme.accentColor}
                  fillOpacity="0.75"
                />
              </g>
            </svg>
          </div>

          {/* 3. Top-Right: Love Invite Envelope with Wax Heart Seal */}
          <div
            onClick={(e) => {
              sounds.playPaperRustle();
              const rect = e.currentTarget.getBoundingClientRect();
              firePaperConfetti(
                (rect.left + rect.width / 2) / window.innerWidth,
                (rect.top + rect.height / 2) / window.innerHeight,
                theme
              );
            }}
            className="absolute right-[3.5%] top-[5.5%] z-20 cursor-pointer group animate-date-envelope"
            style={{
              filter: 'drop-shadow(2px 6px 12px rgba(28, 52, 86, 0.22))',
            }}
            title="Date Night Love Invite"
          >
            <svg
              viewBox="0 0 110 86"
              className="w-[clamp(48px,9vw,88px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <rect
                x="6"
                y="14"
                width="88"
                height="62"
                rx="10"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="8"
              />
              <g transform="translate(76, -2) rotate(14)">
                <path
                  d="M12 21 C11 20, 2 13, 2 7.5 C2 4, 4.8 1.5, 8 1.5 C10 1.5, 11.3 2.8, 12 4 C12.7 2.8, 14 1.5, 16 1.5 C19.2 1.5, 22 4, 22 7.5 C22 13, 13 20, 12 21 Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20 C11 19, 3 12.5, 3 7.5 C3 4.5, 5.4 2.5, 8 2.5 C9.8 2.5, 11.2 3.6, 12 4.8 C12.8 3.6, 14.2 2.5, 16 2.5 C18.6 2.5, 21 4.5, 21 7.5 C21 12.5, 13 19, 12 20 Z"
                  fill="#f43f5e"
                />
              </g>
              <rect
                x="9"
                y="17"
                width="82"
                height="56"
                rx="7"
                fill="#fff7ed"
                stroke={theme.accentColor}
                strokeWidth="2.5"
              />
              <path
                d="M11 71 L43 44 M89 71 L57 44"
                stroke="#fed7aa"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M10 19 L50 50 L90 19"
                fill="#fde68a"
                fillOpacity="0.45"
                stroke={theme.accentColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M50 58 C49 57, 38 49, 38 42.5 C38 38.5, 41 36, 44.5 36 C47 36, 49 37.5, 50 39.2 C51 37.5, 53 36, 55.5 36 C59 36, 62 38.5, 62 42.5 C62 49, 51 57, 50 58 Z"
                fill="#fb7185"
                stroke="#be123c"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M42 41 C42 39.2, 43.5 38, 45.2 38"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 4. Middle-Left: Shared Milkshake with Two Heart Straws */}
          <div
            onClick={() => sounds.playPop()}
            className="absolute left-[3%] top-[33%] z-20 cursor-pointer group animate-date-milkshake"
            style={{
              filter: 'drop-shadow(2px 7px 13px rgba(28, 52, 86, 0.24))',
            }}
            title="Couple Shared Milkshake"
          >
            <svg
              viewBox="0 0 110 135"
              className="w-[clamp(50px,9.8vw,96px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <g stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
                <path d="M48 44 L34 14 L22 18" />
                <path d="M62 44 L76 14 L88 18" />
                <path d="M30 56 C30 38, 80 38, 80 56 L72 118 C71 123, 66 126, 55 126 C44 126, 39 123, 38 118 Z" fill="#ffffff" />
                <circle cx="55" cy="34" r="9" fill="#ffffff" />
              </g>
              <path d="M48 46 L35 15 L23 19" stroke="#fb7185" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 46 L75 15 L87 19" stroke={theme.accentColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M32 58 L78 58 L71 116 C70 121, 65 124, 55 124 C45 124, 40 121, 39 116 Z"
                fill="#fecdd3"
                stroke={theme.accentColor}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path d="M34 74 Q44 79 55 74 T76 74" stroke="#fda4af" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path
                d="M28 58 C26 48, 36 42, 44 43 C47 36, 63 36, 66 43 C74 42, 84 48, 82 58 Z"
                fill="#fffbeb"
                stroke={theme.accentColor}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <rect x="27" y="55" width="56" height="7" rx="3.5" fill="#ffffff" stroke={theme.accentColor} strokeWidth="2.4" />
              <circle cx="55" cy="34" r="7" fill="#e11d48" stroke={theme.accentColor} strokeWidth="2.2" />
              <path d="M55 27 Q59 20 64 19" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
              <path
                d="M55 103 C54 102, 44 95, 44 89 C44 85.5, 46.8 83, 50 83 C52.2 83, 54 84.3, 55 86 C56 84.3, 57.8 83, 60 83 C63.2 83, 66 85.5, 66 89 C66 95, 56 102, 55 103 Z"
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="2.2"
              />
            </svg>
          </div>

          {/* 5. Middle-Right: Date Night Ticket Stubs (Editable Labels) */}
          <div
            onClick={() => sounds.playPaperRustle()}
            className="absolute right-[2.8%] top-[35%] z-20 cursor-pointer group animate-date-ticket"
            style={{
              filter: 'drop-shadow(2px 7px 13px rgba(28, 52, 86, 0.24))',
            }}
            title="Date Night Tickets"
          >
            <svg
              viewBox="0 0 136 96"
              className="w-[clamp(58px,11.5vw,112px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <g transform="rotate(-8 68 48)">
                <rect x="10" y="16" width="106" height="54" rx="8" fill="#ffffff" stroke="#ffffff" strokeWidth="9" />
              </g>
              <g transform="rotate(5 68 48)">
                <rect x="16" y="24" width="106" height="54" rx="8" fill="#ffffff" stroke="#ffffff" strokeWidth="9" />
              </g>

              <g transform="rotate(-8 68 48)">
                <path
                  d="M12 22 C16 22, 18 19, 18 16 L108 16 C108 19, 110 22, 114 22 L114 62 C110 62, 108 65, 108 68 L18 68 C18 65, 16 62, 12 62 Z"
                  fill="#ffe4e6"
                  stroke="#be123c"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </g>

              <g transform="rotate(5 68 48)">
                <path
                  d="M18 30 C22 30, 24 27, 24 24 L114 24 C114 27, 116 30, 120 30 L120 70 C116 70, 114 73, 114 76 L24 76 C24 73, 22 70, 18 70 Z"
                  fill="#fffbeb"
                  stroke={theme.accentColor}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <line
                  x1="92"
                  y1="27"
                  x2="92"
                  y2="73"
                  stroke={theme.accentColor}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <rect
                  x="27"
                  y="31"
                  width="58"
                  height="38"
                  rx="4"
                  stroke={theme.scallopColor}
                  strokeWidth="1.8"
                />
                <text
                  x="56"
                  y="48"
                  textAnchor="middle"
                  fill={theme.accentColor}
                  fontSize="10.5"
                  fontWeight="900"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  letterSpacing="0.6"
                >
                  {activeTexts.ticketMainText}
                </text>
                <text
                  x="56"
                  y="61"
                  textAnchor="middle"
                  fill="#e11d48"
                  fontSize="8.5"
                  fontWeight="800"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  letterSpacing="0.8"
                >
                  {activeTexts.ticketSubText}
                </text>
                <path
                  d="M106 57 C105.3 56.3, 98 51, 98 46.5 C98 44, 100 42, 102.5 42 C104 42, 105.2 43, 106 44.2 C106.8 43, 108 42, 109.5 42 C112 42, 114 44, 114 46.5 C114 51, 106.7 56.3, 106 57 Z"
                  fill="#f43f5e"
                />
              </g>
            </svg>
          </div>

          {/* 6. Bottom-Left: Wrapped Rose Bouquet with Ribbon Bow */}
          <div
            onClick={() => sounds.playPop()}
            className="absolute left-[4.5%] bottom-[5.5%] z-20 cursor-pointer group animate-date-bouquet"
            style={{
              filter: 'drop-shadow(2px 7px 13px rgba(28, 52, 86, 0.24))',
            }}
            title="Date Night Rose Bouquet"
          >
            <svg
              viewBox="0 0 110 120"
              className="w-[clamp(48px,9.2vw,90px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <g stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" fill="#ffffff">
                <circle cx="38" cy="36" r="16" />
                <circle cx="56" cy="26" r="17" />
                <circle cx="73" cy="37" r="16" />
                <path d="M26 46 L84 46 L62 108 L48 108 Z" />
              </g>
              <path d="M32 46 C22 38, 20 28, 29 30 C35 31, 38 39, 38 45 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
              <path d="M78 46 C88 38, 90 28, 81 30 C75 31, 72 39, 72 45 Z" fill="#86efac" stroke="#15803d" strokeWidth="2" />
              <g>
                <circle cx="38" cy="37" r="13" fill="#fb7185" stroke="#be123c" strokeWidth="2.2" />
                <path d="M33 36 C35 32, 41 32, 42 36 C43 40, 36 42, 35 38" stroke="#fff1f2" strokeWidth="2" strokeLinecap="round" />
                <circle cx="72" cy="38" r="13" fill="#fda4af" stroke="#be123c" strokeWidth="2.2" />
                <path d="M67 37 C69 33, 75 33, 76 37 C77 41, 70 43, 69 39" stroke="#fff1f2" strokeWidth="2" strokeLinecap="round" />
                <circle cx="55" cy="27" r="14.5" fill="#f43f5e" stroke="#9f1239" strokeWidth="2.4" />
                <path d="M49 26 C52 21, 59 21, 60 26 C61 31, 53 33, 51 28" stroke="#fff1f2" strokeWidth="2.2" strokeLinecap="round" />
              </g>
              <path
                d="M27 47 L83 47 L63 106 C61 109, 49 109, 47 106 Z"
                fill="#fef3c7"
                stroke={theme.accentColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M29 47 Q38 41 46 47 Q55 41 64 47 Q73 41 81 47"
                fill="#ffffff"
                stroke={theme.accentColor}
                strokeWidth="2"
              />
              <path d="M55 76 C46 68, 37 70, 40 78 C42 84, 50 80, 55 76 Z" fill="#fb7185" stroke="#9f1239" strokeWidth="1.8" />
              <path d="M55 76 C64 68, 73 70, 70 78 C68 84, 60 80, 55 76 Z" fill="#fb7185" stroke="#9f1239" strokeWidth="1.8" />
              <path d="M52 78 L47 90 M58 78 L63 90" stroke="#9f1239" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="55" cy="76" r="3.5" fill="#ffe4e6" stroke="#9f1239" strokeWidth="1.8" />
            </svg>
          </div>

          {/* 7. Bottom-Right: Clinking Dinner Glasses & Heart */}
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
            className="absolute right-[4.5%] bottom-[8.5%] z-20 cursor-pointer group animate-date-toast"
            style={{
              filter: 'drop-shadow(2px 7px 13px rgba(28, 52, 86, 0.24))',
            }}
            title="Candlelight Toast!"
          >
            <svg
              viewBox="0 0 120 115"
              className="w-[clamp(48px,9.2vw,90px)] h-auto overflow-visible transition-transform duration-200 group-hover:scale-112 group-active:scale-95"
              fill="none"
            >
              <g stroke="#ffffff" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" fill="#ffffff">
                <path d="M60 26 C59 25, 49 18, 49 12.5 C49 9, 51.8 6.5, 55 6.5 C57.2 6.5, 59 7.8, 60 9.5 C61 7.8, 62.8 6.5, 65 6.5 C68.2 6.5, 71 9, 71 12.5 C71 18, 61 25, 60 26 Z" />
                <g transform="rotate(14 42 64)">
                  <path d="M28 34 L56 34 L52 62 C50 70, 34 70, 32 62 Z" />
                  <line x1="42" y1="68" x2="42" y2="96" />
                  <line x1="31" y1="96" x2="53" y2="96" />
                </g>
                <g transform="rotate(-14 78 64)">
                  <path d="M64 34 L92 34 L88 62 C86 70, 70 70, 68 62 Z" />
                  <line x1="78" y1="68" x2="78" y2="96" />
                  <line x1="67" y1="96" x2="89" y2="96" />
                </g>
              </g>
              <path
                d="M60 26 C59 25, 49 18, 49 12.5 C49 9, 51.8 6.5, 55 6.5 C57.2 6.5, 59 7.8, 60 9.5 C61 7.8, 62.8 6.5, 65 6.5 C68.2 6.5, 71 9, 71 12.5 C71 18, 61 25, 60 26 Z"
                fill="#f43f5e"
              />
              <line x1="60" y1="1" x2="60" y2="4" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="44" y1="8" x2="47" y2="10" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="76" y1="8" x2="73" y2="10" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              <g transform="rotate(14 42 64)">
                <path d="M28 34 L56 34 L53 60 C51 69, 33 69, 31 60 Z" fill="#f8fafc" stroke={theme.accentColor} strokeWidth="2.4" strokeLinejoin="round" />
                <path d="M30 47 Q42 44 54 47 L52.5 59 C51 66, 33 66, 31.5 59 Z" fill="#fda4af" />
                <line x1="42" y1="67" x2="42" y2="96" stroke={theme.accentColor} strokeWidth="2.8" strokeLinecap="round" />
                <line x1="31" y1="96" x2="53" y2="96" stroke={theme.accentColor} strokeWidth="2.8" strokeLinecap="round" />
              </g>
              <g transform="rotate(-14 78 64)">
                <path d="M64 34 L92 34 L89 60 C87 69, 69 69, 67 60 Z" fill="#f8fafc" stroke={theme.accentColor} strokeWidth="2.4" strokeLinejoin="round" />
                <path d="M66 47 Q78 50 90 47 L88.5 59 C87 66, 69 66, 67.5 59 Z" fill="#fda4af" />
                <line x1="78" y1="67" x2="78" y2="96" stroke={theme.accentColor} strokeWidth="2.8" strokeLinecap="round" />
                <line x1="67" y1="96" x2="89" y2="96" stroke={theme.accentColor} strokeWidth="2.8" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* 8. Floating Mini Puffy Heart Accents */}
          <div
            onClick={() => sounds.playPop()}
            className="absolute left-[18%] top-[11%] z-15 cursor-pointer animate-date-heart group"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(28, 52, 86, 0.18))' }}
            title="Sweet heart"
          >
            <svg
              viewBox="0 0 32 32"
              className="w-[clamp(18px,3vw,28px)] h-auto -rotate-12 transition-transform duration-200 group-hover:scale-125"
              fill="none"
            >
              <path
                d="M16 28 C16 28 4 20 4 11 C4 6.5 7.5 3 12 3 C14.5 3 16 4.5 16 4.5 C16 4.5 17.5 3 20 3 C24.5 3 28 6.5 28 11 C28 20 16 28 16 28 Z"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M16 26.5 C16 26.5 5 19 5 11 C5 7 8 4 12 4 C14.2 4 15.5 5.5 16 5.5 C16.5 5.5 17.8 4 20 4 C24 4 27 7 27 11 C27 19 16 26.5 16 26.5 Z"
                fill="#fb7185"
              />
            </svg>
          </div>

          <div
            onClick={() => sounds.playPop()}
            className="absolute right-[19%] bottom-[14%] z-15 cursor-pointer animate-date-heart group"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(28, 52, 86, 0.18))',
              animationDelay: '1.1s',
            }}
            title="Sweet heart"
          >
            <svg
              viewBox="0 0 32 32"
              className="w-[clamp(18px,2.8vw,26px)] h-auto rotate-12 transition-transform duration-200 group-hover:scale-125"
              fill="none"
            >
              <path
                d="M16 28 C16 28 4 20 4 11 C4 6.5 7.5 3 12 3 C14.5 3 16 4.5 16 4.5 C16 4.5 17.5 3 20 3 C24.5 3 28 6.5 28 11 C28 20 16 28 16 28 Z"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M16 26.5 C16 26.5 5 19 5 11 C5 7 8 4 12 4 C14.2 4 15.5 5.5 16 5.5 C16.5 5.5 17.8 4 20 4 C24 4 27 7 27 11 C27 19 16 26.5 16 26.5 Z"
                fill={theme.scallopColor}
              />
            </svg>
          </div>

          {/* 9. Unboxed Large Proposal Text + Center YES Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-6">
            <div className={`flex flex-col items-center justify-center tracking-wide -mt-2 sm:-mt-3 pointer-events-auto select-none ${readOnly ? 'max-w-[80%]' : 'max-w-[70%]'}`}>
              {activeTexts.line1 && (
                <h1
                  className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.4rem,4.8vw,4.5rem)]' : 'text-[clamp(1.2rem,4.2vw,3.5rem)]'} leading-[1.06] tracking-[0.04em]`}
                  style={{
                    color: theme.accentColor,
                    WebkitTextStroke: '0.5px rgba(255,255,255,0.45)',
                    filter:
                      'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1.5px 0 #ffffff) drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 3px 6px rgba(27, 60, 110, 0.14))',
                  }}
                >
                  {renderTiltedWords(activeTexts.line1)}
                </h1>
              )}

              {activeTexts.line2 && (
                <h2
                  className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.5rem,5.1vw,4.8rem)]' : 'text-[clamp(1.3rem,4.5vw,3.75rem)]'} leading-[1.1] tracking-[0.05em] mt-0.5 sm:mt-1`}
                  style={{
                    color: theme.accentColor,
                    WebkitTextStroke: '0.5px rgba(255,255,255,0.45)',
                    filter:
                      'drop-shadow(0 0 1.5px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1.5px 0 #ffffff) drop-shadow(1.5px 0 0 #ffffff) drop-shadow(-1.5px 0 0 #ffffff) drop-shadow(0 3px 6px rgba(27, 60, 110, 0.14))',
                  }}
                >
                  {renderTiltedWords(activeTexts.line2)}
                </h2>
              )}
            </div>

            {/* Center YES Button with Corner Hearts */}
            <div className={`mt-4 sm:mt-6 ${readOnly ? 'w-[48%] max-w-[440px]' : 'w-[44%] max-w-[300px]'} pointer-events-auto`}>
              <button
                onClick={handleYesClick}
                onMouseEnter={() => {
                  sounds.playPop();
                  setIsBtnHovered(true);
                }}
                onMouseLeave={() => setIsBtnHovered(false)}
                className={`relative w-full ${readOnly ? 'py-4 sm:py-6 px-8 sm:px-12 rounded-3xl sm:rounded-4xl' : 'py-3 sm:py-4.5 px-6 rounded-2xl sm:rounded-3xl'} border-2 transition-all duration-200 cursor-pointer flex items-center justify-center overflow-hidden group hover:scale-105 active:scale-95`}
                style={{
                  backgroundColor: isBtnHovered ? theme.btnHover : theme.btnBg,
                  borderColor: theme.accentColor,
                  boxShadow: isBtnHovered
                    ? `0 12px 28px ${theme.btnShadow}, inset 0 2px 4px rgba(255, 255, 255, 0.25)`
                    : `0 8px 20px ${theme.btnShadow}, inset 0 1px 2px rgba(255, 255, 255, 0.2)`,
                }}
              >
                {/* Top-Left White Heart Sticker */}
                <div className="absolute left-2.5 sm:left-4 top-2 sm:top-2.5 transition-transform group-hover:scale-110 group-hover:-rotate-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[clamp(15px,2.5vw,22px)] h-[clamp(15px,2.5vw,22px)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <path
                      d="M12 21 C11.5 20.2, 3 14, 3 8 C3 4.5, 5.8 2, 9 2 C11 2, 12 3.5, 12 3.5 C12 3.5, 13 2, 15 2 C18.2 2, 21 4.5, 21 8 C21 14, 12.5 20.2, 12 21 Z"
                      fill="#ffffff"
                      transform="rotate(-10 12 12)"
                    />
                  </svg>
                </div>

                {/* Main Bold Button Text */}
                <span className={`font-bubble text-white font-black ${readOnly ? 'text-[clamp(1.5rem,3.8vw,2.9rem)]' : 'text-[clamp(1.3rem,3.3vw,2.3rem)]'} tracking-[0.08em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] select-none whitespace-nowrap`}>
                  {hasAccepted ? `${activeTexts.yesButtonText} 💖` : activeTexts.yesButtonText}
                </span>

                {/* Bottom-Right White Heart Sticker */}
                <div className="absolute right-2.5 sm:right-4 bottom-2 sm:bottom-2.5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[clamp(15px,2.5vw,22px)] h-[clamp(15px,2.5vw,22px)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                  >
                    <path
                      d="M12 21 C11.5 20.2, 3 14, 3 8 C3 4.5, 5.8 2, 9 2 C11 2, 12 3.5, 12 3.5 C12 3.5, 13 2, 15 2 C18.2 2, 21 4.5, 21 8 C21 14, 12.5 20.2, 12 21 Z"
                      fill="#ffffff"
                      transform="rotate(12 12 12)"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* 10. Cute Dudu GIF on Center-Bottom Part Under YES Button */}
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
            className={`absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 ${readOnly ? 'h-[27%] sm:h-[32%]' : 'h-[21%] sm:h-[26.5%]'} aspect-square z-20 cursor-pointer select-none origin-bottom transition-transform duration-200 hover:scale-108 active:scale-95`}
            style={{
              filter: 'drop-shadow(0 4px 10px rgba(27, 60, 110, 0.2))',
            }}
            title="Please say YES! 🥺💖"
          >
            <img
              src={activePhotos.sticker}
              onError={(e) => {
                if (activePhotos.sticker === DEFAULT_ALL_PAGES_PHOTOS.page8.sticker) {
                  const target = e.currentTarget;
                  if (target.src !== 'https://media.tenor.com/04EF4zhR6LsAAAAi/dudu-dudu-cry.gif') {
                    target.src = 'https://media.tenor.com/04EF4zhR6LsAAAAi/dudu-dudu-cry.gif';
                  }
                }
              }}
              alt="Cute Dudu puppy-eyes bear waiting for date answer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-bottom pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Page 8 Text & Photo Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 8"
            fields={PAGE8_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page8}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 8"
            slots={PAGE8_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page8}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
