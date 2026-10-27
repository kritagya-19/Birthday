import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';
import { ArrowLeft } from 'lucide-react';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import { SurpriseBoxOpening } from './SurpriseBoxOpening';
import {
  Page2Texts,
  Page2Photos,
  DEFAULT_ALL_PAGES_TEXTS,
  DEFAULT_ALL_PAGES_PHOTOS,
} from '../utils/pageContentStore';
import {
  PageActionButtons,
  PageTextEditorModal,
  PagePhotosModal,
  TextFieldConfig,
  PhotoSlotConfig,
  renderStylizedBubbleLine,
} from './PageCustomizationModals';

interface SurprisePageProps {
  onBack: () => void;
  onConfirmSurprise: () => void;
  theme?: ColorTheme;
  texts?: Page2Texts;
  onChangeTexts?: (next: Page2Texts) => void;
  photos?: Page2Photos;
  onChangePhotos?: (next: Page2Photos) => void;
  readOnly?: boolean;
}

const PAGE2_TEXT_FIELDS: TextFieldConfig<Page2Texts>[] = [
  { key: 'line1', label: 'Top Headline Line' },
  { key: 'line2', label: 'Second Headline Line' },
  { key: 'buttonText', label: 'Button Text' },
  { key: 'boxBannerText', label: 'Gift Box Pop-Out Banner Text' },
  { key: 'boxTagText', label: 'Gift Box Ribbon Tag Text' },
];

const PAGE2_PHOTO_SLOTS: PhotoSlotConfig<keyof Page2Photos>[] = [
  {
    key: 'sticker',
    label: 'Bottom-Right Sticker / Photo',
    aspectClass: 'aspect-square',
    fitClass: 'object-contain',
  },
];

