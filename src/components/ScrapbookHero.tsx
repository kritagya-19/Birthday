import React, { useState } from 'react';
import {
  ExclamationSticker,
  StarsSticker,
  ScallopFrame,
  RetroPointerCursor,
  SoftSparkle,
} from './ScrapbookAssets';
import { sounds } from '../utils/audio';
import { firePaperConfetti } from '../utils/confetti';
import { ColorTheme, THEMES } from '../theme/colorThemes';
import {
  Page1Texts,
  Page1Photos,
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

interface ScrapbookHeroProps {
  onOpenMessage: () => void;
  accentColor?: string;
  scallopColor?: string;
  ginghamClass?: string;
  themeTitle?: string;
  theme?: ColorTheme;
  texts?: Page1Texts;
  onChangeTexts?: (next: Page1Texts) => void;
  photos?: Page1Photos;
  onChangePhotos?: (next: Page1Photos) => void;
  readOnly?: boolean;
}

const PAGE1_TEXT_FIELDS: TextFieldConfig<Page1Texts>[] = [
  { key: 'line1', label: 'Top Headline Line' },
  { key: 'line2', label: 'Second Headline Line' },
  { key: 'buttonText', label: 'Action Button Text' },
];

const PAGE1_PHOTO_SLOTS: PhotoSlotConfig<keyof Page1Photos>[] = [
  {
    key: 'sticker',
    label: 'Bottom-Right Sticker / Photo',
    aspectClass: 'aspect-square',
    fitClass: 'object-contain',
  },
];

export const ScrapbookHero: React.FC<ScrapbookHeroProps> = ({
  onOpenMessage,
  accentColor,
  scallopColor,
  ginghamClass,
  theme = THEMES[0],
  texts,
  onChangeTexts,
  photos,
  onChangePhotos,
  readOnly = false,
}) => {
  const activeAccent = accentColor || theme.accentColor;
  const activeScallop = scallopColor || theme.scallopColor;
  const activeGingham = ginghamClass || theme.ginghamClass;

  const [localTexts, setLocalTexts] = useState<Page1Texts>(DEFAULT_ALL_PAGES_TEXTS.page1);
  const [localPhotos, setLocalPhotos] = useState<Page1Photos>(DEFAULT_ALL_PAGES_PHOTOS.page1);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

  const activeTexts = texts ?? localTexts;
  const activePhotos = photos ?? localPhotos;

  const handleUpdateTexts = (next: Page1Texts) => {
    if (onChangeTexts) {
      onChangeTexts(next);
    } else {
      setLocalTexts(next);
    }
  };

  const handleUpdatePhotos = (next: Page1Photos) => {
    if (onChangePhotos) {
      onChangePhotos(next);
    } else {
      setLocalPhotos(next);
    }
  };

  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isExclHovered, setIsExclHovered] = useState(false);
  const [isStarHovered, setIsStarHovered] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    sounds.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePaperConfetti(x, y, theme);
    setTimeout(() => {
      onOpenMessage();
    }, 250);
  };

  const handleExclamationClick = () => {
    sounds.playPaperRustle();
    setIsExclHovered(true);
    setTimeout(() => setIsExclHovered(false), 500);
  };

  const handleStarClick = (e?: React.MouseEvent) => {
    sounds.playChime();
    setIsStarHovered(true);
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      firePaperConfetti(x, y, theme);
    } else {
      firePaperConfetti(0.8, 0.45, theme);
    }
    setTimeout(() => setIsStarHovered(false), 500);
  };

  return (
    <div
      className={`relative w-full mx-auto px-4 select-none ${
        readOnly ? 'max-w-[min(95vw,calc(84vh*1.79))]' : 'max-w-5xl'
      }`}
    >
      {/* Top Controls Bar */}
      {!readOnly && (
        <div className="flex items-center justify-end mb-3 text-xs">
          <PageActionButtons
            onOpenTextEditor={() => setIsTextModalOpen(true)}
            onOpenPhotoEditor={() => setIsPhotosModalOpen(true)}
            photoCount={1}
            theme={theme}
          />
        </div>
      )}

      {/* Main 16:9 Aspect Ratio Scrapbook Canvas Frame */}
      <div
        className={`relative w-full aspect-[1024/572] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500 ${activeGingham}`}
        style={{
          boxShadow:
            '0 20px 45px -12px rgba(27, 60, 110, 0.28), 0 4px 16px rgba(27, 60, 110, 0.12)',
        }}
      >
        {/* Subtle paper grain texture layer */}
        <div className="absolute inset-0 paper-texture pointer-events-none" />

        {/* 1. SCALLOPED OUTER PAPER BORDER */}
        <ScallopFrame color={activeScallop} />

        {/* 2. LEFT DECORATIVE ELEMENT: EXCLAMATION MARK STICKER */}
        <div
          className={`absolute left-[6.5%] sm:left-[7.5%] top-[18%] sm:top-[20%] ${readOnly ? 'w-[19%] max-w-[250px]' : 'w-[17%] max-w-[170px]'} aspect-[160/300] transform rotate-[11deg] origin-center z-10 transition-transform duration-300 ${
            isExclHovered ? 'scale-110 rotate-[15deg]' : 'hover:scale-105 hover:rotate-[13deg]'
          }`}
        >
          <ExclamationSticker
            accentColor={activeAccent}
            onClick={handleExclamationClick}
          />
        </div>

        {/* 3. CENTER HEADLINE & ACTION BUTTON */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none px-6">
          {/* Typography Group */}
          <div className={`flex flex-col items-center justify-center tracking-wide -mt-2 sm:-mt-4 ${readOnly ? 'max-w-[76%]' : 'max-w-[68%]'}`}>
            {activeTexts.line1 && (
              <h1
                className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.4rem,4.6vw,4.5rem)]' : 'text-[clamp(1.25rem,4.2vw,3.5rem)]'} leading-[1.05] tracking-[0.04em] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]`}
                style={{
                  color: activeAccent,
                  WebkitTextStroke: '0.5px rgba(255,255,255,0.4)',
                }}
              >
                {renderTiltedWords(activeTexts.line1)}
              </h1>
            )}

            {activeTexts.line2 && (
              <h2
                className={`font-bubble font-extrabold ${readOnly ? 'text-[clamp(1.5rem,4.9vw,4.8rem)]' : 'text-[clamp(1.35rem,4.5vw,3.75rem)]'} leading-[1.1] tracking-[0.05em] mt-0.5 sm:mt-1 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]`}
                style={{
                  color: activeAccent,
                  WebkitTextStroke: '0.5px rgba(255,255,255,0.4)',
                }}
              >
                {renderTiltedWords(activeTexts.line2)}
              </h2>
            )}
          </div>

          {/* 4. BUTTON WITH RETRO POINTER CURSOR */}
          <div className="relative mt-3 sm:mt-5 pointer-events-auto flex items-center justify-center">
            <button
              onClick={handleButtonClick}
              onMouseEnter={() => {
                sounds.playClick();
                setIsBtnHovered(true);
              }}
              onMouseLeave={() => setIsBtnHovered(false)}
              className={`relative group ${readOnly ? 'px-8 sm:px-14 py-2.5 sm:py-4.5 text-[clamp(0.85rem,2vw,1.55rem)]' : 'px-6 sm:px-11 py-2 sm:py-3.5 text-[clamp(0.75rem,1.7vw,1.3rem)]'} rounded-full text-white font-sans-clean font-bold tracking-[0.14em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer`}
              style={{
                backgroundColor: isBtnHovered ? theme.btnHover : theme.btnBg,
                boxShadow: `0 8px 24px ${theme.btnShadow}`,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              <span className="relative z-10 whitespace-nowrap">{activeTexts.buttonText}</span>
              {/* Subtle glossy bevel highlight */}
              <span className="absolute inset-0 rounded-full border-t border-white/25 pointer-events-none" />
            </button>

            {/* Retro Mouse Cursor Arrow positioned at bottom-right corner of button */}
            <div className="absolute -bottom-4 sm:-bottom-5 -right-3 sm:-right-4 z-20">
              <RetroPointerCursor isHovered={isBtnHovered} />
            </div>
          </div>
        </div>

        {/* 5. RIGHT DECORATIVE ELEMENT: TWO STARS STICKER */}
        <div
          className={`absolute right-[3.5%] sm:right-[4.5%] top-[23%] sm:top-[25%] ${readOnly ? 'w-[26%] max-w-[320px]' : 'w-[24%] max-w-[240px]'} aspect-[240/230] transform -rotate-[4deg] origin-center z-10 transition-transform duration-300 ${
            isStarHovered ? 'scale-110 -rotate-[8deg]' : 'hover:scale-105 hover:-rotate-[2deg]'
          }`}
        >
          <StarsSticker
            accentColor={activeAccent}
            onClick={handleStarClick}
          />
        </div>

        {/* 6. BUBU DUDU LOVE GIF (Bottom-Right Side of CLICK HERE Button) */}
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
          className={`absolute left-[60%] sm:left-[61%] bottom-[4.5%] sm:bottom-[5%] ${readOnly ? 'w-[20%] sm:w-[22%] max-w-[260px]' : 'w-[16.5%] sm:w-[17.5%] max-w-[178px]'} z-25 cursor-pointer select-none origin-bottom transition-transform duration-200 hover:scale-108 active:scale-95`}
          style={{
            filter: 'drop-shadow(0 4px 10px rgba(27, 60, 110, 0.2))',
          }}
          title="You've got a love message! 💌"
        >
          <img
            src={activePhotos.sticker}
            onError={(e) => {
              if (activePhotos.sticker === DEFAULT_ALL_PAGES_PHOTOS.page1.sticker) {
                const target = e.currentTarget;
                if (target.src !== 'https://media.tenor.com/Kyu4f_2c38MAAAAi/bubu-dudu-love.gif') {
                  target.src = 'https://media.tenor.com/Kyu4f_2c38MAAAAi/bubu-dudu-love.gif';
                }
              }
            }}
            alt="Cute Bubu holding phone with love heart"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain object-bottom pointer-events-none"
          />
        </div>

        {/* 7. SUBTLE CORNER SPARKLE (Bottom Right) */}
        <div className="absolute right-[8%] bottom-[12%] z-10">
          <SoftSparkle size={26} />
        </div>
      </div>

      {/* Page 1 Text & Photo Customization Modals */}
      {!readOnly && (
        <>
          <PageTextEditorModal
            isOpen={isTextModalOpen}
            onClose={() => setIsTextModalOpen(false)}
            pageTitle="Page 1"
            fields={PAGE1_TEXT_FIELDS}
            values={activeTexts}
            defaultValues={DEFAULT_ALL_PAGES_TEXTS.page1}
            onChange={handleUpdateTexts}
            theme={theme}
          />

          <PagePhotosModal
            isOpen={isPhotosModalOpen}
            onClose={() => setIsPhotosModalOpen(false)}
            pageTitle="Page 1"
            slots={PAGE1_PHOTO_SLOTS}
            photos={activePhotos}
            defaultPhotos={DEFAULT_ALL_PAGES_PHOTOS.page1}
            onChange={handleUpdatePhotos}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};