// 6-petaled flower geometry generator
const create6PetalFlower = (cx: number, cy: number, rInner: number, rOuter: number): string => {
  let path = '';
  for (let i = 0; i < 6; i++) {
    const a0 = ((i * 60 - 30) * Math.PI) / 180;
    const aMid = ((i * 60) * Math.PI) / 180;
    const a1 = ((i * 60 + 30) * Math.PI) / 180;

    const x0 = cx + rInner * Math.cos(a0);
    const y0 = cy + rInner * Math.sin(a0);
    const xMid = cx + rOuter * Math.cos(aMid);
    const yMid = cy + rOuter * Math.sin(aMid);
    const x1 = cx + rInner * Math.cos(a1);
    const y1 = cy + rInner * Math.sin(a1);

    const cp1x = cx + rOuter * 0.96 * Math.cos(a0 + (17 * Math.PI) / 180);
    const cp1y = cy + rOuter * 0.96 * Math.sin(a0 + (17 * Math.PI) / 180);
    const cp2x = cx + rOuter * 1.05 * Math.cos(aMid - (12 * Math.PI) / 180);
    const cp2y = cy + rOuter * 1.05 * Math.sin(aMid - (12 * Math.PI) / 180);

    const cp3x = cx + rOuter * 1.05 * Math.cos(aMid + (12 * Math.PI) / 180);
    const cp3y = cy + rOuter * 1.05 * Math.sin(aMid + (12 * Math.PI) / 180);
    const cp4x = cx + rOuter * 0.96 * Math.cos(a1 - (17 * Math.PI) / 180);
    const cp4y = cy + rOuter * 0.96 * Math.sin(a1 - (17 * Math.PI) / 180);

    if (i === 0) {
      path += `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
    }
    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xMid.toFixed(2)} ${yMid.toFixed(2)}`;
    path += ` C ${cp3x.toFixed(2)} ${cp3y.toFixed(2)}, ${cp4x.toFixed(2)} ${cp4y.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  path += ' Z';
  return path;
};

const outerFlowerPath = create6PetalFlower(50, 50, 23, 46.5);
const insetFlowerPath = create6PetalFlower(50, 50, 20, 41.5);
const innerFlowerPath = create6PetalFlower(50, 50, 12.5, 26.5);

export const SurprisePage: React.FC<SurprisePageProps> = ({
  onBack,
  onConfirmSurprise,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const [localTexts, setLocalTexts] = useState<Page2Texts>(DEFAULT_ALL_PAGES_TEXTS.page2);
  const [localPhotos, setLocalPhotos] = useState<Page2Photos>(DEFAULT_ALL_PAGES_PHOTOS.page2);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page2Texts) => {
    if (onChangeTexts) {
      onChangeTexts(next);
    } else {
      setLocalTexts(next);
    }
  };

  const handleUpdatePhotos = (next: Page2Photos) => {
    if (onChangePhotos) {
      onChangePhotos(next);
    } else {
      setLocalPhotos(next);
    }
  };

  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isFlowerHovered, setIsFlowerHovered] = useState(false);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  const handleYesClick = () => {
    setIsOpeningBox(true);
  };

  const handleFlowerClick = () => {
    sounds.playPaperRustle();
    setIsFlowerHovered(true);
    setTimeout(() => setIsFlowerHovered(false), 600);
  };

  return (
    <div
      className={`relative w-full mx-auto px-4 select-none animate-in fade-in zoom-in-98 duration-300 ${
        readOnly ? 'max-w-[min(95vw,calc(82vh*2.07))]' : 'max-w-5xl'
      }`}
    >
      {/* Surprise Box Opening & Sparkles Animation Modal */}
      <AnimatePresence>
        {isOpeningBox && (
          <SurpriseBoxOpening
            theme={theme}
            bannerText={activeTexts.boxBannerText}
            tagText={activeTexts.boxTagText}
            onComplete={() => {
              setIsOpeningBox(false);
              onConfirmSurprise();
            }}
          />
        )}
      </AnimatePresence>

      {/* Top navigation & edit controls bar */}
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
          <PageActionButtons
            onOpenTextEditor={() => setIsTextModalOpen(true)}
            onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
            photoCount={1}
            theme={theme}
          />
        )}
      </div>

      {/* Main 2:1 Card Frame */}
      <div
        className="relative w-full aspect-[717/346] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all duration-300"
        style={{
          boxShadow:
            '0 22px 50px -10px rgba(27, 60, 110, 0.32), 0 4px 18px rgba(27, 60, 110, 0.15)',
        }}
      >
        <div className={`relative w-full h-full overflow-hidden ${theme.ginghamClass}`}>
          <div className={`absolute inset-0 ${theme.ginghamClass}`} />

          {/* Subtle paper grain */}
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

          {/* TOP-LEFT FELT / CARDSTOCK FLOWER CUTOUT */}
          <div
            onClick={handleFlowerClick}
            className={`absolute -top-4 sm:-top-6 -left-4 sm:-left-6 ${readOnly ? 'w-[22%] max-w-[210px]' : 'w-[20%] max-w-[150px]'} aspect-square z-20 cursor-pointer transition-transform duration-300 ease-out origin-center ${
              isFlowerHovered ? 'scale-115' : 'hover:scale-105'
            }`}
            style={{
              filter: 'drop-shadow(3px 5px 8px rgba(24, 52, 90, 0.25))',
            }}
            title="Clockwise rotating flower! Click me!"
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible animate-flower-spin"
              style={{ transformOrigin: '50px 50px' }}
            >
              <path
                d={outerFlowerPath}
                fill={theme.flowerOuter || '#7198c2'}
                stroke={theme.flowerInner || '#4d749d'}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d={insetFlowerPath}
                fill="none"
                stroke={theme.flowerInner || '#486f97'}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d={innerFlowerPath}
                fill={theme.flowerInner || '#486e97'}
                stroke={theme.flowerDot || '#315276'}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="50"
                cy="50"
                r="7.5"
                fill={theme.scallopColor || '#8db4db'}
                stroke={theme.flowerDot || '#315276'}
                strokeWidth="1.8"
              />
            </svg>
          </div>

          {/* CENTER HEADLINE & YES BUTTON */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-6">
            {activeTexts.line1 && (
              <h1
                className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.35rem,4.4vw,4.4rem)]' : 'text-[clamp(1.15rem,3.8vw,2.9rem)]'} leading-[1.08] tracking-[0.06em]`}
                style={{
                  color: theme.accentColor,
                  filter:
                    'drop-shadow(0 0 1px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 3px 5px rgba(0,0,0,0.15))',
                }}
              >
                {renderStylizedBubbleLine(activeTexts.line1)}
              </h1>
            )}

            {activeTexts.line2 && (
              <h2
                className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.55rem,5vw,5rem)]' : 'text-[clamp(1.35rem,4.4vw,3.4rem)]'} leading-[1.1] tracking-[0.07em] mt-0.5 sm:mt-1.5`}
                style={{
                  color: theme.accentColor,
                  filter:
                    'drop-shadow(0 0 1px #ffffff) drop-shadow(0 2px 0 #ffffff) drop-shadow(0 -1px 0 #ffffff) drop-shadow(1px 0 0 #ffffff) drop-shadow(-1px 0 0 #ffffff) drop-shadow(0 3px 5px rgba(0,0,0,0.15))',
                }}
              >
                {renderStylizedBubbleLine(activeTexts.line2)}
              </h2>
            )}

            {/* YES BUTTON */}
            <div className="relative mt-3 sm:mt-5 pointer-events-auto flex items-center justify-center">
              <button
                onClick={handleYesClick}
                onMouseEnter={() => {
                  sounds.playClick();
                  setIsBtnHovered(true);
                }}
                onMouseLeave={() => setIsBtnHovered(false)}
                className={`relative group ${readOnly ? 'px-11 sm:px-20 py-2.5 sm:py-5 text-[clamp(1rem,2.2vw,1.85rem)]' : 'px-8 sm:px-14 py-2 sm:py-3.5 text-[clamp(0.85rem,1.9vw,1.4rem)]'} rounded-full text-white font-sans-clean font-extrabold tracking-[0.16em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/50 z-20`}
                style={{
                  backgroundColor: isBtnHovered ? theme.btnHover : theme.btnBg,
                  boxShadow: `0 8px 24px ${theme.btnShadow}`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }}
              >
                <span className="relative z-10">{activeTexts.buttonText}</span>
                <span className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none" />
              </button>
            </div>
          </div>

          {/* BUBU DUDU GIF STICKER */}
          <div
            className={`absolute bottom-0 ${readOnly ? 'right-[10%] sm:right-[13%] md:right-[15%] w-36 sm:w-56 md:w-72 lg:w-80' : 'right-[12%] sm:right-[16%] md:right-[19%] w-28 sm:w-40 md:w-48'} aspect-square pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 z-10 select-none`}
            onClick={(e) => {
              e.stopPropagation();
              sounds.playPaperRustle();
            }}
            title="Cute Bubu Dudu bear! Tap me!"
          >
            <img
              src={activePhotos.sticker}
              onError={(e) => {
                if (activePhotos.sticker === DEFAULT_ALL_PAGES_PHOTOS.page2.sticker) {
                  (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/bubududu.gif';
                }
              }}
              alt="Cute Bubu Dudu bear"
              decoding="async"
              className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(20,40,70,0.2)]"
            />
          </div>

          {/* BOTTOM TORN PAPER SCRAPBOOK DESIGN */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            <img
              src="/assets/aistudio/Untitled_Design__4_-Photoroom_f0e4dcf9.png"
              alt="Scrapbook bottom torn paper design"
              decoding="async"
              className="w-full h-full object-fill pointer-events-none select-none transition-[filter] duration-500 ease-out"
              style={{
                filter: theme.scrapbookFilter || theme.balloonFilter || 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Page 2 Text & Photo Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 2"
            fields={PAGE2_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page2}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 2"
            slots={PAGE2_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page2}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
